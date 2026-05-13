import requests
import urllib3

urllib3.disable_warnings()


def get_smartsheet_system_status():
    BASE_URL = "https://status.smartsheet.com/api/v2/summary.json"
    HEADERS = {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"}

    try:
        resp = requests.get(BASE_URL, headers=HEADERS, timeout=15)
        resp.raise_for_status()
        data = resp.json()

        overall = data["status"]["description"]  # e.g., "All Systems Operational"
        components = []

        # We'll pick the most important components to show
        important_services = ["App", "API", "Login", "Dashboards", "Reports", "Mobile", "Notifications"]

        for rec in data["components"]:
            if rec.get("name") in important_services:
                status_raw = rec.get("status")
                # Map status to color
                color = "#14b8a6" if status_raw == "operational" else "#f59e0b"  # Teal for OK, Amber for issues
                if "outage" in status_raw: color = "#ef4444"  # Red for Outage

                components.append({
                    "name": rec.get("name"),
                    "status": status_raw.replace("_", " ").title(),
                    "color": color,
                    "updated": rec.get("updated_at")
                })

        return {"overall": overall, "components": components}
    except Exception as e:
        print(f"Status API Error: {e}")
        return None