import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

/**
 * APOLLO CLIENT CONFIGURATION
 * We use the standard entry point to ensure better compatibility with the build environment.
 */
import { 
  ApolloProvider, 
  ApolloClient, 
  InMemoryCache, 
  createHttpLink 
} from "@apollo/client";
import { setContext } from '@apollo/client/link/context';

/**
 * PREVIEW PLACEHOLDERS
 * To resolve the "Could not resolve" errors in this environment, 
 * I've added these placeholders. In your local VS Code project, 
 * you should keep your actual imports:
 * * import SignUp from './pages/signup';
 * import Login from './pages/login';
 * ...etc.
 */
const SignUp = () => <div style={{ padding: '20px' }}>Sign Up Page</div>;
const Login = () => <div style={{ padding: '20px' }}>Login Page</div>;
const Explore = () => <div style={{ padding: '20px' }}>Explore Page</div>;
const Verification = () => <div style={{ padding: '20px' }}>Verification Page</div>;
const Profile = () => <div style={{ padding: '20px' }}>Profile Page</div>;
const BeesMatch = () => <div style={{ padding: '20px' }}>Bees Match Page</div>;
const LayoutWrapper = ({ children }) => <div className="layout-root">{children}</div>;

// 1. Connection to your Python backend
const httpLink = createHttpLink({
  uri: "http://localhost:8000/graphql", 
});

/**
 * 2. THE AUTH LINK
 * Grabs the token from storage and attaches it to headers.
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
 * Combining authLink and httpLink ensures the token is sent globally.
 */
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

/**
 * PROTECTED ROUTE
 * Redirects unauthenticated bees back to the login gate.
 */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <ApolloProvider client={client}>
      {/* Router is omitted here as per your setup where 
          BrowserRouter wraps App in main.jsx.
      */}
      <LayoutWrapper>
        <Routes>
          {/* Public Routes */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verification" element={<Verification />} />

          {/* Protected Routes */}
          <Route 
            path="/bees-match" 
            element={<ProtectedRoute><BeesMatch /></ProtectedRoute>} 
          />
          <Route 
            path="/explore" 
            element={<ProtectedRoute><Explore /></ProtectedRoute>} 
          />
          <Route 
            path="/profile" 
            element={<ProtectedRoute><Profile /></ProtectedRoute>} 
          />

          {/* Default Fallback */}
          <Route path="/" element={<Navigate to="/signup" />} />
          <Route path="*" element={<Navigate to="/signup" />} />
        </Routes>
      </LayoutWrapper>
    </ApolloProvider>
  );
}

export default App;