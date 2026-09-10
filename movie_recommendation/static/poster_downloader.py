from selenium import webdriver
import time, requests
import pandas as pd

df = pd.read_csv("movie_dataset.csv")

some_list = df.loc[:,"original_title"].values.tolist()

# print(len(some_list))
startWithMovie = "Avatar"
movieIdx = some_list.index(startWithMovie)
# print(movieIdx)

append = False
mode = "w"
if(append):
    movieIdx += 1
    mode = "a"

with open("movie_poster.csv",mode) as f:
    browser = webdriver.Chrome('/home/yash/Desktop/Python/chromedriver')

    for i in range(movieIdx, len(some_list)):
        item = some_list[i]
        f.write(str(i+1)+", "+item+", ")

        search_query = item+" movie imdb"
        search_url = f"https://www.google.com/search?site=&tbm=isch&source=hp&biw=1873&bih=990&q={search_query}"
        images_url = []
        try:
            browser.get(search_url)
            elements = browser.find_elements_by_class_name('rg_i')

            count = 0
            for e in elements:
                # get images source url
                e.click()
                time.sleep(1)
                element = browser.find_elements_by_class_name('v4dQwb')

                # Google image web site logic
                if count == 0:
                    big_img = element[0].find_element_by_class_name('n3VNCb')
                else:
                    big_img = element[1].find_element_by_class_name('n3VNCb')

                images_url.append(big_img.get_attribute("src"))

                # write image to file
                reponse = requests.get(images_url[count])
                # if reponse.status_code == 200:
                #     with open(f"search{count+1}.jpg","wb") as file:
                #         file.write(reponse.content)

                count += 1

                # Stop get and save after 5
                if count == 1:
                    break
            time.sleep(1)
            # print("\n\nURL of the images : ",images_url,"\n\n")
            imagesURL = str(images_url[0])
            f.write(' '+imagesURL)
        except:
            print('exception')
        f.write(",\n")



