# GraphQL Book App

A small book library application with a GraphQL API and a React client. The app lets you add books, browse the book list, and view an author's other books.

## Tech Stack

- **Backend:** Node.js, Express, GraphQL, `express-graphql`
- **Frontend:** React 17, Create React App, Apollo Client
- **Data:** In-memory JavaScript arrays

## Project Structure

```text
.
├── index.js                 # Express and GraphQL server
├── graphql/
│   ├── models/              # In-memory authors and books
│   └── schemas/             # GraphQL type definitions and resolvers
└── client/
    └── src/
        ├── components/      # AddBook, BookList, and BookDetails
        └── queries/         # Apollo GraphQL queries and mutations
```

## Requirements

- Node.js and npm

## Installation

Install dependencies for the API and client separately:

```bash
npm install
cd client
npm install
cd ..
```

## Running the Application

Start the GraphQL API from the project root:

```bash
npm start
```

The API runs at [http://localhost:3005](http://localhost:3005). GraphiQL is available at [http://localhost:3005/graphql](http://localhost:3005/graphql).

In a second terminal, start the React client:

```bash
cd client
npm start
```

The client runs at [http://localhost:3000](http://localhost:3000) and connects to `http://localhost:3005/graphql`.

For backend development with automatic restarts, run `npm run dev` from the project root.

## GraphQL API

### Queries

```graphql
# Get every book
{
  books {
    id
    name
    author {
      id
      name
    }
  }
}

# Get one book and all books by its author
query GetBook($id: ID) {
  book(id: $id) {
    id
    name
    author {
      id
      name
      books {
        id
        name
      }
    }
  }
}

# Get all authors
{
  authors {
    id
    name
  }
}
```

### Mutations

```graphql
# Add a book
mutation AddBook($name: String!, $authorid: Int) {
  addBook(name: $name, authorid: $authorid) {
    id
    name
    author {
      id
      name
    }
  }
}

# Add an author
mutation AddAuthor($name: String!) {
  addAuthor(name: $name) {
    id
    name
  }
}
```

Example variables for `AddBook`:

```json
{
  "name": "The Name of the Wind",
  "authorid": 1
}
```

## Backend Endpoints

- `GET /test` returns a small JSON response to verify that the server is running.
- `POST /graphql` handles GraphQL queries and mutations.
- `GET /graphql` opens the GraphiQL interface in a browser.

## Available Scripts

### Root directory

- `npm start` starts the API with Node.js.
- `npm run dev` starts the API with Nodemon.

### `client` directory

- `npm start` starts the React development server.
- `npm test` runs the React test suite.
- `npm run build` creates a production build in `client/build`.

## Notes

The backend stores authors and books in memory. Changes made through GraphQL are lost whenever the server restarts. The client currently connects to the API at `http://localhost:3005/graphql`; update `client/src/App.js` if the API runs elsewhere.
