import requests
import urllib3

urllib3.disable_warnings()


def get_smartsheet_system_status():
    BASE_URL = "https://status.smartsheet.com/api/v2/summary.json"
    HEADERS = {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"}

    try:
        resp = requests.get(BASE_URL, headers=HEADERS, timeout=15, verify=False)
        resp.raise_for_status()
        data = resp.json()

        overall = data["status"]["description"]
        components = []

        for rec in data["components"]:
            # We skip 'Component Groups' if they don't have a status (optional, but keeps it clean)
            if not rec.get("name"): continue

            status_raw = rec.get("status", "unknown")

            # Color Mapping to match your screenshot
            # Operational = Emerald Green, Degraded = Amber, Outage = Red
            color = "#10b981"  # Emerald Green (Matches your image)
            if "performance" in status_raw or "partial" in status_raw:
                color = "#f59e0b"  # Amber
            elif "major" in status_raw or "outage" in status_raw:
                color = "#ef4444"  # Red

            components.append({
                "name": rec.get("name"),
                "status": status_raw.replace("_", " ").title(),
                "color": color
            })

        return {"overall": overall, "components": components}
    except Exception as e:
        print(f"Status API Error: {e}")
        return None