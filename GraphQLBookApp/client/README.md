# GraphQL Book App Client

This directory contains the React frontend for the GraphQL Book App. It uses Apollo Client to communicate with the GraphQL API in the project root.

## Features

- Add a book by entering its name and selecting an author.
- Display all books returned by the GraphQL API.
- Select a book to view its ID, name, author, and the author's other books.
- Refresh the book list after adding a book.

## Technologies

- React 17
- Create React App
- Apollo Client through `apollo-boost`
- `react-apollo` for GraphQL-connected components
- GraphQL

## Requirements

- Node.js and npm
- The backend API running from the project root on port `3005`

## Installation

From this directory, install the frontend dependencies:

```bash
npm install
```

The frontend expects the backend to be available at:

```text
http://localhost:3005/graphql
```

Start the backend in a separate terminal from the project root:

```bash
cd ..
npm start
```

## Running the Client

Start the React development server from the `client` directory:

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in a browser. The page reloads automatically when source files change.

## Application Flow

1. `src/index.js` mounts the React application and enables `React.StrictMode`.
2. `src/App.js` creates an Apollo client and wraps the UI with `ApolloProvider`.
3. `AddBook` displays the book form and sends the `addBook` mutation.
4. `BookList` loads books with the `books` query and tracks the selected book.
5. `BookDetails` loads the selected book with the `book` query and displays its author and related books.

## Project Structure

```text
src/
├── App.js                  # Apollo setup and main page layout
├── App.css                 # App styles
├── index.js                # React entry point
├── index.css               # Global styles
├── components/
│   ├── AddBook.js           # Add-book form and mutation
│   ├── BookDetails.js       # Selected-book details
│   └── BookList.js          # Book list and selection state
└── queries/
    └── queries.js          # GraphQL queries and mutations
```

## GraphQL Operations

The operations are defined in `src/queries/queries.js`.

### Queries

- `getAuthorsQuery` loads author IDs and names.
- `getBooksQuery` loads book IDs and names for the list.
- `getBookQuery` loads one book, its author, and that author's books.

### Mutation

`addBookMutation` sends the book name and author ID:

```graphql
mutation AddBook($name: String!, $authorid: Int!) {
  addBook(name: $name, authorid: $authorid) {
    name
    id
  }
}
```

After the mutation completes, the client refetches the book list and selected-book query.

## Available Scripts

Run these commands from the `client` directory:

- `npm start` starts the development server on port `3000`.
- `npm test` runs the React test suite in watch mode.
- `npm run build` creates an optimized production build in `build/`.
- `npm run eject` exposes the Create React App configuration. This is irreversible.

## Configuration Notes

- The GraphQL URL is configured directly in `src/App.js`.
- The author selector currently contains three hard-coded authors: J. K. Rowling, J. R. R. Tolkien, and Brent Weeks.
- Book and author data are stored in memory by the backend, so newly added books disappear when the backend restarts.
- The client must be running alongside the backend for queries and mutations to work.
