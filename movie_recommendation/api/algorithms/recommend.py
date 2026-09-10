
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

df = pd.read_csv("static/movie_dataset.csv")

print('keeping the movie data in the memory for quicker response\n')
# print(df_poster['movie-name'])
print('\n')

poster = {}

with open("static/movie_poster.csv","r") as f:
  counter = 0
  for line in f:
    counter += 1

    x = f.readline().split(",")
    n = x[0].strip()
    name = x[1].strip()
    img_url = x[2].strip()
    if img_url: 
      poster[name] = img_url

  # print("printing the poster urls",poster[str("Batman v Superman: Dawn of Justice")],"count : ",counter,"\n")
  # print("\n ",poster," \n")



def get_title_from_index(index):
    return df[df.index == index]["title"].values[0]
def get_index_from_title(title):
    return df[df.title == title]["index"].values[0]

def combine_features(row):
  return row['keywords']+" "+row['cast']+" "+row['genres']+" "+row['director']

def recommendation(movie_name,N=5):
  text = ["London Paris London","Paris Paris London"]
  cv = CountVectorizer()
  count_matrix = cv.fit_transform(text)
  # print(cv.get_feature_names())
  # print(count_matrix.toarray())
  similarity_scores = cosine_similarity(count_matrix)
  # print(similarity_scores)

  features = ['keywords','cast','genres','director']

  for feature in features:
    df[feature] = df[feature].fillna('') #filling all NaNs with blank string

  df["combined_features"] = df.apply(combine_features,axis=1) 
  # applying combined_features() method over each rows of dataframe 
  # and storing the combined string in "combined_features" column
  df.iloc[0].combined_features
  cv = CountVectorizer() # creating new CountVectorizer() object
  count_matrix = cv.fit_transform(df["combined_features"]) 
  # feeding combined strings(movie contents) to CountVectorizer() object
  cosine_sim = cosine_similarity(count_matrix)
  movie_user_likes =  movie_name  
  movie_index = get_index_from_title(movie_user_likes)
  similar_movies = list(enumerate(cosine_sim[movie_index])) 
  # accessing the row corresponding to given movie to find all the similarity scores 
  # for that movie and then enumerating over it
  sorted_similar_movies = sorted(similar_movies,key=lambda x:x[1],reverse=True)[1:]
  i=0
  recommended_list = []
  # print("Top 5 similar movies to "+movie_user_likes+" are:\n")
  try:
    recommended_list.append([movie_name,poster[movie_name]])
  except:
    print("poster not found .. ")
    recommended_list = []

  for element in sorted_similar_movies:
    movie_title = get_title_from_index(element[0])
    
    try:
      movie_poster = poster[movie_title]
      recommended_list.append([movie_title,movie_poster])
    except:
      print("error")
      continue
    
    
    # print(get_title_from_index(element[0]))
    i=i+1
    if i>N:
        break
  
  return recommended_list

def search(movie_startWith, N=5):

  # print('movie_startWith = ', movie_startWith, ' N = ',N)
  # capitalize the first letter in case if user give 
  # input in small letter
  movie_startWith = movie_startWith.capitalize()

  some_list = df.loc[:,"original_title"].values.tolist()
  result = filter(lambda x: x.startswith(movie_startWith), some_list)
  filtered_list = list(result)
  # print(' Getting the list of search \n',filtered_list)
  
  return filtered_list[0:int(N)+1]



# def greeting(name):
#   print("Hello, " + name)
#   return 5