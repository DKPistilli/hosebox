import CollectionPage from '../components/CollectionPage';

// backend api url for authenticating user
const INVENTORY_API_URL = 'https://api.hosebox.net/api/inventoryCards';
const USER_API_URL      = 'https://api.hosebox.net/api/users';

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