"""
Keep-Alive Script for Render Backend
Prevents the free tier backend from sleeping by pinging it periodically.
Run this script separately or use a service like cron-job.org to call your health endpoint.
"""

import requests
import time
import os
from datetime import datetime

# Your Render backend URL - update this with your actual URL
BACKEND_URL = os.getenv("BACKEND_URL", "https://your-render-backend.onrender.com")
PING_INTERVAL = int(os.getenv("PING_INTERVAL", 840))  # 14 minutes (Render sleeps after 15 min of inactivity)

def ping_backend():
    """Ping the backend health endpoint to keep it alive."""
    try:
        response = requests.get(f"{BACKEND_URL}/health", timeout=30)
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        if response.status_code == 200:
            print(f"[{timestamp}] ✓ Backend is alive - Status: {response.status_code}")
        else:
            print(f"[{timestamp}] ⚠ Backend responded with status: {response.status_code}")
        return True
    except requests.exceptions.RequestException as e:
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f"[{timestamp}] ✗ Failed to ping backend: {e}")
        return False

def main():
    """Main loop to continuously ping the backend."""
    print(f"Starting keep-alive service for: {BACKEND_URL}")
    print(f"Ping interval: {PING_INTERVAL} seconds ({PING_INTERVAL // 60} minutes)")
    print("-" * 50)
    
    while True:
        ping_backend()
        time.sleep(PING_INTERVAL)

if __name__ == "__main__":
    main()
