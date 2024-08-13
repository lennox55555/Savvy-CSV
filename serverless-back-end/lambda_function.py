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
import random
import csv
import io
from sec_api import FloatApi
from concurrent.futures import ThreadPoolExecutor, as_completed
import yfinance as yf
from sec_api import MappingApi

def lambda_handler(event, context):
    try:
        print("--------------------------------- PROMPT CLASSIFICATION RESULT: ---------------------------------------")
        initPrompt = input("Enter a prompt that you would hope returns a csv file: ")
        prompt_type = prompt_classification(initPrompt)
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
                "-------------------------------------RANKED DICTIONARY RESULT:----------------------------------------")
            rankedList = rank_tables(processed_dict, prompt_type[1])
            rankedList_dict = json.loads(rankedList.replace("'", '"'))
            print(rankedList_dict)
            print(
                "-------------------------------------UPDATED JSON STRUCTURE WITH RANKS:----------------------------------")

            completeJSON = add_ranks_to_data(processed_dict, rankedList_dict)
            print(json.dumps(completeJSON, indent=4))
            print(
                "-------------------------------------SIMPLIFIED JSON STRUCTURE RESULT:------------------------------------")
            jsonTopThree = filter_top_3_lowest_ranks(completeJSON)
            print(json.dumps(jsonTopThree, indent=4))

            print(
                "-------------------------------------FULL FINAL JSON STRUCTURE RESULT:------------------------------------")
            fullTablesJson = fetch_rest_tables(jsonTopThree, str(response))
            print(json.dumps(fullTablesJson, indent=4))

        elif(prompt_type[0] == 2):
            ticker = get_ticker(initPrompt)
            typeOfFinance = classify_prompt(initPrompt)
            print(ticker)
            print(typeOfFinance)
            if typeOfFinance == 1:
                get_and_print_executive_compensation(ticker)
            elif typeOfFinance == 2:
                get_and_print_directors_csv(ticker)
            elif typeOfFinance == 3:
                get_and_print_subsidiaries(ticker)
            elif typeOfFinance == 4:
                get_and_print_sro_filings(ticker)
            elif typeOfFinance == 5:
                print(get_float_data(ticker))
            elif typeOfFinance == 6:
                prompt_type = 1


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



def get_ticker(initPrompt):
    client = openai.OpenAI(api_key="")


    prompt = f"Given the sentence below, What is the stock ticker symbol for the company listed? BE SURE TO ONLY RETURN THE TICKER AND NOTHING ELSE! Sentence: {initPrompt}"


    chat_completion = client.chat.completions.create(
        model="gpt-4-turbo",
        messages=[
            {"role": "system", "content": "You are a function. I will give you input of a prompt and you will give me a single output of a ticker"},
            {"role": "user", "content": prompt}
        ]
    )

    ticker_symbol = chat_completion.choices[0].message.content

    return ticker_symbol


def classify_prompt(prompt):
    client = openai.OpenAI(api_key="")

    supportedFinanceQs = {
        1: 'executive compensation',
        2: 'directors & board members info',
        3: 'companies subsidiaries',
        4: 'SRO filings',
        5: 'companies share',
        6: "Doesn't match any subject"
    }

    classification_request = f"""
    Please classify the following prompt into one of the following subjects:
    1: executive compensation
    2: directors & board members info
    3: companies subsidiaries
    4: SRO filings
    5: companies share
    6: Doesn't match any subject

    Prompt: "{prompt}" # uncomment this"""

    chat_completion = client.chat.completions.create(
        model="gpt-4-turbo",
        messages=[
            {"role": "system", "content": "You are an expert in finance classification."},
            {"role": "user", "content": classification_request}
        ]
    )

    classification = chat_completion.choices[0].message.content

    # Find the number that matches the classification
    for key, value in supportedFinanceQs.items():
        if value.lower() in classification.lower():
            return key

    return 6


def get_and_print_executive_compensation(ticker):
    API_KEY = ""
    BASE_URL = "https://api.sec-api.io/compensation"

    url = f"{BASE_URL}/{ticker}?token={API_KEY}"
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()

        if data:
            output = io.StringIO()
            keys = data[0].keys()
            dict_writer = csv.DictWriter(output, fieldnames=keys)
            dict_writer.writeheader()
            dict_writer.writerows(data)
            print(output.getvalue())
        else:
            print("No executive compensation data retrieved.")
    else:
        print(f"Error: {response.status_code}")




