import os
from dotenv import load_dotenv
load_dotenv()
from models.db import get_supabase

db = get_supabase()
# Check recent jobs to see statuses
import httpx
resp = httpx.get(
    f"{db.base_url}/analysis_jobs",
    headers=db.headers,
    params={"select": "file_id,status,error_message,created_at", "order": "created_at.desc", "limit": "5"}
)
print("Latest 5 Analysis Jobs:")
for job in resp.json():
    print(f"[{job['status']}] File: {job['file_id']} - Error: {job.get('error_message', 'none')}")
    
