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
    <div>
      <ApolloProvider client={client}>
      <div> 
        <div style={{ paddingTop:50, paddingLeft:50, }}>
          <AddBook />
        </div>
        <br />
        <div style={{ paddingTop:50, paddingLeft:50,}}>
          <BookList />
          
        </div>
      </div>
      </ApolloProvider>
    </div>
  );
}

export default App;
