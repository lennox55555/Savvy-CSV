import requests
from bs4 import BeautifulSoup
import json

def scrape_text_tables_and_all_rows_content(url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
    }
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()

        soup = BeautifulSoup(response.content, 'html.parser')
        
        text = ' '.join(soup.stripped_strings)
        
        tables = soup.find_all('table')
        
        all_rows_content = []
        for table in tables:
            rows = table.find_all('tr')
            for row in rows:
                cells = row.find_all(['th', 'td'])
                row_content = [cell.get_text(strip=True) for cell in cells]
                all_rows_content.append(row_content)
        
        return text, all_rows_content
    except requests.RequestException as e:
        return f"An error occurred: {e}", []

def add_web_content_to_json(csv_json_string):
    csv_json = json.loads(csv_json_string)
    
    for query in csv_json["table"]:
        for result in query["results"]:
            url = result["link"]
            if url: 
                text, all_rows_content = scrape_text_tables_and_all_rows_content(url)
                result["web-content"] = {"text": text[:100], "tables": all_rows_content}  # Example: only adding first 100 characters of text for brevity

    return json.dumps(csv_json, indent=2)

updated_csv_json_string = add_web_content_to_json(csv_json_string)

print(updated_csv_json_string)
