import requests
import urllib3
from bs4 import BeautifulSoup

urllib3.disable_warnings()

url = "https://www.smartsheet.com/events"
headers = {
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
}

def safe_text(row, class_name):
    # Many tables use <td> for data cells, not <th>
    cell = row.find(["td", "th"], class_=class_name)
    return cell.get_text(strip=True) if cell else None

def safe_link(row, class_name):
    cell = row.find(["td", "th"], class_=class_name)
    if not cell:
        return None
    a = cell.find("a", href=True)
    return a["href"] if a else None

event_list = []
resp = requests.get(url, headers=headers, verify=False, timeout=30)
resp.raise_for_status()

soup = BeautifulSoup(resp.text, "html.parser")
event_table = soup.find("table", class_="tablesaw tablesaw-stack cols-7")

if not event_table:
    raise ValueError("Event table not found. Page structure may have changed.")

rows = event_table.find_all("tr")

for eve in rows[1:]:
    title = safe_text(eve, "views-field views-field-title")
    if not title:
        # Skip header/empty rows
        continue

    event_dict = {
        "title": title,
        "format": safe_text(eve, "views-field views-field-event-format"),
        "location": safe_text(eve, "views-field views-field-country"),
        "region": safe_text(eve, "views-field views-field-region"),
        "date": safe_text(eve, "views-field views-field-event-date-range"),
        "time": safe_text(eve, "views-field views-field-event-date-range-1"),
        "reg_link": safe_link(eve, "views-field views-field-marquee-cta-link")
    }
    event_list.append(event_dict)

print("Events found:", len(event_list))
print(event_list)