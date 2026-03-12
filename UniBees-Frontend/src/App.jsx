import React from 'react';
import { 
  Routes, 
  Route, 
  Navigate 
} from 'react-router-dom';

/**
 * APOLLO CLIENT & AUTH HANDSHAKE
 * Following your requested strict split import structure.
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
 * These are imported from your local files to keep App.jsx clean.
 */
import SignUp from './pages/signup';
import Login from './pages/login';
import Profile from './pages/profile';
import BeesMatch from './pages/beesMatch';
import LayoutWrapper from './components/layoutWrapper';
import Explore from './pages/explore';
import Chats from './pages/personalChats';
import ManageSwarms from './pages/swarmManagement';

// 1. Connection to your Python backend (Port 8000)
const httpLink = createHttpLink({
  uri: 'http://localhost:8000/graphql',
});

/**
 * 2. THE AUTH LINK
 * This middleware attaches your JWT 'ID Badge' to every request.
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
 * Combining authLink and httpLink ensures the backend sees your login status.
 */
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

/**
 * PROTECTED ROUTE
 * Redirects unauthenticated bees to the login gate.
 */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <ApolloProvider client={client}>
      {/* Note: Router is omitted as it wraps App in your main.jsx */}
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
          {/* Module Placeholders */}
          <Route 
            path="/explore" 
            element={<ProtectedRoute><Explore /></ProtectedRoute>} 
          />
          <Route 
            path="/chats" 
            element={<ProtectedRoute><Chats /></ProtectedRoute>} 
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