import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Search from './pages/Search';

const NoMatch = () => {
  return (
    <p>Error 404: Path not recognized.</p>
  )
}

const Main = () => {
  return (
    <BrowserRouter> {/* Router swaps topmost page component based on url */}
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/signup' element={<Signup/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/search' element={<Search/>}></Route>
        <Route path='*' element={<NoMatch/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Main;