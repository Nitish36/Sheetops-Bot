import requests
import urllib3
from bs4 import BeautifulSoup
from urllib.parse import urljoin

urllib3.disable_warnings()

links = []
for i in range(1,4,1):
    url = f"https://community.smartsheet.com/categories/digital-it-portfolio-management/p{i}/?sort=hot"
    base = "https://community.smartsheet.com"

    headers = {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
    }

    resp = requests.get(url, headers=headers, verify=False)
    resp.raise_for_status()

    soup = BeautifulSoup(resp.text, "html.parser")

    # Get all discussion links (this will capture many; we filter to meaningful ones)

    for a in soup.select("a[href]"):
        href = a["href"]
        text = a.get_text(strip=True)
        if text and "/discussion/" in href:   # common pattern in many Vanilla forums
            links.append((text, urljoin(base, href)))

# De-duplicate while preserving order
seen = set()
cleaned = []
for title, link in links:
    if link not in seen:
        cleaned.append((title, link))
        seen.add(link)

print("Found:", len(cleaned))
for x in cleaned:
    print(x)