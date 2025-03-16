import './App.css';
import { Routes, Route } from 'react-router-dom';
import Login from './Components/Login'; // Ensure this import is correct
import Signup from './Components/SignUp';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
      </Routes>
    </>
  );
}

export default App;