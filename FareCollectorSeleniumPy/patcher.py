import os

def readStationData():

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


def isExist(fileName,parentFolder):
	fileName = parentFolder+"/"+fileName
	if os.path.exists(fileName):
		return True
	else:
		return False


def updateFareList(stationList):

	size = len(stationList)
	print(size)
	f = open("fareList.csv","w")

	ctr = 0
	ctr2 = 0

	fareList = []
	hm = dict()

	for i in range(size):
		
		fileName = "fareList"+str(i)+".csv"
		if(isExist(fileName,"fare")):
			ctr += 1 
			fInner = open("fare/"+fileName,"r")
			# write it ..
			for j in range(size):
				line = fInner.readline()
				lineArr = line.split("->")
				
				a = lineArr[0]
				b = lineArr[1]
				c = lineArr[2]
				
				q = sorted([a,b])
				q = q[0]+"->"+q[1]
				hm[q] = c

				fareList.append(line)
				f.write(line)

			fInner.close()
		else:
			ctr2 += 1
			for j in range(size):

				a = stationList[i]
				b = stationList[j]

				q = sorted([a,b])
				q = q[0]+"->"+q[1]

				if hm.get(q) is not None:
					fare = str(int(hm.get(q)))
				line = a+"->"+b+"->"+fare+"\n"

				fareList.append(line)
				f.write(line) 
		
	print(ctr)
	print(ctr2)
	f.close()

def run():
	stationList = readStationData()
	updateFareList(stationList)
	print("patch successful .. \n")

run()



