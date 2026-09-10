# # from selenium import webdriver
# # from os import path 
# # import time, requests
# # from selenium.webdriver.common.keys import Keys

# # def sleep(t=3):
# #     time.sleep(t)

# # def getBrowser():
# #     chromePath = path.abspath('')+'/chromedriver'
# #     browser = webdriver.Chrome(chromePath)
# #     return browser

# # def run():
# #     browser = getBrowser()
# #     sleep(1)    
# #     browser.get("https://en.wikipedia.org/wiki/Albert_Einstein")
# #     sleep(2)
# #     gotofollowDiv = browser.find_element_by_xpath('//*[@id="mw-content-text"]/div[1]/table[1]') 
    
# #     with open('test2.txt','w') as f:
# #         f.write(gotofollowDiv.get_attribute('innerHTML'))
    
# #     sleep(2)


# # run()

# from bs4 import BeautifulSoup

# content = ''
# with open('follower_list.html','r') as f:
#     for line in f:
#         content += line

# soup = BeautifulSoup(content, 'html.parser')
# # print(soup.prettify())

# li = list()

# for anchor in soup.find_all('a'):
#     name = anchor.get_text()
#     li.append(name)

# fl = lambda fl : fl != '' 

# li = filter(fl,li)

# follower_list = list(li)

# content = ''
# with open('following_list.html','r') as f:
#     for line in f:
#         content += line

# soup = BeautifulSoup(content, 'html.parser')
# # print(soup.prettify())

# li = list()

# for anchor in soup.find_all('a'):
#     name = anchor.get_text()
#     li.append(name)

# fl = lambda fl : fl != '' 

# li = filter(fl,li)
# following_list = list(li)

# print('\nfollower list',' count= ',len(follower_list),' \n')
# # print(follower_list)
# print('\nfollowing list',' count= ',len(following_list),' \n')
# # print(following_list)



# set_follower = set(follower_list)
# set_following = set(following_list)

# set_dontfollowme = set_following - set_follower
# dontfollowme_list = list(set_dontfollowme)
# print('\nPeople who donot follow artistt.app, count = ',len(dontfollowme_list),'\n')
# print(dontfollowme_list,'\n\n')

# set_Idontfollow = set_follower - set_following
# Idontfollow_list = list(set_Idontfollow)
# print('\nPeople artistt.app dont follow, count = ', len(Idontfollow_list),'\n')
# print(Idontfollow_list,'\n\n')

# with open('idontfollow.txt','w') as f:
#     for item in Idontfollow_list:
#         f.write(item)
#         f.write("\n")

# li = list()
# with open('notfollowme.txt','r') as f:
#     for line in f:
#         name = line.split('\n')
#         li.append(name[0])


# print(len(li))
# print(li)



string = '''
<div class="QBdPU "><span class=""><svg aria-label="Like" class="_8-yf5 " fill="#262626" height="24" viewBox="0 0 48 48" width="24"><path d="M34.6 6.1c5.7 0 10.4 5.2 10.4 11.5 0 6.8-5.9 11-11.5 16S25 41.3 24 41.9c-1.1-.7-4.7-4-9.5-8.3-5.7-5-11.5-9.2-11.5-16C3 11.3 7.7 6.1 13.4 6.1c4.2 0 6.5 2 8.1 4.3 1.9 2.6 2.2 3.9 2.5 3.9.3 0 .6-1.3 2.5-3.9 1.6-2.3 3.9-4.3 8.1-4.3m0-3c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5.6 0 1.1-.2 1.6-.5 1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path></svg></span></div>
'''
# print(string)

from bs4 import BeautifulSoup

content = string

soup = BeautifulSoup(content, 'html.parser')

# print(soup.prettify())

print(soup.span.svg['aria-label'])
