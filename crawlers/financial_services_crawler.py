import requests
import urllib3
from bs4 import BeautifulSoup
from urllib.parse import urljoin

urllib3.disable_warnings()


def get_finance_trends(limit=10):
    cleaned = []
    seen = set()
    headers = {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"}

    # Targeting the Financial Services category
    for i in range(1, 3):
        url = f"https://community.smartsheet.com/categories/financial-services/p{i}/?sort=hot"
        try:
            resp = requests.get(url, headers=headers, timeout=10, verify=False)
            soup = BeautifulSoup(resp.text, "html.parser")
            for a in soup.select("a[href]"):
                href = a["href"]
                text = a.get_text(strip=True)
                if text and "/discussion/" in href:
                    full_url = urljoin("https://community.smartsheet.com", href)
                    if full_url not in seen:
                        cleaned.append({"title": text, "link": full_url})
                        seen.add(full_url)
                if len(cleaned) >= limit: break
        except Exception as e:
            print(f"Finance Crawler error: {e}")
            break
        if len(cleaned) >= limit: break

    return cleaned[:limit]