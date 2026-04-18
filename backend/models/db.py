import os
import httpx

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")

class SupabaseRESTClient:
    def __init__(self, url: str, key: str):
        self.base_url = f"{url}/rest/v1"
        self.headers = {
            "apikey": key,
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json"
        }

    def get_job(self, file_id: str):
        resp = httpx.get(
            f"{self.base_url}/analysis_jobs",
            headers=self.headers,
            params={"file_id": f"eq.{file_id}", "select": "*"}
        )
        resp.raise_for_status()
        data = resp.json()
        return data[0] if data else None

    def insert_job(self, file_id: str, status: str):
        resp = httpx.post(
            f"{self.base_url}/analysis_jobs",
            headers=self.headers,
            json={"file_id": file_id, "status": status}
        )
        resp.raise_for_status()
        return resp.json() if resp.content else None

    def update_job(self, file_id: str, data: dict):
        resp = httpx.patch(
            f"{self.base_url}/analysis_jobs",
            headers=self.headers,
            params={"file_id": f"eq.{file_id}"},
            json=data
        )
        resp.raise_for_status()

# Initialize Supabase client
supabase_client = SupabaseRESTClient(SUPABASE_URL, SUPABASE_KEY) if SUPABASE_URL and SUPABASE_KEY else None

def get_supabase() -> SupabaseRESTClient:
    """Dependency to inject Supabase REST client"""
    return supabase_client