def get_and_print_directors_csv(company_ticker):
    API_KEY = ""
    BASE_URL = "https://api.sec-api.io/directors-and-board-members"

    headers = {
        "Authorization": API_KEY
    }
    query = {
        "query": f"ticker:{company_ticker}",
        "from": 0,
        "size": 50,
        "sort": [{"filedAt": {"order": "desc"}}]
    }

    response = requests.post(BASE_URL, headers=headers, json=query)

    if response.status_code == 200:
        data = response.json().get('data', [])
        directors_info = []

        for record in data:
            for director in record.get('directors', []):
                directors_info.append({
                    "Company": record.get("entityName", ""),
                    "Ticker": record.get("ticker", ""),
                    "Name": director.get("name", ""),
                    "Position": director.get("position", ""),
                    "Age": director.get("age", ""),
                    "Class": director.get("directorClass", ""),
                    "Date First Elected": director.get("dateFirstElected", ""),
                    "Independent": director.get("isIndependent", ""),
                    "Committee Memberships": ", ".join(director.get("committeeMemberships", [])),
                    "Qualifications": ", ".join(director.get("qualificationsAndExperience", []))
                })

        if directors_info:
            output = io.StringIO()
            writer = csv.DictWriter(output, fieldnames=directors_info[0].keys())
            writer.writeheader()
            writer.writerows(directors_info)
            csv_content = output.getvalue().strip().split('\n')
            for line in csv_content:
                print(line)
        else:
            print("No director information retrieved.")
    else:
        print(f"Error: {response.status_code}")



def get_and_print_subsidiaries(ticker):
    API_KEY = ""
    BASE_URL = "https://api.sec-api.io/subsidiaries"

    url = f"{BASE_URL}?token={API_KEY}"
    query = {
        "query": f"ticker:{ticker}",
        "from": 0,
        "size": 50,
        "sort": [{"filedAt": {"order": "desc"}}]
    }

    response = requests.post(url, json=query)

    if response.status_code == 200:
        data = response.json().get('data', [])
        subsidiaries_info = []

        for record in data:
            company_name = record.get("companyName", "")
            for subsidiary in record.get("subsidiaries", []):
                subsidiary_info = [
                    company_name,
                    record.get("ticker", ""),
                    subsidiary.get("name", ""),
                    subsidiary.get("jurisdiction", "")
                ]
                subsidiaries_info.append(subsidiary_info)

        if subsidiaries_info:
            for info in subsidiaries_info:
                print(info)
        else:
            print("No subsidiary information retrieved.")
    else:
        print(f"Error: {response.status_code}")



def get_and_print_sro_filings(ticker):
    API_KEY = ""
    BASE_URL = "https://api.sec-api.io/sro"

    headers = {
        "Authorization": API_KEY
    }
    query = {
        "query": f"sro:{ticker}",
        "from": 0,
        "size": 10,
        "sort": [{"issueDate": {"order": "desc"}}]
    }

    response = requests.post(f"{BASE_URL}?token={API_KEY}", json=query)

    if response.status_code == 200:
        data = response.json()
        filings_data = data.get('data', [])

        filings_list = []
        for record in filings_data:
            filing_details = [
                record.get("releaseNumber", ""),
                record.get("issueDate", ""),
                record.get("fileNumber", ""),
                record.get("sro", ""),
                record.get("details", ""),
                record.get("commentsDue", ""),
                [url.get("url", "") for url in record.get("urls", [])]
            ]
            filings_list.append(filing_details)

        if filings_list:
            for filing in filings_list:
                print(filing)
        else:
            print("No SRO filings data retrieved.")
    else:
        print(f"Error: {response.status_code}")



def get_float_data(ticker):
    api_key = ''
    floatApi = FloatApi(api_key)

    response = floatApi.get_float(ticker=ticker)

    table_data = ["ID, Tickers, CIK, Reported At, Period Of Report, Share Class, Outstanding Shares"]
    for item in response['data']:
        for share in item['float']['outstandingShares']:
            table_data.append(
                f"{item['id']}, "
                f"{', '.join(item['tickers'])}, "
                f"{item['cik']}, "
                f"{item.get('reportedAt', 'N/A')}, "
                f"{item.get('periodOfReport', 'N/A')}, "
                f"{share['shareClass']}, "
                f"{share['value']}"
            )
    return "\n".join(table_data)


def get_stock_prices(ticker):
    # Fetch the historical stock price data
    stock = yf.Ticker(ticker)
    hist = stock.history(period="max")

    if hist.empty:
        return "No data available for the given ticker."

    output = io.StringIO()
    writer = csv.writer(output)

    # Write CSV header
    writer.writerow(["Date", "Open", "High", "Low", "Close", "Volume"])

    # Write stock price data
    for date, row in hist.iterrows():
        writer.writerow([
            date.strftime("%Y-%m-%d"),
            row["Open"],
            row["High"],
            row["Low"],
            row["Close"],
            row["Volume"]
        ])

    return output.getvalue()


