import json
import requests
from bs4 import BeautifulSoup
import os
from concurrent.futures import ThreadPoolExecutor, as_completed
import openai
import time
import re
import csv
from urllib.parse import urljoin
from io import StringIO
import boto3

def lambda_handler(event, context):
    try:
        print("--------------------------------- PROMPT CLASSIFICATION RESULT: ---------------------------------------")
        prompt_type = prompt_classification(input("Enter a prompt that you would hope returns a csv file: "))
        print(prompt_type)

        if(prompt_type[0] == 1):
            print(
                "--------------------------------------PRE-PROMPT RESULT: ----------------------------------------------")
            response = prepromptengineer_google(prompt_type[1])
            print(response)
            print("--------------------------------------TOP SEARCH RESULT:-----------------------------------------------")
            top_search_results = get_top_google_search_results(response)
            print(top_search_results)
            print(
                "--------------------------------------JSON STRUCTURE RESULT:-------------------------------------------")
            json_structure = create_query_json_structure(top_search_results)
            print(json_structure)
            print(
                "-------------------------------------UPDATED JSON STRUCTURE RESULT:------------------------------------")
            # Parse JSON string to dictionary
            json_structure_dict = json.loads(json_structure)
            updated_json_structure = update_json_structure_with_csv_tables_images(json_structure_dict)
            print(json.dumps(updated_json_structure, indent=4))
            print(
                "-------------------------------------ADDED METRICS TO JSON RESULT:-------------------------------------")
            added_metrics_to_json = calculate_data_percentages(updated_json_structure)
            print(added_metrics_to_json)
            print(
                "-------------------------------------PROCESSED JSON TO DICTIONARY RESULT:------------------------------")
            processed_dict = process_json_data(added_metrics_to_json)
            print(json.dumps(processed_dict, indent=4))
            print(
                "--------------------------------------------FILTERED TABLE RESULT:-------------------------------------")
            bestTable = filterTables(json.dumps(processed_dict), prompt_type[1])
            print(bestTable)
            selected_table = lookup_best_table_web_route(bestTable, updated_json_structure)
            print(json.dumps(selected_table, indent=4))



        elif(prompt_type[0] == 2):
            print("SEC")
        elif(prompt_type[0] == 3):
            response = prepromptengineer_health(prompt_type[1])
            print(response)
            top_cdc_results = get_top_cdc_search_results(response)
            print(top_cdc_results)
            constructed_apiendpoints = construct_api_endpoint(top_cdc_results)
            print(constructed_apiendpoints)
            processed_dict = get_first_5_rows_from_urls(constructed_apiendpoints)
            print(json.dumps(processed_dict, indent=4))
            bestTable = filterTables(json.dumps(processed_dict),response[1])
            print(bestTable)
            print("Final Result Here:")
            best_table_data = lookup_best_table_cdc_route(bestTable, constructed_apiendpoints, processed_dict)
            print(best_table_data)

        return {'statusCode': 200}
    except Exception as e:
        return {'statusCode': 500, 'body': json.dumps({'message': str(e)})}


def prompt_classification(prompt):
    client = openai.OpenAI(api_key="")
    try:
        chat_completion = client.chat.completions.create(
            model="gpt-4-turbo",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an AI trained to only act as a function for a bigger application. "
                        "Your job is to classify whether user generated prompt can be better answered using Google Search, The SEC,"
                        "or The CDC. If the prompt can be better answered through the use of The use of Google Search, return the number 1."
                        "If the prompt can be better answered through information on the SEC, return the number 2. And if the prompt can be"
                        " better answered on through information on the cdc, return the number 3. Be sure to only return a number and nothing else."
                        "Prompt: " + prompt
                    )
                }
            ]
        )
        if chat_completion.choices:
            generated_text = chat_completion.choices[0].message.content
            return (int(generated_text), prompt)
        else:
            return "No response from the model."
    except Exception as e:
        return f"An error occurred in pre-prompt engineering: {str(e)}"


