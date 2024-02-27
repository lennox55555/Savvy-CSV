import json
import requests
from bs4 import BeautifulSoup

def lambda_handler(event, context):
    try:
        body = json.loads(event.get('body', '{}'))
        column_names = body.get('columnNames', [])
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'message': 'Invalid JSON format in request body'})
        }

    all_top_search_results = get_top_google_search_results(*column_names)
    csv_json_string = create_csv_json(column_names, all_top_search_results)
    updated_csv_json_string = add_web_content_to_json(csv_json_string)

    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'  
        },
        'body': updated_csv_json_string
    }

def get_top_google_search_results(*queries):
    api_key = ''
    search_engine_id = ''
    all_results = {}
    
    for query in queries:
        url = "https://www.googleapis.com/customsearch/v1"
        params = {'q': query, 'key': api_key, 'cx': search_engine_id, 'num': 5}
        
        response = requests.get(url, params=params)
        if response.status_code == 200:
            search_results = response.json()
            top_results = [item['link'] for item in search_results.get('items', [])]
            all_results[query] = top_results
        else:
            all_results[query] = []
    return all_results

def create_csv_json(column_headers, all_top_search_results):
    table_json = {"table": []}
    
    for header in column_headers:
        header_data = {"query": header, "results": []}
        
        if header in all_top_search_results:
            for link in all_top_search_results[header]:
                header_data["results"].append({"link": link, "web-content": ""})
        else:
            header_data["results"].append({"link": "", "web-content": "No data"})
        
        table_json["table"].append(header_data)
    
    json_string = json.dumps(table_json, indent=2)
    return json_string


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
                result["web-content"] = {"text": text[:100], "tables": all_rows_content}  

    return json.dumps(csv_json, indent=2)
