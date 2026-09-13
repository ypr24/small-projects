# Tourist Backend

A REST API for managing tourist places. The application is built with Node.js, Express, and MongoDB through Mongoose.

## Features

- Create, read, update, and delete tourist places
- MongoDB persistence
- JSON request and response handling
- CORS support
- Request logging with Morgan
- Interactive Swagger API documentation

## Requirements

- Node.js 16 or newer
- npm
- MongoDB running locally, or a MongoDB connection URI

## Installation

```bash
npm install
```

By default, the application connects to:

```text
mongodb://localhost/traveldb
```

To use another MongoDB instance, set `MONGODB_URI` before starting the server:

```bash
export MONGODB_URI="mongodb://localhost:27017/traveldb"
```

You can also choose another port. The default port is `3005`:

```bash
export PORT=3005
```

## Running the API

Start the application normally:

```bash
npm start
```

Start it in development mode with automatic restarts:

```bash
npm run dev
```

The API is then available at:

```text
http://localhost:3005
```

## API Documentation

Open Swagger UI in a browser:

```text
http://localhost:3005/api-docs/
```

The Swagger definition is stored in `docs/place.yaml`.

## Endpoints

### Get all places

```http
GET /place/getallplaces
```

Example:

```bash
curl http://localhost:3005/place/getallplaces
```

### Create a place

```http
POST /place/insert
Content-Type: application/json
```

Required field: `name`.

Example:

```bash
curl -X POST http://localhost:3005/place/insert \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Red Fort",
    "address": "Netaji Subhash Marg, New Delhi",
    "description": "A historic fort in Old Delhi.",
    "image": "https://example.com/red-fort.jpg"
  }'
```

### Update a place

```http
PUT /place/update
Content-Type: application/json
```

The existing place is selected by `name`. Include at least one field to update. Use `newName` to change the place name.

Example:

```bash
curl -X PUT http://localhost:3005/place/update \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Red Fort",
    "description": "A historic fort and UNESCO World Heritage Site.",
    "newName": "Red Fort, Delhi"
  }'
```

### Delete a place

```http
DELETE /place/delete
Content-Type: application/json
```

Example:

```bash
curl -X DELETE http://localhost:3005/place/delete \
  -H "Content-Type: application/json" \
  -d '{"name": "Red Fort, Delhi"}'
```

### Test endpoint

```http
POST /test
Content-Type: application/json
```

This endpoint is a small request-body demonstration and returns a sample response. It is not part of the place-management workflow.

## Place fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | string | Yes when creating | Unique name of the place |
| `address` | string | No | Address or location |
| `description` | string | No | Description of the place |
| `image` | string | No | Image URL |
| `placeCreatedAt` | date | Automatically generated | Creation timestamp |

## Project structure

```text
.
├── api/
│   ├── controller/place.js  # Place request handlers
│   ├── models/place.js      # Mongoose place model
│   └── route/place.js       # Place API routes
├── docs/place.yaml          # OpenAPI route definitions
├── index.js                 # Application entrypoint
├── package.json             # Scripts and dependencies
└── package-lock.json        # Locked dependency versions
```

## Error responses

Common status codes are:

- `201`: Place created successfully
- `200`: Request completed successfully
- `400`: Missing or invalid request data
- `404`: Place was not found
- `409`: A place with the same name already exists
- `500`: Server or database error

## Notes

- Place names are unique in the database.
- MongoDB must be running before using the place endpoints.
- The current project does not yet include automated tests. The `npm test` script is still a placeholder.
