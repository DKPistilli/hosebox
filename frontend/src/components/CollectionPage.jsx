/// COLLECTION PAGE COMPONENT
/// A container for a collection page that It grabs
/// ownerId from params, sends info to <Sidebar /> and <Collection /> components
///
/// props: collectionType === "Inventory" or "Wishlist" CASE SENSITIVE!!!!
///        collectionApiUrl && userApiUrl strings.

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar    from '../components/Sidebar';
import Spinner    from '../components/Spinner';
import Collection from '../components/Collection';

// import http request service
import axios from 'axios';

const CollectionPage = ({ collectionType, collectionApiUrl, userApiUrl }) => {

  // init navigation && find user
  const { user } = useSelector((state) => state.auth);
  const [ owner, setOwner ] = useState({})
  const { ownerId } = useParams();
  const navigate = useNavigate();
  
  // find collection's owner (can be diff than active user)
  useEffect(() => {

    const getOwner = async () => {
      if (user && (user._id === ownerId)) {
        setOwner(user);
      } else {
        let pageOwner = await axios.get(`${userApiUrl}/${ownerId}`);
        if (!pageOwner) {
          navigate('/NoPage.jsx');
        } else {
          setOwner(pageOwner);
        }
      }
    }
    
    getOwner();
  }, [user, ownerId, navigate, setOwner, userApiUrl])

  if (!owner || !ownerId) {
    return <Spinner />
  }

  return(
    <>
      {!owner ? "" :
        <div>
          <Sidebar
            activeTab={collectionType}
            owner={ owner }
          />
          <div>
            <h2>{owner.name}'s {collectionType}</h2>
            <br />
          </div>
          <div>
            <Collection 
              apiUrl={collectionApiUrl}
              owner={owner}
              collectionName={collectionType}
            />
          </div>
        </div>
      }
    </>
  );
};

export default CollectionPage