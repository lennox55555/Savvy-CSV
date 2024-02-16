import pandas as pd
import requests
from bs4 import BeautifulSoup

page = requests.get('https://en.wikipedia.org/wiki/Colorado').text
soup = BeautifulSoup(page, 'html.parser')
tables = soup.find_all('table', class_='wikitable sortable')
tableNum = 1

for table in tables:
	title = "ColoradoData" + str(tableNum) + ".csv"
	df = pd.read_html(str(table))
	df = pd.concat(df)
	print(df)
	df.to_csv(title, index=False)
	tableNum = tableNum + 1

