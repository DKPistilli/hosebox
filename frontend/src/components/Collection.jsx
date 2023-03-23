/// COLLECTION COMPONENT
///
/// Fetches and displays collection of cards for users to view and
/// for owners to manipulate (can be inventory or wishlist)
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

function Collection({ apiUrl, owner, collectionName }) {
    
    // init navigation && find user
    const { user } = useSelector((state) => state.auth);

    // default state (leave collection uninitialized for spinner)
    const [collection, setCollection]         = useState();
    const [collectionSize, setCollectionSize] = useState(0);
    const [currentPage, setCurrentPage]     = useState(1);
    // eslint-disable-next-line
    const [cardName, setCardName]           = useState("");

    const getCollection = useCallback( async () => {
        
        // query server for 
        const response = await axios.get(apiUrl + "/" + owner._id, {
            params: {
                page : currentPage,
                name : cardName,
                limit: CARDS_PER_PAGE,
            }
        });

        // set card collection and pagination
        if (response.data) {
            setCollection(response.data.cards);
            setCollectionSize(response.data.totalCards)
        }

    }, [apiUrl, owner, currentPage, cardName]);

    // request user's collection from server
    useEffect(() => {
        getCollection(currentPage, cardName);
    }, [getCollection, currentPage, cardName]);

    if (!collection) {
        return <Spinner />
    }

    return (
        <div>
            { (user) && (user._id === owner._id) ?
            <CardAdder
                apiUrl={apiUrl}
                updateParent={getCollection} /> 
            : <></> }
            <CollectionPagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalCards={collectionSize}
                cardsPerPage={CARDS_PER_PAGE}
            />
            <CardTable cards={collection} tableName={collectionName} tableStyle="collection" />
        </div>
    )
}

export default Collection