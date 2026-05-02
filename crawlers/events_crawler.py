import requests
import urllib3
from bs4 import BeautifulSoup

urllib3.disable_warnings()

url = "https://www.smartsheet.com/events"
headers = {
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
}


def get_smartsheet_events(limit=10):
    url = "https://www.smartsheet.com/events"
    headers = {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"}

    def safe_text(row, class_name):
        cell = row.find(["td", "th"], class_=class_name)
        return cell.get_text(strip=True) if cell else "N/A"

    def safe_link(row, class_name):
        cell = row.find(["td", "th"], class_=class_name)
        if not cell: return "#"
        a = cell.find("a", href=True)
        return a["href"] if a else "#"

    try:
        resp = requests.get(url, headers=headers, verify=False, timeout=20)
        soup = BeautifulSoup(resp.text, "html.parser")
        event_table = soup.find("table", class_="tablesaw tablesaw-stack cols-7")
        if not event_table: return []

        event_list = []
        rows = event_table.find_all("tr")
        for eve in rows[1:]:
            title = safe_text(eve, "views-field views-field-title")
            if not title or title == "N/A": continue

            event_list.append({
                "title": title,
                "format": safe_text(eve, "views-field views-field-event-format"),
                "location": safe_text(eve, "views-field views-field-country"),
                "date": safe_text(eve, "views-field views-field-event-date-range"),
                "link": safe_link(eve, "views-field views-field-marquee-cta-link")
            })
            if len(event_list) >= limit: break
        return event_list
    except Exception as e:
        print(f"Event Crawler Error: {e}")
        return []

print(get_smartsheet_events())