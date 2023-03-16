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
const API_URL = '/api/inventoryCards';

function Inventory() {

  // init navigation && find user
  const { user } = useSelector((state) => state.auth);
  const { ownerId } = useParams();

   // leave invent uninitialized for spinner (could also be [], with spinner checking for inventory.length)
  const [inventory, setInventory]     = useState();
  const [isOutOfDate, setIsOutOfDate] = useState(true);

  // request user's inventory from server (re-request if inventory isOutOfDate)
  useEffect(() => {
    
    const getInventory = async () => {
      const response = await axios.get(API_URL + "/" + ownerId);
  
      if (response.data) {
        setInventory(response.data);
      }
    };
    if (isOutOfDate) {
      getInventory();
      setIsOutOfDate(false)
    }
  }, [ownerId, isOutOfDate]);

  if (!inventory) {
    return <Spinner />
  } 

  return (
    <div>
      <h1>Inventory</h1>
      { (user) && (user._id === ownerId) ?
        <CollectionCardAdder
          apiUrl={API_URL}
          setIsParentOutOfDate={setIsOutOfDate}
        /> : 
        <></>
      } 
      <Sidebar activeTab="Inventory" />
      <CardTable cards={inventory}  />
    </div>
  )
}

export default Inventory