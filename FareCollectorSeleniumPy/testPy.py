
stationList = []

with open("stationList.csv","r+") as f:

    while True:
        line = f.readline()
        
        if line == "":
            break

        line = line.split("\n")[0]
        stationList.append(line)


# print(stationList)

size = len(stationList)
print(size)
 

with open("fareListTemp.csv","w+") as f_wr:

    for i in range(size):
        
        with open("fare/fareList"+str(i)+".csv","r+") as f_read:
        
            for j in range(size):

    


























# # with open("out.txt","w+") as f:
# #     size = len(stationList)

    
# #     for i in range(size):
# #         if stationList[i] == "<br>":
# #             f.write("\n\n")
# #         f.write('"'+stationList[i]+'",')




# from selenium import webdriver
# from selenium.webdriver.common.keys import Keys

# from selenium.common.exceptions import TimeoutException
# from selenium.webdriver.support.ui import WebDriverWait
# from selenium.webdriver.support import expected_conditions as EC
# from selenium.webdriver.common.by import By

# import time



# # fetching data from website

# class Fetcher(object):
#     """docstring for Fetcher"""
#     def __init__(self):
#         self.url = None
#         self.driver = None
#         self.stationList = None

#     def setUrl(self,url):
#         self.url = url
#         self.driver = webdriver.Chrome('/home/yash/chromedriver')
#         self.driver.get(url)
#         # self.driver.set_window_position(0, 0)
#         # self.driver.set_window_size(0, 0)


        
#     def getElementById(self,Time,cssId):

#         element = WebDriverWait(
#             self.driver,
#             Time).until(
#             lambda x: x.find_element_by_id(cssId))

#         return element

#     def getElementByXpath(self,Time,XPath):
#         element = WebDriverWait(
#             self.driver,
#             Time).until(
#             lambda x: x.find_element_by_xpath(By.xpath(XPath)))
#         return element
        

#     def getElementByClass(self,Time,cssClass):
#         element = WebDriverWait(
#             self.driver,
#             Time).until(
#             lambda x: x.find_element_by_class_name(cssClass))

#         return element 


#     def submitEnter(self,InputElement):
#         InputElement.sendKeys(Keys.RETURN);

#     def sendDataToElement(self,InputElement,value):
#         InputElement.send_keys(value)

#     def submitQuery(self,SubmitElement):
#         SubmitElement.click()

#     def getDetails(self,FromStationValue,waitTime=10):
#         try:
#             googleSearch = self.getElementByClass(waitTime,
#                 "gLFyf"
#             )

#             googleSearch.clear()

#             self.sendDataToElement(googleSearch,FromStationValue)
#             googleSearch.send_keys(Keys.ENTER)

#             knowledge = self.getElementByClass(waitTime,"knowledge-panel")
#             return knowledge.text

#         except Exception as e:
#             print(e)


#     def run(self):

#         with open("out.txt","w+") as f:
#             size = len(stationList)
#             for i in range(size):
#                 d = self.getDetails(stationList[i]+" metro station reviews")
#                 f.write("\n\nStation Name : "+stationList[i]+"\nFetched Details\n")
#                 if d is not None:
#                     print(d.encode('utf-8'))
#                     f.write(d.encode('utf-8'))

#         self.driver.close()



# f = Fetcher()
# f.setUrl("https://www.google.com/")
# f.run()
# import string

# keywords = ["Toilet","toilet","TOILET"] 

# pDetails = []

# with open("out.txt","r") as f:

#     while True:
#         rl = f.readline()
#         if not rl:
#             break
#         if rl.find("Station Name ") != -1:
#             SNAME = rl            

#         for kw in keywords:
#             if rl.find(kw) != -1:
#                 SPark = rl
                
#                 Name = SNAME
#                 Name = string.replace(Name,"Station Name : ","")
#                 Name = string.replace(Name,"\n","")
#                 SNAME = Name

#                 pDetails.append([SNAME,SPark])

# pDetails = sorted(pDetails,key=lambda x: x[0])


