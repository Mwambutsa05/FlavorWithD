import { Navigate, Route, Routes } from 'react-router-dom'
import { LandingPage } from "./components/LandingPage";
import { Dashboard } from './components/Dashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './components/LoginPage';
import { selectCurrentToken } from './features/authSlice';
import { useSelector } from 'react-redux';



function App() {
   
  const token = useSelector(selectCurrentToken);

  return (
    <Routes>
      <Route path="/" element = {<LandingPage/>} />
      <Route path="/dashboard" element= {<ProtectedRoute><Dashboard/></ProtectedRoute>} />
      <Route path='/login' element= { token ? <Navigate to = "/dashboard" replace/> : <LoginPage /> } />

    </Routes>
  )
}

export default App