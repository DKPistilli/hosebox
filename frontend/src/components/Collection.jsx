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

function Collection({ apiUrl, owner, collectionName, collectionId }) {
    
    // init navigation && find user
    const { user } = useSelector((state) => state.auth);

    // default state (leave collection uninitialized for spinner)
    const [collection, setCollection]             = useState();
    const [totalUniqueCards, setTotalUniqueCards] = useState(0);
    const [collectionSize, setCollectionSize]     = useState(0);
    const [currentPage, setCurrentPage]           = useState(1);
    
    // eslint-disable-next-line
    const [cardName, setCardName] = useState("");

    const getCollection = useCallback( async () => {

        setCollection(null)
        setCollectionSize(0);

        // if there's no owner, then there's no collection to get yet!
        if (!owner || !owner._id) {
            return;
        }

        const response = await axios.get(`${apiUrl}/${collectionId}`, {
            params: {
                page : currentPage,
                cardName : cardName,
                limit: CARDS_PER_PAGE,
            }
        });

        // if no response, error, else get Collection Size
        if (!response) {
            toast.error('Error getting collection from server.');
        } else {
            const sizeResponse = await axios.get(`${apiUrl}/${collectionId}/size`);
            // set card collection and pagination
            if (sizeResponse.data) {
                setCollectionSize(parseInt(sizeResponse.data.mainboardSize));
            }
        }

        // set card collection and pagination
        if (response.data) {
            setCollection(response.data.cards);
            setTotalUniqueCards(response.data.totalUniqueCards)
        }

    }, [apiUrl, owner, currentPage, cardName, collectionId]);

    // request user's collection from server
    useEffect(() => {
        getCollection();
    }, [getCollection]);

    // define how CardAdder should addCards
    const addCard = async (cardName) => {
        if (!collectionId) {
            toast.error('Collection ID missing. Unable to add cards.');
            return;
        }

        const config = {
            headers: {
                "Authorization": `Bearer ${user.token}`,
                "Content-Type" : "text/plain",
            },
        };

        await axios.post(`${apiUrl}/${collectionId}`, `1 ${cardName}`, config)
            .then( res => getCollection() )
            .catch( err => {
                toast.error(`${cardName} is not in hosebox yet (this is likely a spoiler/unreleased card.)`);
            });
    };

    // define how CardAdderContainer should add Cardlists
    const addCardlist = async (cardlist) => {
       
        if (!collectionId) {
            toast.error('Collection ID missing. Unable to add cards.');
            return;
        }
       
        const config = {
            headers: {
                "Authorization": `Bearer ${user.token}`,
                "Content-Type" : "text/plain",
            },
        };

        // add cards then get new collection -- if server sends back message of cards not added, toast error.
        await axios.post(`${apiUrl}/${collectionId}`, cardlist, config)
            .then ( res => {
                if (!res.data) {
                    toast.success("Cards added correctly!");
                } else {
                    toast.error(res.data);
                }
                getCollection()
            }).catch( err => {
                toast.error(err.response.data.message);
                getCollection();
            });
    };

    const deleteCollection = async () => {        
        if (!collection || !user || !user._id) {
            return;
        } else {
            const config = {
                headers: { Authorization: `Bearer ${user.token}`},
            };
            await axios.delete(`${apiUrl}${collectionId}`, config)
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
                       collectionId={collectionId}
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