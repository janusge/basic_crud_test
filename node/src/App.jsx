import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Users from './Users';
import Register from './register';
import Joke from './Joke';
import './App.css'

function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/users" element={<Users />} />   
        <Route path="/register" element={<Register />} />
        <Route path="/joke" element={<Joke />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
