import requests
from bs4 import BeautifulSoup

# Step 1: Send HTTP request
url = "https://www.bbc.com/news/articles/c209yn1ygz6o"
response = requests.get(url)

# Step 2: Parse HTML
soup = BeautifulSoup(response.text, 'html.parser')

# Step 3: Extract Data
titles = soup.find_all('h1') 
Content = soup.find_all('p') 

for title in titles:
    print(title.text)  # Step 4: Display or save
    
# for i in Content:
#     print(i.text)
