import { BrowserRouter as Router, Routes, Route } from
        'react-router-dom';

//import toast
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import Routing pages
import Welcome from './pages/Welcome';
import Inventory from './pages/Inventory';
import Login from './pages/Login';
import Register from './pages/Register';

// import components
import Header from './components/Header';

function App() {
  return (
    <>
      <Router>
        <div className='container'>
          <Header />
          <Routes>
            <Route path='/' element={<Welcome />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/inventory' element={<Inventory />} />
          </Routes>

        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
