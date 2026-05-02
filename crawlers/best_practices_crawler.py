import requests
import urllib3
from bs4 import BeautifulSoup
from urllib.parse import urljoin

urllib3.disable_warnings()


def get_best_practices(limit=10):
    cleaned = []
    seen = set()
    headers = {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"}

    # Targeting the Best Practices category
    for i in range(1, 4):
        url = f"https://community.smartsheet.com/categories/best-practices/p{i}/?sort=new"
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
            print(f"Best Practices Crawler error: {e}")
            break
        if len(cleaned) >= limit: break

    return cleaned[:limit]