def prepromptengineer_google(prompt):
    client = openai.OpenAI(api_key="")
    try:
        chat_completion = client.chat.completions.create(
            model="gpt-4-turbo",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an AI trained to only act as a function for a bigger application. "
                        "Your job is to take a query that a user creates and format it so the Google search engine "
                        "has a better chance of retrieving that information. Generate three different variations of the query "
                        "on the same topic. Ensure that one of the returned queries has CSV at the end of the query. Be sure to only return the new queries as a Python list and nothing else. "
                        "Format your response strictly as: ['query1', 'query2', 'query3']. "
                        "Original Prompt: " + prompt
                    )
                }
            ]
        )
        if chat_completion.choices:
            generated_text = chat_completion.choices[0].message.content
            return eval(generated_text.strip())
        else:
            return "No response from the model."
    except Exception as e:
        return f"An error occurred in pre-prompt engineering: {str(e)}"


def prepromptengineer_health(prompt):
    client = openai.OpenAI(api_key="")
    try:
        chat_completion = client.chat.completions.create(
            model="gpt-4-turbo",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an AI trained to only act as a function for a bigger application. "
                        "Your job is to take in a prompt and simplify the prompt so its better used on the cdc website search."
                        "As an example, Before Prompt: What are the diabetes cases per state? After Prompt: diabetes"
                        "Be sure to only return the After Prompt after given the before prompt."
                        "Prompt: " + prompt
                    )
                }
            ]
        )
        if chat_completion.choices:
            generated_text = chat_completion.choices[0].message.content
            return generated_text.strip()
        else:
            return "No response from the model."
    except Exception as e:
        return f"An error occurred in pre-prompt engineering: {str(e)}"


def get_top_google_search_results(queries):
    api_key = ''
    search_engine_id = ''
    all_results = {}
    found_urls = set()

    for query in queries:
        url = "https://www.googleapis.com/customsearch/v1"
        params = {'q': query, 'key': api_key, 'cx': search_engine_id, 'num': 8}

        response = requests.get(url, params=params)
        if response.status_code == 200:
            search_results = response.json()
            top_results = []
            for item in search_results.get('items', []):
                link = item['link']
                if link not in found_urls:
                    top_results.append(link)
                    found_urls.add(link)
                if len(top_results) == 4:
                    break
            all_results[query] = top_results
        else:
            all_results[query] = []

    return all_results


def get_top_cdc_search_results(query):
    api_key = ''
    search_engine_id = ''
    top_results = []
    found_urls = set()

    site_query = f"site:data.cdc.gov {query}"
    url = "https://www.googleapis.com/customsearch/v1"
    params = {'q': site_query, 'key': api_key, 'cx': search_engine_id, 'num': 10}

    response = requests.get(url, params=params)
    if (response.status_code == 200):
        search_results = response.json()
        if 'items' in search_results:
            for item in search_results['items']:
                link = item['link']
                match = re.search(r'/([a-z0-9]{4}-[a-z0-9]{4})$', link)
                if match and link not in found_urls:
                    top_results.append(match.group(1))
                    found_urls.add(link)
                    if len(top_results) == 10:
                        break
        else:
            print("No items found in search results.")
    else:
        print(f"Error fetching results: {response.status_code}")

    return top_results


def create_query_json_structure(search_results):
    query_start_date = int(time.time())

    query_json = {
        "QueryStartDate": query_start_date,
        "QueryEndDate": 0
    }

    for query, urls in search_results.items():
        query_key = query
        query_json[query_key] = {}

        for idx, url in enumerate(urls, 1):
            website_key = f"Website{idx}"
            query_json[query_key][website_key] = {
                "LandingURL": url,
                "HasCSVFile": False,
                "FileHref": "",
                "csvSample": [],
                "HasUsefulImage": False,
                "ImageHref": "",
                "HasUsefulTable": False,
                "TableHTML": ""
            }

    return json.dumps(query_json, indent=4)


def construct_api_endpoint(identifiers):
    base_url = ""
    endpoints = [f"{base_url}{identifier}.json" for identifier in identifiers]
    return endpoints


def get_first_5_rows_from_urls(urls):
    result_dict = {}
    for index, url in enumerate(urls, start=1):
        try:
            response = requests.get(url)
            response.raise_for_status()
            data = response.json()
            first_5_rows = data[:5] if len(data) >= 5 else data
            result_dict[index] = first_5_rows
        except Exception as e:
            print(f"Failed to fetch data from {url}: {e}")
            result_dict[index] = []

    return result_dict

def check_csv_links(url):
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')

        csv_links = [urljoin(url, a['href']) for a in soup.find_all('a', href=True) if 'csv' in a['href'].lower()]
        return csv_links
    except Exception:
        return []  # Return an empty list if an error occurs


