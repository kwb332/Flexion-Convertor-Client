//About - this is the main App.js file connected to index.js

import React from 'react';

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

//css
import './App.css';

//components
import AppRoutes from './PageRoutes/Routes';
import Navbar from './Containers/Navbar';


//Apollo Client setup - change 'uri' here to update the endpoint
const client = new ApolloClient({
  uri: "https://cors-anywhere.herokuapp.com/https://flexion-convertor-gateway.herokuapp.com/graphql"
})


function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <Navbar />
        <AppRoutes />
      </div>
    </ApolloProvider>
  );
}

export default App;
