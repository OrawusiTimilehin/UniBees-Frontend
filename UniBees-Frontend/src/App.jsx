import React from 'react';
import { 
  Routes, 
  Route, 
  Navigate 
} from 'react-router-dom';


import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from
} from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";


import SignUp from './pages/signup';
import Login from './pages/login';
import Profile from './pages/profile';
import BeesMatch from './pages/beesMatch';
import LayoutWrapper from './components/layoutWrapper';
import Explore from './pages/explore';
import Chats from './pages/personalChats';
import ManageSwarms from './pages/swarmManagement';
import SwarmChat from './pages/swarmChats';
import PublicProfile from './pages/publicProfile';
import PrivateChat from './pages/privateChatroom';
import LandingPage from './pages/landingPage';

// THE SESSION WATCHER 
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      if (err.message === "Not authenticated" || err.message === "Invalid hive credentials") {
        console.warn("🐝 Hive Session Expired. Clearing keys...");
        localStorage.removeItem('token');
        // Force hard redirect to the login page to ensure a clean state
        window.location.href = "/login";
      }
    }
  }
  if (networkError && networkError.statusCode === 401) {
    localStorage.removeItem('token');
    window.location.href = "/login";
  }
});

// Connection to Python backend 
const httpLink = createHttpLink({
  uri: 'http://localhost:8000/graphql',
});


//  THE AUTH LINK

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});


const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});

/**
 * PROTECTED ROUTE
 */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <ApolloProvider client={client}>
      <LayoutWrapper>
        <Routes>
          {/* Public Routes */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<LandingPage />} />
          
          {/* Protected Hive Routes */}
          <Route 
            path="/bees-match" 
            element={<ProtectedRoute><BeesMatch /></ProtectedRoute>} 
          />
          <Route 
            path="/profile" 
            element={<ProtectedRoute><Profile /></ProtectedRoute>} 
          />
          <Route 
            path="/manage-swarms" 
            element={<ProtectedRoute><ManageSwarms /></ProtectedRoute>} 
          />
          <Route 
            path="/explore" 
            element={<ProtectedRoute><Explore /></ProtectedRoute>} 
          />
          <Route 
            path="/chats" 
            element={<ProtectedRoute><Chats /></ProtectedRoute>} 
          />

          {/* Swarm Chat Route */}
          <Route 
            path="/swarm/:id" 
            element={<ProtectedRoute><SwarmChat /></ProtectedRoute>} 
          />
          <Route 
            path="/profile/:userId" 
            element={<ProtectedRoute><PublicProfile /></ProtectedRoute>} 
          />
          <Route 
            path="/chat/:userId" 
            element={<ProtectedRoute><PrivateChat /></ProtectedRoute>} 
          />

          {/* Navigation Redirects */}
  
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </LayoutWrapper>
    </ApolloProvider>
  );
};

export default App;