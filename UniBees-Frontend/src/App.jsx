import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Apollo Imports
// Using the specific import paths verified for your environment
import { ApolloProvider } from '@apollo/client/react';
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';

// Page & Component Imports
import SignUp from './pages/signup';
import Login from './pages/login';
import Explore from './pages/explore';
import Verification from './pages/verification';
import Profile from './pages/profile';
import BeesMatch from './pages/beesMatch';
import LayoutWrapper from './components/layoutWrapper';

/**
 * APOLLO CLIENT CONFIGURATION WITH AUTH LINK
 */

// 1. Define the connection to your Python backend
const httpLink = new HttpLink({
  uri: "http://localhost:8000/graphql", 
});

/**
 * 2. Define the Auth Link
 * This middleware pulls the JWT token from localStorage and attaches it 
 * to the Authorization header of every outgoing GraphQL request.
 */
const authLink = setContext((_, { headers }) => {
  // Pull the Digital ID (JWT) from browser storage
  const token = localStorage.getItem('token');
  
  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

/**
 * 3. Initialize the Client
 * We concatenate the authLink and the httpLink so the token 
 * is included before the request is sent over the network.
 */
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <LayoutWrapper>
          <Routes>
            {/* Authentication Routes */}
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verification" element={<Verification />} />

            {/* Protected Application Routes */}
            <Route path="/bees-match" element={<BeesMatch />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/profile" element={<Profile />} />

            {/* Navigation Logic */}
            <Route path="/" element={<Navigate to="/signup" />} />
            {/* Fallback for undefined paths */}
            <Route path="*" element={<Navigate to="/signup" />} />
          </Routes>
        </LayoutWrapper>
      </Router>
    </ApolloProvider>
  );
}

export default App;