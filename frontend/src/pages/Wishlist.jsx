import CollectionPage from '../components/CollectionPage';

// backend api url for authenticating user
const USER_API_URL     = process.env.REACT_APP_ENV === 'development' ? 'http://localhost:8000/api/users' : 'https://api.hosebox.net/api/users';
const WISHLIST_API_URL = process.env.REACT_APP_ENV === 'development' ? 'http://localhost:8000/api/wishlistCards' : 'https://api.hosebox.net/api/wishlistCards';

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