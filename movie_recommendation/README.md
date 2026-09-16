# movie_recommendation

## Run locally

```bash
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python app.py
```

Open <http://127.0.0.1:5000> in a browser. The API is also available at
`/movies/search` and `/movies/recommend`.

For production, use:

```bash
.venv/bin/gunicorn app:app
```
