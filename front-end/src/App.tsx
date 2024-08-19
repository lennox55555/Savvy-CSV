import './App.css'
import LandingPage from './pages/LandingPage/LandingPage'
import SavvyService from './features/SavvyService/SavvyService';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import { Routes, Route } from 'react-router-dom'
import SignInPage from './pages/SignInPage/SignInPage';

function App() {

  return (
    <Routes>
      <Route path='/' element={<LandingPage />}/>
      <Route path='/signin' element={<SignInPage />}/>
      <Route path='/savvycsv' element={<SavvyService />}/>
      <Route path='*' element={<NotFoundPage />}/>
    </Routes>
  );
}

export default App