def get_nasdaq_companies_csv():
    api_key = ''
    mappingApi = MappingApi(api_key=api_key)

    all_nasdaq_listings_json = mappingApi.resolve('exchange', 'NASDAQ')

    if not all_nasdaq_listings_json:
        return "No data available for NASDAQ companies."

    headers = [
        "name", "ticker", "cik", "cusip", "exchange", "isDelisted",
        "category", "sector", "industry", "sic", "sicSector", "sicIndustry",
        "famaSector", "famaIndustry", "currency", "location", "id"
    ]

    csv_data = ",".join(headers) + "\n"

    for company in all_nasdaq_listings_json:
        row = []
        for header in headers:
            row.append(str(company.get(header, '')))
        csv_data += ",".join(row) + "\n"

    return csv_data


def get_nysearca_companies_csv():
    api_key = ''
    mappingApi = MappingApi(api_key=api_key)

    all_nysearca_listings_json = mappingApi.resolve('exchange', 'NYSEARCA')

    if not all_nysearca_listings_json:
        return "No data available for NYSEARCA companies."

    # Define the CSV headers
    headers = [
        "name", "ticker", "cik", "cusip", "exchange", "isDelisted",
        "category", "sector", "industry", "sic", "sicSector", "sicIndustry",
        "famaSector", "famaIndustry", "currency", "location", "id"
    ]

    # Create the CSV data
    csv_data = ",".join(headers) + "\n"

    for company in all_nysearca_listings_json:
        row = []
        for header in headers:
            row.append(str(company.get(header, '')))
        csv_data += ",".join(row) + "\n"

    return csv_data


def get_nyse_companies_csv():
    api_key = ''
    mappingApi = MappingApi(api_key=api_key)

    all_nyse_listings_json = mappingApi.resolve('exchange', 'NYSE')

    if not all_nyse_listings_json:
        return "No data available for NYSE companies."


    headers = [
        "name", "ticker", "cik", "cusip", "exchange", "isDelisted",
        "category", "sector", "industry", "sic", "sicSector", "sicIndustry",
        "famaSector", "famaIndustry", "currency", "location", "id"
    ]


    csv_data = ",".join(headers) + "\n"

    for company in all_nyse_listings_json:
        row = []
        for header in headers:
            row.append(str(company.get(header, '')))
        csv_data += ",".join(row) + "\n"

    return csv_data


def get_nysemkt_companies_csv():
    api_key = ''
    mappingApi = MappingApi(api_key=api_key)

    all_nysemkt_listings_json = mappingApi.resolve('exchange', 'NYSEMKT')

    if not all_nysemkt_listings_json:
        return "No data available for NYSEMKT companies."

    headers = [
        "name", "ticker", "cik", "cusip", "exchange", "isDelisted",
        "category", "sector", "industry", "sic", "sicSector", "sicIndustry",
        "famaSector", "famaIndustry", "currency", "location", "id"
    ]


    csv_data = ",".join(headers) + "\n"

    for company in all_nysemkt_listings_json:
        row = []
        for header in headers:
            row.append(str(company.get(header, '')))
        csv_data += ",".join(row) + "\n"

    return csv_data


def get_bats_companies_csv():
    api_key = ''
    mappingApi = MappingApi(api_key=api_key)

    all_bats_listings_json = mappingApi.resolve('exchange', 'BATS')

    if not all_bats_listings_json:
        return "No data available for BATS companies."

    # Define the CSV headers
    headers = [
        "name", "ticker", "cik", "cusip", "exchange", "isDelisted",
        "category", "sector", "industry", "sic", "sicSector", "sicIndustry",
        "famaSector", "famaIndustry", "currency", "location", "id"
    ]

    csv_data = ",".join(headers) + "\n"

    for company in all_bats_listings_json:
        row = []
        for header in headers:
            row.append(str(company.get(header, '')))
        csv_data += ",".join(row) + "\n"

    return csv_data


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
    base_url = "https://data.cdc.gov/resource/"
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
    split_dict = {
        "QueryStartDate": json_data.get("QueryStartDate", ""),
        "QueryEndDate": json_data.get("QueryEndDate", ""),
        "CSVDataPercentage": json_data.get("CSVDataPercentage", ""),
        "ImageDataPercentage": json_data.get("ImageDataPercentage", ""),
        "TableDataPercentage": json_data.get("TableDataPercentage", "")
    }
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
                split_dict[str(result_count)] = {
                    "type": data_type,
                    "numberTableOnWebsite": 1,
                    "rankOfTable": 0,
                    "website": url,
                    "SampleTableData": sample_data[0] if sample_data else ""
                }
                result_count += 1
            else:
                data_type = "Website"
                url = website_data.get("LandingURL", "")
                tables = website_data.get("TableHTML", {})
                table_index = 1
                for table_id, table_html in list(tables.items())[:5]:  # Limit to first 5 tables
                    split_dict[str(result_count)] = {
                        "type": data_type,
                        "numberTableOnWebsite": table_index,
                        "rankOfTable": 0,
                        "website": url,
                        "SampleTableData": table_html
                    }
                    result_count += 1
                    table_index += 1

    return split_dict


