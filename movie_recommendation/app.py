from flask import Flask,render_template
from flask_swagger_ui import get_swaggerui_blueprint
from api.routes.movies.MoviesAPI import movies_api
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

### swagger specific ###
SWAGGER_URL = '/swagger'
API_URL = '/static/swagger.json'
SWAGGERUI_BLUEPRINT = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={
        'app_name': "Movie Recommendation System (Content Filter)"
    }
)

app.register_blueprint(SWAGGERUI_BLUEPRINT, url_prefix=SWAGGER_URL)

app.register_blueprint(movies_api)

@app.route("/")
def index():
    return render_template('index.html')


@app.route("/hello")
def hello():
    return "Hello World! Welcome to the movie recommendation app"

if __name__ == "__main__":
    app.run()

# for nodemon kind of functionality in flask run the following commands
# export FLASK_APP=app.py
# export FLASK_ENV=development 
# yash@yash-Inspiron-5558:~/Desktop/Python/flaskApi$ flask run
# export FLASK_DEBUG=1 ---- for nodemon 
# 