import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Spinner   from '../components/Spinner';
import Sidebar   from '../components/Sidebar';
import CardTable from '../components/CardTable';
import CollectionCardAdder from '../components/CollectionCardAdder';

// import http request service
import axios from 'axios';

// backend api url for authenticating user
const API_URL = '/api/wishlistCards/';

function Wishlist() {

  // init navigation && find user
  const { user } = useSelector((state) => state.auth);
  const { ownerId } = useParams();

  // initiate wishlist state
  const [wishlist, setWishlist] = useState();

  // request user's wishlist from server (re-request on wishlist change)
  useEffect(() => {
    //alert('using effect again, for some reason');
    const wishlistCards = async () => {
      
      const response = await axios.get(API_URL + ownerId);
  
      if (response.data) {
        setWishlist(response.data);
      }
    };

    wishlistCards();

  }, [ownerId]);

  if (!wishlist) {
    return <Spinner />
  }
  
  return (
    <div>
      <h1>Wishlist</h1>
      { (user) && (user._id === ownerId) ? <CollectionCardAdder apiUrl={API_URL} /> : <></> }  
      <Sidebar activeTab="Wishlist" />
      <CardTable cards={wishlist}/>
    </div>
  )
}

export default Wishlist