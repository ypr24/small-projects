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
    dontfollowme_list = list()
    with open('notfollowme.txt','r') as f:
        for line in f:
            name = line.split('\n')
            dontfollowme_list.append(name[0])

    idontfollow_list = list()
    with open('idontfollow.txt','r') as f:
        for line in f:
            name = line.split('\n')
            idontfollow_list.append(name[0])

    # after fetching the data

    # for item in idontfollow_list:
    #     browser.get(str("https://instagram.com/"+item))
    #     sleep(10)    

    
    for item in dontfollowme_list:
        browser.get(str("https://instagram.com/"+item))
        sleep(2)

        try:
            unfollow_button = browser.find_element_by_xpath('//*[@id="react-root"]/section/main/div/header/section/div[1]/div[1]/div/div[2]/div/span/span[1]/button')
            sleep(2)
            unfollow_button.click()
            sleep(2)

            unfollowConfirm_button = browser.find_element_by_xpath('/html/body/div[5]/div/div/div/div[3]/button[1]')
            sleep(2)
            unfollowConfirm_button.click()
            sleep(20)
        except:
            print('already unfollowed')

    sleep(1000)


run()
