import React from 'react';
import { 
  Routes, 
  Route, 
  Navigate 
} from 'react-router-dom';

/**
 * APOLLO CLIENT & AUTH HANDSHAKE
 * Standardized imports to solve "Could not resolve" errors.
 * In Apollo 3.x+, most components are available directly from "@apollo/client".
 */
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from
} from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

/**
 * LOCAL PAGE & COMPONENT IMPORTS
 * Note: These errors in the preview occur because the Canvas environment 
 * cannot "see" your local folder structure. This code is correct for your 
 * local VS Code / IDE environment.
 */
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
/**
 * 1. THE SESSION WATCHER (The "Disappearing Swarm" Fix)
 * This watches for any "Not authenticated" response from the backend.
 * Even if your token is set for 30 days, if the backend rejects it 
 * (e.g., due to a server restart or secret change), this logic 
 * will instantly clear the dead token and force a fresh login.
 */
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

// 2. Connection to your Python backend (Port 8000)
const httpLink = createHttpLink({
  uri: 'http://localhost:8000/graphql',
});

/**
 * 3. THE AUTH LINK
 * Attaches your token to every request.
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
 * 4. Initialize the Client
 * Chaining: ErrorLink -> AuthLink -> HttpLink
 */
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