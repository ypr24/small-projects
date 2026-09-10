from selenium import webdriver
from os import path 
import time, requests
from selenium.webdriver.common.keys import Keys

def sleep(t=3):
    time.sleep(t)

def getBrowser():
    chromePath = path.abspath('')+'/chromedriver'
    browser = webdriver.Chrome(chromePath)
    return browser

def HTMLify(string):
    return '''<!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        </head>
        <body>
        '''+str(string)+''' 
        </body>
        </html>  
    '''

def run():
    browser = getBrowser()
    sleep(1)    
    browser.get("https://instagram.com/")
    sleep(2)
    username_input = browser.find_element_by_css_selector("input[name='username']")
    password_input = browser.find_element_by_css_selector("input[name='password']")
    username_input.send_keys("<your insta id>")
    sleep(1)
    password_input.send_keys("<your password>")
    sleep(1)
    login_link = browser.find_element_by_xpath("//*[@id='loginForm']/div/div[3]/button/div")
    login_link.click()
    sleep(10)
    saveInfo = browser.find_element_by_xpath("//*[@id='react-root']/section/main/div/div/div/section/div/button")
    saveInfo.click()
    sleep(10)
    turnOffNotifiy = browser.find_element_by_xpath("/html/body/div[4]/div/div/div/div[3]/button[2]")
    turnOffNotifiy.click()
    sleep(10)
    # login successful
    # Go to Profile
    browser.get(str("https://instagram.com/artistt.app"))
    sleep(10)

    html = browser.find_element_by_tag_name('html')

    followerCount = browser.find_element_by_xpath('//*[@id="react-root"]/section/main/div/header/section/ul/li[2]/a/span').text
    followerCount = int(followerCount)
    print('follower, fc1 = ',followerCount)
    
    followingCount = browser.find_element_by_xpath('//*[@id="react-root"]/section/main/div/header/section/ul/li[3]/a/span').text
    followingCount = int(followingCount)
    print('following, fc2 = ',followingCount)

    N1 = int(followerCount/11)
    N2 = int(followingCount/11)


    gotofollower = browser.find_element_by_xpath('//*[@id="react-root"]/section/main/div/header/section/ul/li[2]/a')
    gotofollower.click()
    sleep(10)

    gotofollowDiv = browser.find_element_by_xpath('/html/body/div[5]/div/div/div[2]') 
    sleep(2)
    
    for i in range(N1):
        print("i = ",i,"\n")
        gotofollowDiv.click()
        sleep(1)
        html.send_keys(Keys.END)
        sleep(2)

    with open('follower.txt','w') as f:
        f.write(gotofollowDiv.text)

    sleep(5)

    with open('follower_list.html','w') as f:
        f.write(HTMLify(gotofollowDiv.get_attribute('innerHTML')))

    sleep(10)
   
    closeTheTab = browser.find_element_by_xpath('/html/body/div[5]/div/div/div[1]/div/div[2]/button')
    closeTheTab.click()

    sleep(10)

    gotofollowing = browser.find_element_by_xpath('//*[@id="react-root"]/section/main/div/header/section/ul/li[3]/a')
    gotofollowing.click()
    sleep(10)
    gotofollowDiv = browser.find_element_by_xpath('/html/body/div[5]/div/div/div[2]') 
    sleep(2)
    
    for i in range(N2):
        print("i = ",i,"\n")
        gotofollowDiv.click()
        sleep(1)
        html.send_keys(Keys.END)
        sleep(2)

    with open('following.txt','w') as f:
        f.write(gotofollowDiv.text)
    
    with open('following_list.html','w') as f:
        f.write(HTMLify(gotofollowDiv.get_attribute('innerHTML')))

    print('ending ....')
     

    sleep(1000)


run()
