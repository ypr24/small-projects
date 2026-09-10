from selenium import webdriver
from os import path 
import time, requests
from selenium.webdriver.common.keys import Keys
from bs4 import BeautifulSoup

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
    password_input.send_keys("<your password here>")
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
    
    goToFirstStory = browser.find_element_by_xpath('//*[@id="react-root"]/section/main/section/div[1]/div[1]/div/div/div/div/ul/li[3]/div/button')
    goToFirstStory.click()
    sleep(2)
    # view 100 stories faster within 1 sec duration, 
    for i in range(100):
        goToNextStory = browser.find_element_by_xpath('//*[@id="react-root"]/section/div[1]/div/div[5]/section/div/button[2]')
        goToNextStory.click()
        sleep(1)
        
    sleep(10)

run()