def check_table_tags(soup, num_rows=5):
    """Check the parsed HTML for table tags and return the first few rows of their HTML content."""
    tables = soup.find_all('table')
    table_html = {}
    for idx, table in enumerate(tables, 1):
        rows = table.find_all('tr')
        truncated_table = '<table>'
        for row in rows[:num_rows]:
            truncated_table += str(row)
        truncated_table += '</table>'
        table_html[f"Table{idx}"] = truncated_table
    return table_html


def check_image_tags(soup):
    """Check the parsed HTML for image tags and return their src attributes."""
    image_hrefs = [img['src'] for img in soup.find_all('img', src=True)]
    return image_hrefs


def download_csv_sample(url, num_lines=5):
    """Download the first few lines of a CSV file."""
    try:
        response = requests.get(url)
        response.raise_for_status()
        csv_content = response.content.decode('utf-8')
        csv_reader = csv.reader(StringIO(csv_content))

        sample_lines = []
        for i, row in enumerate(csv_reader):
            if i >= num_lines:
                break
            sample_lines.append(row)
        return sample_lines
    except Exception as e:
        print(f"Failed to download CSV sample from {url}: {str(e)}")
        return []


def update_json_structure_with_csv_tables_images(json_data):
    for query, websites in json_data.items():
        if query in ["QueryStartDate", "QueryEndDate"]:
            continue

        for website_key, website_data in websites.items():
            landing_url = website_data.get("LandingURL", "")
            try:
                response = requests.get(landing_url)
                response.raise_for_status()
                soup = BeautifulSoup(response.text, 'html.parser')

                csv_links = check_csv_links(landing_url)
                if csv_links:
                    website_data["HasCSVFile"] = True
                    website_data["FileHref"] = csv_links[0]  # Add the first CSV link as the download location
                    website_data["csvSample"] = download_csv_sample(csv_links[0])  # Add CSV sample
                else:
                    website_data["HasCSVFile"] = False
                    website_data["FileHref"] = ""
                    website_data["csvSample"] = []

                table_html = check_table_tags(soup)
                if table_html:
                    website_data["HasUsefulTable"] = True
                    website_data["TableHTML"] = table_html
                else:
                    website_data["HasUsefulTable"] = False
                    website_data["TableHTML"] = {}

                image_hrefs = check_image_tags(soup)
                if image_hrefs:
                    website_data["HasUsefulImage"] = True
                    website_data["ImageHref"] = image_hrefs[0]  # Add the first image link as the download location
                else:
                    website_data["HasUsefulImage"] = False
                    website_data["ImageHref"] = ""

            except Exception as e:
                print(f"Error processing {landing_url}: {e}")
                website_data["HasCSVFile"] = False
                website_data["FileHref"] = ""
                website_data["csvSample"] = []
                website_data["HasUsefulTable"] = False
                website_data["TableHTML"] = {}
                website_data["HasUsefulImage"] = False
                website_data["ImageHref"] = ""

    return json_data


def calculate_data_percentages(json_data):
    total_websites = 0
    csv_count = 0
    image_count = 0
    table_count = 0

    for query, websites in json_data.items():
        if query in ["QueryStartDate", "QueryEndDate"]:
            continue

        for website_key, website_data in websites.items():
            total_websites += 1
            if website_data.get("HasCSVFile", False):
                csv_count += 1
            if website_data.get("HasUsefulImage", False):
                image_count += 1
            if website_data.get("HasUsefulTable", False):
                table_count += 1

    csv_percentage = csv_count / total_websites if total_websites > 0 else 0
    image_percentage = image_count / total_websites if total_websites > 0 else 0
    table_percentage = table_count / total_websites if total_websites > 0 else 0

    json_data["CSVDataPercentage"] = round(csv_percentage, 5)
    json_data["ImageDataPercentage"] = round(image_percentage, 5)
    json_data["TableDataPercentage"] = round(table_percentage, 5)

    return json_data