# with open("outPT.txt","w") as f:

    # size = len(pDetails)
    # for i in range(size):
    #     # isize = len(pDetails[i])
    #     # for j in range(isize):
    #     #     if j == 0:

        

    #     f.write(str(pDetails[i]))
    #     f.write("\n")


# print(pDetails)




# stationList = []

# with open("stationList.csv","r+") as f:

#     while True:
#         line = f.readline()
        
#         if line == "":
#             break

#         line = line.split("\n")[0]
#         stationList.append(line)

# stationList2 = []

# with open("stationList2.csv","r+") as f:

#     while True:
#         line = f.readline()
        
#         if line == "":
#             break

#         line = line.split("\n")[0]
#         stationList2.append(line)

# stationList3 = []

# with open("stationList3.csv","r+") as f:

#     while True:
#         line = f.readline()
        
#         if line == "":
#             break

#         line = line.split("\n")[0]
#         stationList3.append(line)

# stationList4 = []

# with open("stationList4.csv","r+") as f:

#     while True:
#         line = f.readline()
        
#         if line == "":
#             break

#         line = line.split("\n")[0]
#         stationList4.append(line)

# fareHash = dict()

# with open("fareList.csv","r+") as f:


#     while True:
#         line = f.readline()

#         if not line:
#             break

#         lineArr = line.split("->")
                    
#         a = lineArr[0]
#         b = lineArr[1]
#         c = lineArr[2]
                    
#         q = sorted([a,b])
#         q = q[0]+"->"+q[1]
#         fareHash[q] = c

# def getNMRCFare(i,j):

#     dist = abs(i-j)

#     if dist <= 1:
#         return 10

#     if dist <= 2:
#         return 15

#     if dist <= 6:
#         return 20

#     if dist <= 9:
#         return 30

#     if dist <= 16:
#         return 40

#     return 50

# import re 

# with open("fareList2.txt","r+") as f:

#     stationList4 = stationList
    
#     size = len(stationList4)

#     for i in range(size):
#         for j in range(size):
            
#             fare = "Null\n"

#             a = stationList4[i]
#             b = stationList4[j]

#             q1 = sorted([a,b])
#             q1 = q1[0]+"->"+q1[1]

#             if fareHash.get(q1) is not None:
#                 fare = fareHash.get(q1)
                
                # if fare == "Null\n":
                    # print(a,b,fare)

            # f.write(stationList[i]+"->"+stationList[j]+"->"+fare)

            




# with open("fareList4.txt","w+") as f:

#     size3 = len(stationList3)
#     size4 = len(stationList4)

#     for i in range(size4):
#         for j in range(size3):
            
#             fare = "Null\n"

#             a = stationList4[i]
#             b = stationList3[j]

#             # q1 = sorted([a,b])
#             # q1 = q1[0]+"->"+q1[1]

#             # if fareHash.get(q1) is not None:
#                 # fare = fareHash.get(q1)
#                 # if fare == "Null\n":
#                 #     print(stationList4[i]+"->"+stationList4[j]+"->"+fare)


#             # f.write(stationList4[i]+"->"+stationList4[j]+"->"+fare)

#             # a = stationList2[i]
#             # b = stationList3[j]

#             q1 = sorted([a,"SIKANDARPUR"])
#             q2 = sorted(["SIKANDARPUR",b])
            
#             q1 = q1[0]+"->"+q1[1]
#             q2 = q2[0]+"->"+q2[1]

#             if fareHash.get(q1) is not None and fareHash.get(q2) is not None:
#                 fare = str(int(fareHash.get(q1))+int(fareHash.get(q2)))+"\n"

#             f.write(stationList4[i]+"->"+stationList3[j]+"->"+fare)




# from PIL import Image
# import os, sys

# path = "/home/yash/Pictures/"
# dirs = os.listdir(path)

# print(dirs)

# def resize():
#     for item in dirs:
#         print(path+item)

#         try:
#             im = Image.open(path+item)
#             f, e = os.path.splitext(path+item)
#             imResize = im.resize((96,96), Image.ANTIALIAS)
#             imResize.save(f + '.png', 'PNG', quality=100)
            
#         except Exception as e:
#             print(e)

# resize()


