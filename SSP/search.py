import json

column_headers = [
    "Washington State Population 2000-2023",
    "Washington State Emissions Data 2000-2023",
    "Washington State Voting Data 2000-2023"
]

queries = [
    "Washington State Population 2000-2023",
    "Washington State Emissions Data 2000-2023",
    "Washington State Voting Data 2000-2023"
]

def get_top_google_search_results(*queries):
    api_key = 'AIzaSyBsHn5nFSod0M9rHsk2ywuq9ejf3vyQgQA'
    search_engine_id = 'b190372f94a7140b2'
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
            print(f"Failed to retrieve search results for '{query}'")
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


all_top_search_results = get_top_google_search_results(*queries) 

csv_json_string = create_csv_json(column_headers, all_top_search_results)

print(csv_json_string)


