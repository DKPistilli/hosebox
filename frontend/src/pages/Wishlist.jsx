import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Spinner   from '../components/Spinner';
import Sidebar   from '../components/Sidebar';
import CardTable from '../components/CardTable';

// import http request service
import axios from 'axios';

// backend api url for authenticating user
const API_URL = '/api/wishlistCards/';

function Wishlist() {

  // init navigation && find user
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { userId } = useParams();

  // initiate wishlist state
  const [wishlist, setWishlist] = useState([]);

  // request user's wishlist from server (re-request on wishlist change)
  useEffect(() => {
    //alert('using effect again, for some reason');
    const wishlistCards = async () => {
      
      const response = await axios.get(API_URL + userId);
  
      if (response.data) {
        setWishlist(response.data);
      }
    };

    wishlistCards();

  }, [userId]);

  //if not logged in, navigate out of Wishlist back to login
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // if no user, return spinner while waiting to be redirected to Login
  if (!user) {
    return <Spinner />
  }

  if (!wishlist) {
    return <Spinner />
  }
  
  return (
    <div>
      <h1>{user.name}'s Wishlist</h1>
      <Sidebar activeTab="Wishlist" />
      <CardTable cards={wishlist}/>
    </div>
  )
}

export default Wishlist