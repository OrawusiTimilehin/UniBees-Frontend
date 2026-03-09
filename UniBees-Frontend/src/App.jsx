import React from 'react'
import SignUp from './pages/signup'
import Login from './pages/login'
import Explore from './pages/explore'
import Verification from './pages/verification'
import Profile from './pages/profile'
import Navbar from './components/navbar';
import BeesMatch from './pages/beesMatch';
import LayoutWrapper from './components/layoutWrapper';
import {Routes, Route, Navigate} from 'react-router-dom'


function App() {
  return (
    <div>
      <LayoutWrapper>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<Navigate to="/signup"/>} />
          <Route path="/login" element={<Login/>}/>
          <Route path="/explore" element={<Explore/>}/>
          <Route path="/verification" element={<Verification/>}/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/bees-match" element={<BeesMatch/>}/>
        </Routes>
      </LayoutWrapper>
    
    </div>
  );
}

export default App