def rank_tables(data, prompt):
    table_data = {k: v["SampleTableData"] for k, v in data.items() if k.isdigit()}
    table_strings = "\n\n".join([f"Table {k}: {v}" for k, v in table_data.items()])

    client = openai.OpenAI(api_key="")

    full_prompt = f"Rank the following tables based on their relevance to the prompt. NO 2 keys should have the same rank. BE SURE TO ONLY RETURN THE DICTIONARY. EXAMPLE OUTPUT {{1:2,2:1,3:3}}: '{prompt}'.\n\n{table_strings}\n\nProvide the ranks in the format: {{'(table_number)': rank}}"

    try:
        chat_completion = client.chat.completions.create(
            model="gpt-4-turbo",
            messages=[
                {"role": "system",
                 "content": "You are an assistant that ranks tables based on relevance to a given prompt."},
                {"role": "user", "content": full_prompt}
            ]
        )

        ranked_tables_text = chat_completion.choices[0].message.content

        return ranked_tables_text

    except json.JSONDecodeError as e:
        return f"An error occurred while parsing JSON: {str(e)}"
    except Exception as e:
        return f"An error occurred: {str(e)}"


def add_ranks_to_data(processed_data, rank_data):
    # Iterate over each section in the processed data
    for index, rank in rank_data.items():
        if index in processed_data:
            processed_data[index]["rankOfTable"] = rank
    return processed_data


def filter_top_3_lowest_ranks(data):
    # Extract the keys and their corresponding rankOfTable values
    ranks = {key: value['rankOfTable'] for key, value in data.items() if isinstance(value, dict)}

    # Sort the keys by their rankOfTable values in ascending order
    sorted_keys = sorted(ranks, key=ranks.get)

    # Keep only the top 3 keys with the lowest ranks
    top_3_keys = sorted_keys[:3]

    # Create a new dictionary containing only the top 3 items
    filtered_data = {key: data[key] for key in top_3_keys}

    # Copy the remaining non-item keys to the filtered data
    for key in data:
        if key not in filtered_data and not isinstance(data[key], dict):
            filtered_data[key] = data[key]

    return filtered_data


def add_query_end_date(data):
    # Get the current Unix timestamp
    current_timestamp = int(time.time())

    # Add the Unix timestamp to the QueryEndDate field
    data['QueryEndDate'] = current_timestamp

    return data


def fetch_rest_tables(data):
    user_agents = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Firefox/89.0",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
    ]

    for key in ['1', '2', '3']:
        website = data[key]['website']
        table_index = data[key]['numberTableOnWebsite'] - 1

        headers = {
            "User-Agent": random.choice(user_agents)
        }
        response = requests.get(website, headers=headers)
        soup = BeautifulSoup(response.content, 'html.parser')

        tables = soup.find_all('table')
        if table_index < len(tables):
            table_html = str(tables[table_index])
            data[key]['completedTableData'] = table_html
            del data[key]['SampleTableData']
        else:
            print(f"Table index {table_index} out of range for website {website}")

        # Wait for a random interval between requests to avoid being blocked
        time.sleep(random.uniform(2, 5))

    return data

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
                        "that has the most relevance to the query. BE SURE TO ONLY RETURN THE KEY, not the key in quotation marks but just the single interger. The prompt"
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

    client = boto3.client('apigatewaymanagementapi',
                          endpoint_url="")

    chunks = [response_data_str[i:i + chunk_size] for i in range(0, len(response_data_str), chunk_size)]

    for chunk in chunks:
        client.post_to_connection(ConnectionId=connection_id, Data=chunk.encode('utf-8'))

lambda_handler('test', 'test')
