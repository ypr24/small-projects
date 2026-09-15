# Deploy with Docker Compose

This project demonstrates how to run multiple services together using Docker Compose:

- An Express.js application
- A FastAPI application
- An Nginx reverse proxy

The setup is useful for learning container orchestration, service networking, and reverse proxy routing in a small multi-service environment.

## Project structure

```text
.
├── docker-compose.yml
├── README.md
├── my-express-app/
│   ├── Dockerfile
│   ├── index.js
│   └── package.json
├── my-fastapi-app/
│   ├── Dockerfile
│   ├── main.py
│   └── requirements.txt
├── nginx/
│   ├── Dockerfile
│   └── default.conf
└──
```

## Services

### 1. Express app
- Framework: Node.js + Express
- Container port: 3000
- Host port: 3001
- URL: http://localhost:3001

This service responds with a simple message:

```text
Hello from Dockerized Express app 1!
```

### 2. FastAPI app
- Framework: Python + FastAPI
- Container port: 8000
- Host port: 3002
- URL: http://localhost:3002

This service exposes a root endpoint returning:

```json
{"Hello": "World 2"}
```

### 3. Nginx reverse proxy
- Port: 80
- URL: http://localhost

Nginx routes requests to the correct backend:

- /express/ -> Express app
- /fastapi/ -> FastAPI app

Example URLs:

- http://localhost/express/
- http://localhost/fastapi/

## Docker Compose setup

The project uses a shared Docker network named `my_network` and starts all services together from the root directory.

### Compose file overview

```yaml
services:
  app:
    build: ./my-express-app
    ports:
      - "3001:3000"

  fastapi:
    build: ./my-fastapi-app
    ports:
      - "3002:8000"

  nginx:
    build: ./nginx
    ports:
      - "80:80"
    depends_on:
      - app
      - fastapi
```

## Prerequisites

Before running the project, make sure you have installed:

- Docker
- Docker Compose

You can verify installation with:

```bash
docker --version
docker compose version
```

## Run the project

From the project root, start all services:

```bash
docker compose up --build
```

To run in detached mode:

```bash
docker compose up --build -d
```

To stop and remove containers:

```bash
docker compose down
```

To rebuild after code changes:

```bash
docker compose up --build --force-recreate
```

## Access the apps

After starting the containers:

- Express app directly: http://localhost:3001
- FastAPI app directly: http://localhost:3002
- Through Nginx: http://localhost/express/ and http://localhost/fastapi/

## Example requests

### Express via Nginx

```bash
curl http://localhost/express/
```

Expected response:

```text
Hello from Dockerized Express app 1!
```

### FastAPI via Nginx

```bash
curl http://localhost/fastapi/
```

Expected response:

```json
{"Hello": "World 2"}
```

## Configuration notes

### Nginx routing

The Nginx configuration defines two upstream services:

```conf
upstream express_app {
    server app:3000;
}

upstream fastapi_app {
    server fastapi:8000;
}
```

Then it forwards requests to those services based on the URL path prefix.

### Deploying on a live domain (example.com)

This project works on a public server without changing the Docker Compose setup, as long as the Nginx server name matches the real domain.

The only important change is in `nginx/default.conf`:

```nginx
server {
    listen 80;
    server_name example.com www.example.com;

    location /express/ {
        proxy_pass http://express_app/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /fastapi/ {
        proxy_pass http://fastapi_app/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

This allows requests like these to work on the live server:

- http://example.com/express/
- http://example.com/fastapi/

If your domain is different, replace `example.com` with your actual domain name.

> Note: This configuration is still for HTTP on a single domain. For production, you would normally add HTTPS certificates and a secure reverse-proxy setup as a next step.

### Docker networking

Because all services are on the same Docker network, the application containers communicate with each other using their service names such as:

- `app`
- `fastapi`
- `nginx`

This avoids hardcoded IP addresses and is the standard pattern for containerized multi-service applications.

## Useful commands

View running containers:

```bash
docker compose ps
```

View logs for all services:

```bash
docker compose logs -f
```

View logs for a specific service:

```bash
docker compose logs -f app
docker compose logs -f fastapi
docker compose logs -f nginx
```

## Troubleshooting

### Port already in use
If you see errors about ports 80, 3001, or 3002 already being used, stop the conflicting local service or change the published ports in `docker-compose.yml`.

### Container not starting
Check the logs:

```bash
docker compose logs
```

### Route not found through Nginx
Make sure the Nginx container is running and verify the `default.conf` file contains the expected route definitions.

## Learning goals

This project is a simple example of:

- containerizing multiple apps with Docker
- connecting services through a shared Docker network
- using Nginx as a reverse proxy
- exposing multiple apps through a single web entry point

## License

This project is provided for learning and demonstration purposes.
