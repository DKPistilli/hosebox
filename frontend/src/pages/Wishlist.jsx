import CollectionPage from '../components/CollectionPage';

// backend api url for authenticating user
const WISHLIST_API_URL = '/api/wishlistCards';
const USER_API_URL      = '/api/users';

function Wishlist() {

  return(
    <div>
      <CollectionPage
        collectionType="Wishlist"
        collectionApiUrl={WISHLIST_API_URL}
        userApiUrl={USER_API_URL}
      />
    </div>
  );
};

export default Wishlist