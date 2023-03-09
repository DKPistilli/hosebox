import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Spinner from '../components/Spinner';
import Sidebar from '../components/Sidebar';

// import http request service
import axios from 'axios';

// backend api url for authenticating user
const API_URL = '/api/inventoryCards/';

function Inventory() {

  // init navigation && find user
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // initiate inventory state
  const [inventory, setInventory] = useState([]);

  // request user's inventory from server (re-request on inventory change)
  useEffect(() => {
    //alert('using effect again, for some reason');
    const inventoryCards = async () => {
      
      const response = await axios.get(API_URL + user._id);
  
      if (response.data) {
        setInventory(response.data);
      }
    };

    inventoryCards();

  }, [user]);

  //if not logged in, navigate out of Inventory back to login
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // if no user, return spinner while waiting to be redirected to Login
  if (!user) {
    return <Spinner />
  }

  if (!inventory) {
    return <Spinner />
  }
  

  return (
    <div>
      <h1>{user.name}'s Inventory</h1>
      <ul>
        {inventory.map(card =>
          (<li key={card._id}>
                {card.name}
          </li>)
        )}
      </ul>
      <Sidebar activeTab="Inventory" />
    </div>
  )
}

export default Inventory