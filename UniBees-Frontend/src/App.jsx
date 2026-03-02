import React from 'react'
import SignUp from './pages/signup'
import Login from './pages/login'
import Explore from './pages/explore'
import Verification from './pages/verification'
import {Routes, Route, Navigate} from 'react-router-dom'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Navigate to="/signup"/>} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/explore" element={<Explore/>}/>
        <Route path="/verification" element={<Verification/>}/>
      </Routes>
    </div>
  );
}

export default App