def split_data_into_dict(json_data_string):
    # Convert the JSON string back into a dictionary
    data = json.loads(json_data_string)
    split_dict = {}
    result_count = 1

    # Check if 'table' key exists in data to prevent key errors
    if "table" not in data:
        print("Error: 'table' key not found in data")
        return split_dict

    # Iterate through the primary table list
    for entry in data["table"]:
        # Safeguard against missing keys in the entry
        if "query" not in entry or "results" not in entry:
            print("Error: Missing 'query' or 'results' keys in the data entry")
            continue

        query = entry["query"]

        # Iterate through each result in the results list
        for result in entry["results"]:
            if "link" not in result or "web-content" not in result:
                print("Error: Missing 'link' or 'web-content' keys in the results")
                continue
            if "text" not in result["web-content"] or "tables" not in result["web-content"]:
                print("Error: Missing 'text' or 'tables' in 'web-content'")
                continue

            tables = result["web-content"]["tables"]
            for table_key, table_content in tables.items():
                table_number = int(table_key.replace("Table", ""))
                split_dict[str(result_count)] = {
                    "table": [
                        {
                            "query": query,
                            "results": [
                                {
                                    "link": result["link"],
                                    "web-content": {
                                        "text": result["web-content"]["text"],
                                        "tables": {
                                            f"Table{table_number}": table_content[:5]
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
                result_count += 1

    return split_dict



def process_json_data(json_data):
    split_dict = {}
    result_count = 1

    for query, websites in json_data.items():
        if query in ["QueryStartDate", "QueryEndDate", "CSVDataPercentage", "ImageDataPercentage", "TableDataPercentage"]:
            continue

        for website_key, website_data in websites.items():
            if website_data.get("HasCSVFile", False):
                data_type = "CSV file"
                url = website_data.get("FileHref", "")
                sample_data = website_data.get("csvSample", [])
                if not sample_data:
                    continue
            else:
                data_type = "Website"
                url = website_data.get("LandingURL", "")
                sample_data = list(website_data.get("TableHTML", {}).values())
                if not sample_data:
                    continue

            split_dict[result_count] = [(data_type, url), sample_data]
            result_count += 1

    return split_dict


def filterTables(dict, prompt):
    client = openai.OpenAI(api_key="")
    try:
        chat_completion = client.chat.completions.create(
            model="gpt-4-turbo",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "Given the python dictionary containing series of key and values. Keys being the index of how "
                        "many tables, and values being objects that contain information about the tables. Return the key and only the key, "
                        "that has the most relevance to the query. BE SURE TO ONLY RETURN THE KEY. The prompt"
                        "is:" + prompt + ". The dictionary: " + dict
                    )
                }
            ]
        )
        if chat_completion.choices:
            generated_text = chat_completion.choices[0].message.content
            return generated_text.strip()
        else:
            return "No response from the model."
    except Exception as e:
        return f"An error occurred in pre-prompt engineering: {str(e)}"


def lookup_best_table_web_route(best_table_key, json_data):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "DNT": "1",  # Do Not Track Request Header
    }

    for query, websites in json_data.items():
        if query in ["QueryStartDate", "QueryEndDate", "CSVDataPercentage", "ImageDataPercentage", "TableDataPercentage"]:
            continue

        for website_key, website_data in websites.items():
            if website_key == f"Website{best_table_key}":
                landing_url = website_data.get("LandingURL", "")
                print(f"Fetching table data from: {landing_url}")  # Logging the URL
                try:
                    response = requests.get(landing_url, headers=headers)
                    response.raise_for_status()
                    soup = BeautifulSoup(response.text, 'html.parser')
                    table_html = {}
                    tables = soup.find_all('table')
                    if not tables:
                        print(f"No tables found at: {landing_url}")
                    for idx, table in enumerate(tables, 1):
                        table_html[f"Table{idx}"] = str(table)
                    return table_html
                except requests.exceptions.RequestException as e:
                    print(f"Error fetching table data from {landing_url}: {e}")
                except Exception as e:
                    print(f"Unexpected error processing {landing_url}: {e}")

    return {}


def lookup_best_table_cdc_route(best_table_key, urls, processed_dict):
    best_url = urls[int(best_table_key) - 1]
    try:
        response = requests.get(best_url)
        response.raise_for_status()
        data = response.json()
        return {
            "url": best_url,
            "data": data
        }
    except Exception as e:
        return {
            "url": best_url,
            "data": f"Failed to fetch data: {str(e)}"
        }


def send_chunks(endpoint, connection_id, response_data, chunk_size=120000):
    response_data_str = str(response_data)

    client = boto3.client('',
                          endpoint_url="")

    chunks = [response_data_str[i:i + chunk_size] for i in range(0, len(response_data_str), chunk_size)]

    for chunk in chunks:
        client.post_to_connection(ConnectionId=connection_id, Data=chunk.encode('utf-8'))

lambda_handler('test', 'test')
