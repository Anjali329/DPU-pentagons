"""
Report Route
============
Retrieves a completed forensic analysis report.

Endpoint:
    GET /report/{file_id}

Response:
    Full forensic report JSON (see schemas.ForensicReport)
"""

from fastapi import APIRouter, HTTPException, Depends
from models.schemas import ForensicReport
from models.db import get_supabase, SupabaseRESTClient

router = APIRouter()

@router.get("/report/{file_id}", response_model=ForensicReport)
async def get_report(file_id: str, db: SupabaseRESTClient = Depends(get_supabase)):
    """
    Fetch a completed forensic analysis report.

    Args:
        file_id: UUID of the analyzed paper.

    Returns:
        ForensicReport JSON with all analysis results.
    """
    if not db:
        raise HTTPException(status_code=500, detail="Database client not initialized")
        
    try:
        job = db.get_job(file_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    if not job:
        raise HTTPException(
            status_code=404,
            detail=f"Report for file '{file_id}' not found. Run POST /analyze/{file_id} first."
        )
        
        
    if job.get("status") == "failed":
        raise HTTPException(status_code=500, detail=f"Analysis failed: {job.get('error_message')}")
        
    if job.get("status") != "completed" or not job.get("report_data"):
        raise HTTPException(status_code=400, detail="Analysis is still in progress.")

    return job.get("report_data")
