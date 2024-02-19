import requests
from bs4 import BeautifulSoup

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
        print(f"Number of <table> tags: {len(tables)}")
        
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

url = "https://ww2.arb.ca.gov/ghg-inventory-data"
text, all_rows_content = scrape_text_tables_and_all_rows_content(url)
print(f"Text scraped from the page: {text[:100]}...")  
print("Contents of each row in the table(s):")
for row_content in all_rows_content:
    print(row_content)


#import pandas as pd
#import requests
#from bs4 import BeautifulSoup

#page = requests.get('https://en.wikipedia.org/wiki/Colorado').text
#soup = BeautifulSoup(page, 'html.parser')
#tables = soup.find_all('table', class_='wikitable sortable')
#tableNum = 1

#for table in tables:
	#title = "ColoradoData" + str(tableNum) + ".csv"
	#df = pd.read_html(str(table))
	#df = pd.concat(df)
	#print(df)
	#df.to_csv(title, index=False)
	#tableNum = tableNum + 1

