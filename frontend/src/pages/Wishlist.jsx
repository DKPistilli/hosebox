import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar    from '../components/Sidebar';
import Spinner    from '../components/Spinner';
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
  const navigate = useNavigate();
  
  // find Wishlist's owner (can be diff than active user)
  useEffect(() => {
    const getOwner = async () => {
      if (user && (user._id === ownerId)) {
        setOwner(user);
      } else {
        let pageOwner = await axios.get(`${USER_API_URL}/${ownerId}`)
        if (!pageOwner) {
          navigate('/NoPage.jsx');
        } else {
          setOwner(pageOwner);
        }
      }
    }

    getOwner();
  }, [user, ownerId, navigate])

  if (!owner) {
    return <Spinner />
  }


  return (
    <div>
      <Sidebar activeTab="Wishlist" owner={owner} />
      { !owner ? "" :
        <div>
          <h3>{`${owner.name}'s Wishlist`}</h3>
          <Collection
            apiUrl={WISHLIST_API_URL}
            owner={owner}
            collectionName="Wishlist"
          />
        </div>
      }
    </div>
  )
}

export default Wishlist