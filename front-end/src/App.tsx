import './App.css'
import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage/LandingPage'
import SavvyService from './features/SavvyService/SavvyService';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import { Routes, Route, Navigate } from 'react-router-dom'

function App() {

  return (
    <Routes>
      <Route path='' element={<LandingPage />}/>
      <Route path='/savvy-service' element={<SavvyService />}/>
      <Route path='*' element={<NotFoundPage />}/>
    </Routes>
  );
}

export default App
