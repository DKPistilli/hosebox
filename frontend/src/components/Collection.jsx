import { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux';
import Spinner   from '../components/Spinner';
import Sidebar   from '../components/Sidebar';
import CardTable from '../components/CardTable';
import CardAdder from '../components/CardAdder';

// import http request service
import axios from 'axios';

// backend api url for authenticating user

function Collection(props) {

    
    // init navigation && find user
    const { apiUrl, owner } = props;
    const { user } = useSelector((state) => state.auth);

    // leave invent uninitialized for spinner
    const [inventory, setInventory] = useState();

    const refreshInventory = useCallback( async () => {
        const response = await axios.get(apiUrl + "/" + owner._id);

        if (response.data) {
            setInventory(response.data);
        }
    }, [apiUrl, owner]);

    // request user's inventory from server
    useEffect(() => {
        refreshInventory();
    }, [refreshInventory]);

    if (!inventory) {
        return <Spinner />
    } 

    return (
        <div>
            { (user) && (user._id === owner._id) ?
            <CardAdder
                apiUrl={apiUrl}
                updateParent={refreshInventory} /> 
            : <></> }
            <Sidebar activeTab="Inventory" />
            <CardTable cards={inventory}  />
        </div>
    )
}

export default Collection