# Tourist Frontend

A small Next.js frontend for browsing and managing tourist places. The application uses the Pages Router, React, Material UI, and Axios. Place data is provided by a separate backend service.

## Requirements

- Node.js 18.18 or later
- npm
- A running tourist API service on `http://localhost:3005`

## Installation

Install the frontend dependencies from the project root:

```bash
npm install
```

The API base URL is currently configured in [`config/config.js`](config/config.js):

```js
export const API_URL = 'http://localhost:3005/'
```

Change this value when the backend is running on another host or port.

## Development

Start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in a browser.

Available npm scripts:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server with hot reloading |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server after a build |

## Application Routes

| Route | Purpose |
| --- | --- |
| `/` | Home page |
| `/allplaces` | Fetch and display all places; supports deleting a place |
| `/addplace` | Add or update a place |
| `/api/hello` | Example Next.js API route included with the project |

The `/allplaces` and `/addplace` pages share the navigation rendered by `hoc/HeaderLayout.js`.

## Backend API Contract

The frontend calls the following endpoints relative to `API_URL`:

| Method | Endpoint | Used for |
| --- | --- | --- |
| `GET` | `/place/getallplaces` | Load places |
| `POST` | `/place/insert` | Add a place |
| `PUT` | `/place/update` | Update a place |
| `DELETE` | `/place/delete` | Delete a place by name |

The list endpoint should return an object containing a `list` array. Add and update requests send JSON with these fields:

```json
{
	"name": "Example place",
	"address": "Example address",
	"description": "A short description",
	"image": "https://example.com/image.jpg"
}
```

The delete request sends `{ "name": "Example place" }` in the request body.

## Project Structure

```text
components/
	AddPlace/        Place form and create/update actions
	AllPlaces/       Place list and delete behavior
	Head/            Shared navigation
config/            API configuration
hoc/               Shared page layout
pages/             Next.js pages and API routes
public/            Static assets
styles/            Global and page-specific styles
```

## Troubleshooting

- If the place list is empty or requests fail, verify that the backend is running and that `API_URL` points to it.
- If the browser reports a CORS error, configure the backend to allow requests from `http://localhost:3000`.
- If dependencies are missing, remove `node_modules`, run `npm install`, and restart the development server.

## Related Documentation

- [Next.js documentation](https://nextjs.org/docs)
- [React documentation](https://react.dev/)
- [Material UI documentation](https://mui.com/material-ui/)
- [Axios documentation](https://axios-http.com/docs/intro)
