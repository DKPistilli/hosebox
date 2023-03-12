import { BrowserRouter as Router, Routes, Route } from
        'react-router-dom';

//import toast
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import Routing pages
import Welcome    from './pages/Welcome';
import Login      from './pages/Login';
import Register   from './pages/Register';
import Inventory  from './pages/Inventory';
import Wishlist   from './pages/Wishlist';
import Decklist   from './pages/Decklist';
import NoPage     from './pages/NoPage';

// import components
import Header from './components/Header';

function App() {
  return (
    <>
      <Router>
        <div className='container'>
          <Header />
          <Routes>
            <Route path='/'                       element={<Welcome   />} />
            <Route path='/login'                  element={<Login     />} />
            <Route path='/register'               element={<Register  />} />
            <Route path='/inventories'            element={<Inventory />} />
            <Route path='/wishlists'              element={<Wishlist  />} />
            <Route path='/wishlists/:wishlistId'  element={<Wishlist  />} />
            <Route path='/decks/:deckId'          element={<Decklist  />} />
            <Route path='*'                       element={<NoPage    />} />
            
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
