import CollectionPage from '../components/CollectionPage';

// backend api url for authenticating user
const USER_API_URL      = process.env.REACT_APP_ENV === 'development' ? 'http://localhost:8000/api/users' : 'https://api.hosebox.net/api/users';
const INVENTORY_API_URL = process.env.REACT_APP_ENV === 'development' ? 'http://localhost:8000/api/inventoryCards' : 'https://api.hosebox.net/api/inventoryCards';

const Inventory = () => {

  return(
    <div>
      <CollectionPage
        collectionType="Inventory"
        collectionApiUrl={INVENTORY_API_URL}
        userApiUrl={USER_API_URL}
      />
    </div>
  );
};

export default Inventory