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
    # like all recent by scroll
    
    # like top 10 posts
    html = browser.find_element_by_tag_name('html')

    mainPage = browser.find_element_by_xpath('//*[@id="react-root"]/section/main/section/div[1]/div[2]/div')
    scrollY = 0
    
    for i in range(10):
        sleep(1)
        try:
            mainPage.click()
            sleep(3)
            script = str("window.scrollTo("+str(scrollY)+", "+str(int(scrollY+1300))+");")
            print('\nScrolling',script,'\n')
            browser.execute_script(script)
            sleep(1)
            like_state = browser.find_element_by_xpath('//*[@id="react-root"]/section/main/section/div[1]/div[2]/div/article['+str(int(i+1))+']/div[3]/section[1]/span[1]/button')
            sleep(1)
            soup = BeautifulSoup(like_state.get_attribute('innerHTML'), 'html.parser')
            sleep(1)
            stateValue = soup.span.svg['aria-label']
            print('available for getting ',stateValue)
            if(stateValue == 'Like'):
                like_state.click()
                print('Liked .. \n')
            sleep(1)
            e = browser.find_element_by_xpath('//*[@id="react-root"]/section/main/section/div[1]/div[2]/div/article['+str(int(i+1))+']')
            size = e.size
            w, h = size['width'], size['height']
            scrollY += int(h)
            sleep(1)
            # print('size = ',size,'\n')
        except:
            print('liking failed..')
            # scrollY += 500
        
    sleep(10)

run()
