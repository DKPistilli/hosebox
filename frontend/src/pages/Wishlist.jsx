import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar   from '../components/Sidebar';
import Collection from '../components/Collection';

// import http request service
import axios from 'axios';

// backend api url for authenticating user
const WISHLIST_API_URL = '/api/wishlistCards';
const USER_API_URL      = '/api/users';

function Wishlist() {

  // init navigation && find user
  const { user } = useSelector((state) => state.auth);
  const { ownerId } = useParams();
  const [ owner, setOwner ] = useState({})
  
  // find Wishlist's owner (can be diff than active user)
  useEffect(() => {
    const getOwner = async () => {
      if (user && (user._id === ownerId)) {
        setOwner(user);
      } else {
        let pageOwner = await axios.get(`${USER_API_URL}/${ownerId}`)
        setOwner(pageOwner);
      }
    }

    getOwner();
  }, [user, ownerId])


  return (
    <div>
      <Sidebar activeTab="Wishlist" />
      <h3>{ owner ? owner.name + "'s Wishlist" : "" }</h3>
      <Collection
        apiUrl={WISHLIST_API_URL}
        owner={owner}
      />
    </div>
  )
}

export default Wishlist