import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar    from '../components/Sidebar';
import Spinner    from '../components/Spinner';
import Collection from '../components/Collection';

// import http request service
import axios from 'axios';

// backend api url for authenticating user
const INVENTORY_API_URL = '/api/inventoryCards';
const USER_API_URL      = '/api/users';

const Inventory = () => {

  // init navigation && find user
  const { user } = useSelector((state) => state.auth);
  const [ owner, setOwner ] = useState({})
  const { ownerId } = useParams();
  const navigate = useNavigate();
  
  // find inventory's owner (can be diff than active user)
  useEffect(() => {

    const getOwner = async () => {
      if (user && (user._id === ownerId)) {
        setOwner(user);
      } else {
        let pageOwner = await axios.get(`${USER_API_URL}/${ownerId}`);
        if (!pageOwner) {
          navigate('/NoPage.jsx');
        } else {
          setOwner(pageOwner);
        }
      }
    }
    
    getOwner();
  }, [user, ownerId, navigate, setOwner])

  if (!owner || !ownerId) {
    return <Spinner />
  }

  return(
    <div>
      {!owner ? "" :
      <div>
        <Sidebar
          activeTab="Inventory"
          owner={ owner }
        />
        <div>
          {owner.name}'s Inventory
        </div>
        <Collection 
          apiUrl={INVENTORY_API_URL}
          owner={owner}
          collectionName="Inventory"
        />
      </div>
      }
    </div>
  );
};

export default Inventory