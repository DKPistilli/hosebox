/// COLLECTION COMPONENT
///
/// Fetches and displays collection of cards for users to view and
/// for owners to manipulate (can be inventory or wishlist
///
/// props required: apiUrl="url for CollectionCardReqs" owner={ownerObject}

import { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux';
import Spinner   from '../components/Spinner';
import CardTable from '../components/CardTable';
import CardAdder from '../components/CardAdder';
import CollectionPagination from './CollectionPagination';

// import http request service
import axios from 'axios';

// cards per page in Collection
const CARDS_PER_PAGE = 14;

function Collection({ apiUrl, owner }) {
    
    // init navigation && find user
    const { user } = useSelector((state) => state.auth);

    // default state (leave inventory uninitialized for spinner)
    const [inventory, setInventory]         = useState();
    const [inventorySize, setInventorySize] = useState(0);
    const [currentPage, setCurrentPage]     = useState(1);
    // eslint-disable-next-line
    const [cardName, setCardName]           = useState("");

    const getInventory = useCallback( async (page, name) => {
        
        // query server for 
        const response = await axios.get(apiUrl + "/" + owner._id, {
            params: {
                page : currentPage,
                name : cardName,
                limit: CARDS_PER_PAGE,
            }
        });

        // set card inventory and pagination
        if (response.data) {
            setInventory(response.data.cards);
            setInventorySize(response.data.totalCards)
        }

    }, [apiUrl, owner, currentPage, cardName]);

    // request user's inventory from server
    useEffect(() => {
        getInventory(currentPage, cardName);
    }, [getInventory, currentPage, cardName]);

    if (!inventory) {
        return <Spinner />
    }

    return (
        <div>
            { (user) && (user._id === owner._id) ?
            <CardAdder
                apiUrl={apiUrl}
                updateParent={getInventory} /> 
            : <></> }
            <CollectionPagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalCards={inventorySize}
                cardsPerPage={CARDS_PER_PAGE}
            />
            <CardTable cards={inventory}  />
        </div>
    )
}

export default Collection