"""
Upload Route
============
Handles PDF file uploads and returns a unique file_id for tracking.

Endpoint:
    POST /upload

Request:
    - file: UploadFile (multipart/form-data) — PDF only, max 50MB

Response:
    {
        "file_id": "abc123-...",
        "filename": "paper.pdf",
        "size_bytes": 1024000,
        "status": "uploaded"
    }
"""

import os
import sys
import uuid
import shutil
import fitz
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from models.schemas import UploadResponse
from models.db import get_supabase, SupabaseRESTClient

router = APIRouter()

# Ensure UPLOAD_DIR is an absolute path relative to the backend directory
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
UPLOAD_DIR = os.path.abspath(os.getenv("UPLOAD_DIR", os.path.join(BACKEND_DIR, "uploads")))
MAX_FILE_SIZE = int(os.getenv("MAX_FILE_SIZE_MB", "50")) * 1024 * 1024  # Convert to bytes

# Ensure the upload directory exists
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload", response_model=UploadResponse)
async def upload_pdf(file: UploadFile = File(...), db: SupabaseRESTClient = Depends(get_supabase)):
    """
    Upload a PDF file for forensic analysis.

    Validates:
        - File is a PDF (by content type or extension)
        - File size is within limits

    Returns:
        UploadResponse with unique file_id for subsequent analysis.
    """
    # Validate file type
    valid_mime_types = ["application/pdf", "application/x-pdf"]
    is_valid_type = file.content_type in valid_mime_types
    
    # Fallback to extension check if MIME type is generic binary stream
    if not is_valid_type and file.content_type == "application/octet-stream":
        if file.filename and file.filename.lower().endswith(".pdf"):
            is_valid_type = True
            
    if not is_valid_type:
        raise HTTPException(
            status_code=400,
            detail=f"Only PDF files are accepted. Received: {file.content_type}"
        )

    # Read file content
    content = await file.read()

    # Validate file size
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail=f"File exceeds maximum size of {MAX_FILE_SIZE // (1024*1024)}MB."
        )

    # Validate PDF encryption
    try:
        doc = fitz.Document(stream=content, filetype="pdf")
        if doc.is_encrypted:
            raise HTTPException(
                status_code=400,
                detail="Password-protected or encrypted PDFs are not supported."
            )
        doc.close()
    except HTTPException:
        raise
    except Exception as e:
        print(f"PyMuPDF Error: {e}")
        raise HTTPException(status_code=400, detail="Invalid PDF file structure.")

    # Generate unique file ID
    file_id = str(uuid.uuid4())
    
    # Save to Supabase
    if db:
        try:
            db.insert_job(file_id, "uploaded")
        except Exception as e:
            print(f"Supabase Insert Error: {e}", file=sys.stderr)
            raise HTTPException(status_code=500, detail=f"Failed to register file in DB: {str(e)}")

    # Save file to uploads directory
    file_path = os.path.join(UPLOAD_DIR, f"{file_id}.pdf")
    try:
        with open(file_path, "wb") as f:
            f.write(content)
    except Exception as e:
        print(f"File Write Error: {e}", file=sys.stderr)
        raise HTTPException(status_code=500, detail="Failed to save file to disk.")

    return UploadResponse(
        file_id=file_id,
        filename=file.filename,
        size_bytes=len(content),
        status="uploaded"
    )
