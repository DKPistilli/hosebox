///
/// DECKSLIST COMPONENT (for the sidebar)
/// Gets decklist
import { useEffect, useState }   from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from 'axios';

const API_URL = '/api/users';

function Deckslist(props) {

    const { user } = useSelector((state) => state.auth);
    const ownerId  = props.ownerId;

    const [decksPublic, setDecksPublic]   = useState([]);
    const [decksPrivate, setDecksPrivate] = useState([]);

    useEffect(() => {

        const getDecks = async () => {

            // determine if public or private decks
            
            const hasPrivateAccess = (user && (ownerId === user._id)) ? true : false;

            let apiUrl = '';
            let config  = {};

            // determine GET url / config by private access
            if (hasPrivateAccess) {
                apiUrl = API_URL + '/me'; 
                config  = {
                    headers: { Authorization: `Bearer ${user.token}` },
                };
            } else {
                apiUrl = API_URL + `/${ownerId}`;
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


    }, [ownerId, user]);

    // display deck name as link to deck page by deckId
    const deckMapper = (deck) =>
    (<div key={deck.deckId}>
        <Link to ={`/decks/${deck.deckId}`}>
            {deck.name}
        </Link>
    </div>);

    return (
        <div>
            {decksPublic.length  > 0 && decksPublic.map (deckMapper)}
            {decksPrivate.length > 0 && decksPrivate.map(deckMapper)}
        </div>
        
    )
}
export default Deckslist