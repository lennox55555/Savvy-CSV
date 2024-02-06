import requests
import json

def get_top_google_search_results(query):
    api_key = '--------'
    search_engine_id = '---------'
    
    url = "https://www.googleapis.com/customsearch/v1"
    
    params = {
        'q': query,
        'key': api_key,
        'cx': search_engine_id,
        'num': 5  # Number of search results to return
    }
    
    response = requests.get(url, params=params)
    
    if response.status_code == 200:
        search_results = response.json()
        
        top_results = []
        for item in search_results.get('items', []):
            result = {
                'title': item['title'],
                'link': item['link']
            }
            top_results.append(result)
        
        return top_results
    else:
        print("Failed to retrieve search results")
        return []


query = "Washington State Population 2000-2023"
top_search_results = get_top_google_search_results(query)
for result in top_search_results:
    print(result['title'])
    print(result['link'])
    print()
