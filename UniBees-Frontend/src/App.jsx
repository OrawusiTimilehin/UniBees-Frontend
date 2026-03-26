import React from 'react';
import { 
  Routes, 
  Route, 
  Navigate 
} from 'react-router-dom';

/**
 * APOLLO CLIENT & AUTH HANDSHAKE
 */
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink
} from "@apollo/client";

import { ApolloProvider } from "@apollo/client/react";
import { setContext } from "@apollo/client/link/context";

/**
 * LOCAL PAGE & COMPONENT IMPORTS
 */
import SignUp from './pages/signup';
import Login from './pages/login';
import Profile from './pages/profile';
import BeesMatch from './pages/beesMatch';
import LayoutWrapper from './components/layoutWrapper';
import Explore from './pages/explore';
import Chats from './pages/personalChats';
import ManageSwarms from './pages/swarmManagement';
import SwarmChat from './pages/swarmChats'; // Added the missing Chat Page

// 1. Connection to your Python backend (Port 8000)
const httpLink = createHttpLink({
  uri: 'http://localhost:8000/graphql',
});

/**
 * 2. THE AUTH LINK
 */
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

/**
 * 3. Initialize the Client
 */
const client = new ApolloClient({
  link: authLink.concat(httpLink),
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

          {/* NEW: Swarm Chat Route 
              This is the destination for navigate(`/swarm/${id}`) 
              triggered by the Canvas code.
          */}
          <Route 
            path="/swarm/:id" 
            element={<ProtectedRoute><SwarmChat /></ProtectedRoute>} 
          />

          {/* Navigation Redirects */}
          <Route path="/" element={<Navigate to="/explore" replace />} />
          <Route path="*" element={<Navigate to="/explore" replace />} />
        </Routes>
      </LayoutWrapper>
    </ApolloProvider>
  );
};

export default App;