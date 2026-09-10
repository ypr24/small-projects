from flask import Blueprint, request
from ...algorithms.recommend import recommendation, search

movies_api = Blueprint('movies_api', __name__)

# recommend top N movies if movie X is selected 

@movies_api.route("/movies/recommend")
def getRecommendedMovie():
    n = request.args.get('n')
    name = request.args.get('name')
    # print('N = ',n, " Name = ", name)

    # limiting the answers to 50 at max
    n = int(n)
    n = 50 if (n>50) else n

    li = recommendation(name, int(n))
    return {
        'n' : n,
        'name' : name,
        'recommended': li
    }

# Suggest movies starts with same name for searching
@movies_api.route("/movies/search")
def searchMovieNameStartsWith():
    sw = request.args.get('startwith')
    n = request.args.get('n')

    print('startwith = ', sw)
    
    # limiting the answers to 20 at max
    n = int(n)
    n = 20 if (n>20) else n
    li = search(sw, n)
    
    return {
        'n': n,
        'startsWith': sw,
        'li': li
    }


