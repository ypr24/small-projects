import './App.css';
import AddBook from './components/AddBook';
import BookList from './components/BookList';

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

const client = new ApolloClient({
  uri: 'http://localhost:3005/graphql',
});


function App() {
  return (
    <ApolloProvider client={client}>
      <div className="app-shell">
        <header className="app-header">
          <div className="brand-mark" aria-hidden="true">GB</div>
          <div>
            <p className="eyebrow">Personal library</p>
            <h1>GraphQL Book App</h1>
            <p className="header-copy">Keep track of the stories worth returning to.</p>
          </div>
        </header>

        <main className="app-content">
          <AddBook />
          <BookList />
        </main>
      </div>
    </ApolloProvider>
  );
}

export default App;
