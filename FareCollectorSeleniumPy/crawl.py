from selenium import webdriver
from selenium.webdriver.common.keys import Keys

from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By

import time

# fetching data from website

class Fetcher(object):
	"""docstring for Fetcher"""
	def __init__(self):
		self.url = None
		self.driver = None
		self.stationList = None

	def setUrl(self,url):
		self.url = url
		self.driver = webdriver.Chrome()
		self.driver.get(url)
		self.driver.set_window_position(0, 0)
		self.driver.set_window_size(0, 0)


		
	def getElementById(self,Time,cssId):

		element = WebDriverWait(
			self.driver,
			Time).until(
			lambda x: x.find_element_by_id(cssId))

		return element

	def getElementByClass(self,Time,cssClass):
		element = WebDriverWait(
			self.driver,
			Time).until(
			lambda x: x.find_element_by_class_name(cssClass))

		return element		

	def sendDataToElement(self,InputElement,value):
		InputElement.send_keys(value)

	def submitQuery(self,SubmitElement):
		SubmitElement.click()

	def getFare(self,FromStationValue,ToStationValue,waitTime=10):

		try:
			FromStationInput = self.getElementById(waitTime,
				"ctl00_MainContent_ddlFrom")


			self.sendDataToElement(FromStationInput,FromStationValue)

			ToStationInput = self.getElementById(waitTime,
				"ctl00_MainContent_ddlTo")

			self.sendDataToElement(ToStationInput,ToStationValue)

			SubmitFare = self.getElementById(waitTime,
				"ctl00_MainContent_btnShowFare")

			self.submitQuery(SubmitFare)

			fare = self.getElementByClass(waitTime,"fare_new_nor_right")
			return fare.text
		except Exception as e:
			print(e)


	def getStationList(self,waitTime=10):

		StnList = self.getElementById(waitTime,"ctl00_MainContent_ddlFrom")
		optList = StnList.find_elements_by_tag_name("option")
		optArray = [x for x in optList]

		result = []

		for element in optArray:
			result.append(element.text)

		return result

	def writeStationFile(self):
		f = open("stationList.csv","w")

		for x in res:
			f.write(x)
			f.write("\n")

		f.close()
		

	def readStationData(self):

		stationList = []

		f = open("stationList.csv","r")

		while True:
			line = f.readline()

			if line == "":
				break
			if line[len(line)-1] == "\n":
				line = line[:-1]
	
			stationList.append(line)
		
		f.close()

		return stationList

	def writeFareList(self,stationList,i,j):
		f = open("fare/fareList"+str(i)+".csv","a")
		fare = 0

		size = len(stationList)
		for i in range(i,j):
			for j in range(size):
				fare = self.getFare(stationList[i],stationList[j])
				if fare != None:
					line = stationList[i]+"->"+stationList[j]+"->"+str(fare)+"\n"
					f.write(line)

		f.close()
		self.driver.close()


import os 

def isExist(fileName):
	if os.path.exists(fileName):
		return True
	else:
		return False


def delFile(fileName):
	if os.path.exists(fileName):
		os.remove(fileName)
	else:
		print(fileName+" doesn't exist .. \n")

def validFile(i,j):
	fileName = "fare/fareList"+str(i)+".csv"
	f = open(fileName,"r")
	i = 0

	while i < j:
		if f.readline() == "":
			break
		i += 1

	return i==j

# single processed 
def run(choice,i,j):

	url = "http://www.delhimetrorail.com/metro-fares.aspx"

	f = Fetcher()
	if choice == 1:
		res = f.getStationList()

	if choice == 2:
		fileName = "fare/fareList"+str(i)+".csv"

		if(isExist(fileName)==False):
			f.setUrl(url)
			stationList = f.readStationData()
			f.writeFareList(stationList,i,j)



# importing the multiprocessing module 
import multiprocessing as mp 
  

def runMulti(i): 
    # creating processes 

	p1 = mp.Process(target=run, 
		args=(2,i,i+1))

	p2 = mp.Process(target=run, 
		args=(2,i+1,i+2))

	p1.start()
	p2.start()
				
	p1.join()
	p2.join()
	
def runserver(i):
	start = time.time()
	runMulti(i)
	end = time.time()

	print("Time for Station "+str(i)+" is ")
	print(end-start)
	print("\n")



def startSync(init,limit):

	lock = mp.Lock()
	startT = time.time()
	
	for i in range(init,limit,2):
		lock.acquire()
		runserver(i)
		lock.release()
		time.sleep(5)
	
	i = 0
	inval = []

	while i < limit:
		fileName = "fare/fareList"+str(i)+".csv"
		if(isExist(fileName)):
			if(validFile(i,224) == False):
				inval.append(fileName)
		i += 1

	f = open("logger.txt","a")
	for x in inval:
		f.write(x)
		delFile(x)
		f.write("\n")

	startE = time.time()

	f.write(str(startE)+"\n\n")
	f.close()
	
	

	print("Total Time")
	print(startE - startT)

init = 0
limit = 20

startSync(init,limit)



