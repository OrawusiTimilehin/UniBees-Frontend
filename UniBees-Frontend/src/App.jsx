import React from 'react'
import SignUp from './pages/signup'

import {Routes, Route, Navigate} from 'react-router-dom'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Navigate to="/signup"/>} />
      </Routes>
    </div>
  );
}

export default App