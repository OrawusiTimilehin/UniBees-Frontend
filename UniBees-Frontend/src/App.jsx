import React from 'react'
import SignUp from './pages/signup'
import Login from './pages/login'
import {Routes, Route, Navigate} from 'react-router-dom'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Navigate to="/signup"/>} />
        <Route path="/login" element={<Login/>}/>
      </Routes>
    </div>
  );
}

export default App