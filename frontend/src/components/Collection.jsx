/// COLLECTION COMPONENT
///
/// Fetches and displays collection of cards for users to view and
/// for owners to manipulate (can be inventory or wishlist)
///
/// props required: apiUrl="url for CollectionCardReqs" owner={ownerObject}

import { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify'

// import http request service
import axios from 'axios';

import '../styles/Collection.css';
import CardAdderContainer from './CardAdderContainer';
import DeleteCollectionButton from './DeleteCollectionButton';
import CardTable from './CardTable';
import CollectionPagination from './CollectionPagination';

// cards per page in Collection
const CARDS_PER_PAGE = 16;

function Collection({ apiUrl, owner, collectionName }) {
    
    // init navigation && find user
    const { user } = useSelector((state) => state.auth);

    // default state (leave collection uninitialized for spinner)
    const [collection, setCollection]             = useState();
    const [totalUniqueCards, setTotalUniqueCards] = useState(0);
    const [collectionSize, setCollectionSize]     = useState(0);
    const [currentPage, setCurrentPage]           = useState(1);
    
    // eslint-disable-next-line
    const [cardName, setCardName] = useState("");

    const getCollectionSize = useCallback( async () => {

        setCollectionSize(0);

        // if there's no owner, then there's no collection to get yet!
        if (!owner || !owner._id) {
            return;
        }
        
        // query server for 
        const response = await axios.get(apiUrl + "/" + owner._id + '/size');

        // set card collection and pagination
        if (response.data) {
            setCollectionSize(parseInt(response.data));
        }

    }, [apiUrl, owner ]);

    const getCollection = useCallback( async () => {

        setCollection(null)

        // if there's no owner, then there's no collection to get yet!
        if (!owner || !owner._id) {
            return;
        }
        
        // query server for 
        const response = await axios.get(apiUrl + "/" + owner._id, {
            params: {
                page : currentPage,
                cardName : cardName,
                limit: CARDS_PER_PAGE,
            }
        });

        // set card collection and pagination
        if (response.data) {
            setCollection(response.data.cards);
            setTotalUniqueCards(response.data.totalUniqueCards)
            getCollectionSize();
        }

    }, [getCollectionSize, apiUrl, owner, currentPage, cardName]);

    // request user's collection from server
    useEffect(() => {
        getCollection();
    }, [getCollection, getCollectionSize, currentPage, cardName]);

    // define how CardAdder should addCards
    const addCard = async (cardName) => {
        const config = {
            headers: { Authorization: `Bearer ${user.token}` },
            params : { cardName: cardName },
        };

        await axios.post(apiUrl, null, config)
            .then( res => getCollection() )
            .catch( err => {
                console.log(err);
                toast.error(`${cardName} is not in hosebox yet (this is likely a spoiler/unreleased card.)`);
            });
    };

    // define how CardAdderContainer should add Cardlists
    const addCardlist = async (cardlist) => {
        const config = {
            headers: {
                "Authorization": `Bearer ${user.token}`,
                "Content-Type" : "text/plain",
            },
        };

        await axios.post(apiUrl + '/list', cardlist, config)
            .then ( res => getCollection() )
            .catch( err => {
                toast.error(err.response.data.message);
                getCollection();
            });
    };

    const deleteCollection = async () => {

        console.log('inside delete Collection');
        
        if (!collection || !user || !user._id) {
            console.log('inside empty return');
            return;
        } else {
            console.log('inside actionable return');
            const config = {
                headers: { Authorization: `Bearer ${user.token}`},
            };
            console.log(`apiUrl: ${apiUrl}`)
            await axios.delete(apiUrl, config)
                .then ( res => getCollection() )
                .catch( err => {
                    toast.error(err.message);
                });
        }
    }

    return (
        <div>
            { (user) && (user._id === owner._id) ?
            <CardAdderContainer
                addCard={addCard}
                addCardlist={addCardlist}
                isDeck={false}
            />
            : <></> }
            <div className='collection-pagination'>
                <CollectionPagination
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalUniqueCards={totalUniqueCards}
                    cardsPerPage={CARDS_PER_PAGE}
                />
            </div>
            <CardTable cards={collection}
                       tableName={collectionName}
                       tableStyle="collection"
                       collectionSize={collectionSize}
                       getCollection={getCollection}
            />
            <div>
                {
                    (user) && (user._id === owner._id) ?
                    <DeleteCollectionButton deleteCollection={deleteCollection} /> :
                    <></>
                }
            </div>
        </div>
    )
}

export default Collection