///
/// DECKSLIST COMPONENT (for the sidebar)
/// Gets decklist
import { useEffect, useState }   from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from 'axios';
import { BsPlusSquare } from 'react-icons/bs'

import '../styles/Deckslist.css';
import '../styles/Sidebar.css';

const USER_API_URL = '/api/users';
const DECK_API_URL = '/api/decks';

function Deckslist(props) {

    const { user } = useSelector((state) => state.auth);
    const ownerId  = props.ownerId;

    const navigate = useNavigate();
    const { deckId } = useParams(); // determine if we're on deck's page.

    const [decksPublic, setDecksPublic]   = useState([]);
    const [decksPrivate, setDecksPrivate] = useState([]);
    const [hasPrivateAccess, setHasPrivateAccess] = useState(false);
    

    useEffect(() => {

        const getDecks = async () => {

            // if no ownerId given in props, no decks to get!
            if (!ownerId) {
                return;
            }

            // determine if public or private decks
            if (user && (ownerId === user._id)) {
                setHasPrivateAccess(true);
            }

            let apiUrl = '';
            let config  = {};

            // determine GET url / config by private access
            if (hasPrivateAccess) {
                apiUrl = USER_API_URL + '/me'; 
                config  = {
                    headers: { Authorization: `Bearer ${user.token}` },
                };
            } else {
                apiUrl = USER_API_URL + `/${ownerId}`;
            };

            // get and set deckOwner
            const response = await axios.get(apiUrl, config);

            if (!response) {
                setDecksPublic([]);
                setDecksPrivate([]);
                return;
            }

            if (hasPrivateAccess) {
                setDecksPublic (response.data.decks_public);
                setDecksPrivate(response.data.decks_private);
            } else {
                setDecksPublic (response.data.decks_public);
                setDecksPrivate([]);
            }
        };

        getDecks();

    }, [ownerId, user, hasPrivateAccess]);

    // display deck name as link to deck page by deckId
    const deckMapper = (deck) =>
    (<div key={deck.deckId}>
        <Link to ={`/decks/${deck.deckId}`}>
            { deck.deckId === deckId ? 
                <div className="active-sidebar-tab">{deck.name}</div> :
                <div>{deck.name}</div>
            }
        </Link>
    </div>);

    // onclick function for newDeck button
    const createNewDeck = async () => {
        const config  = {
            headers: { Authorization: `Bearer ${user.token}` },
            params : { deckName: "New Potential" },
        };

        const newDeck = await axios.post(DECK_API_URL, null, config);
        navigate(`/decks/${newDeck.data._id}`);
    }

    return (
        <div className="deckslist-container">
            <div className="decks-header">
                <div className="decks-header-inner">
                    <h2 style={{marginRight: '5px'}}>Decks</h2>

                    { hasPrivateAccess ?
                        <BsPlusSquare
                            size='12px'
                            className="plus-icon"
                            onClick={createNewDeck}/> :
                        <></>
                    }
                </div>
            </div>
            {decksPublic.length  > 0 && decksPublic.map (deckMapper)}
            {decksPrivate.length > 0 && decksPrivate.map(deckMapper)}
        </div>
    )
}
export default Deckslist