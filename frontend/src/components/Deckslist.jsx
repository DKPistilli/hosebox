import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { BsPlusSquare } from "react-icons/bs";

import "../styles/Deckslist.css";
import "../styles/Sidebar.css";

const USER_API_URL = "https://api.hosebox.net/api/users";
const DECK_API_URL = "https://api.hosebox.net/api/decks";

function Deckslist(props) {
  const { user } = useSelector((state) => state.auth);
  const ownerId = props.ownerId;

  const navigate = useNavigate();
  const { deckId } = useParams();

  const [decksPublic, setDecksPublic] = useState([]);
  const [decksPrivate, setDecksPrivate] = useState([]);

  useEffect(() => {
    const getDecks = async () => {
      if (!ownerId) {
        return;
      }

      const privateAccess = user && ownerId === user._id;

      let apiUrl = "";
      let config = {};

      if (privateAccess) {
        apiUrl = USER_API_URL + "/me";
        config = {
          headers: { Authorization: `Bearer ${user.token}` },
        };
      } else {
        apiUrl = USER_API_URL + `/${ownerId}`;
      }

      const response = await axios.get(apiUrl, config);

      if (!response) {
        setDecksPublic([]);
        setDecksPrivate([]);
        return;
      }

      if (privateAccess) {
        setDecksPublic(response.data.decks_public);
        setDecksPrivate(response.data.decks_private);
      } else {
        setDecksPublic(response.data.decks_public);
        setDecksPrivate([]);
      }
    };

    getDecks();
  }, [ownerId, user]);

  const deckMapper = (deck) => (
    <div key={deck.deckId} className="deckslist-deck">
      <Link to={`/decks/${deck.deckId}`}>
        {deck.deckId === deckId ? (
          <div className="active-sidebar-tab">{deck.name}</div>
        ) : (
          <div>{deck.name}</div>
        )}
      </Link>
    </div>
  );

  const createNewDeck = async () => {
    const config = {
      headers: { Authorization: `Bearer ${user.token}` },
      params: { deckName: "Infinite Potential" },
    };

    const newDeck = await axios.post(DECK_API_URL, null, config);
    navigate(`/decks/${newDeck.data._id}`);
  };

  const privateAccess = user && ownerId === user._id;

  return (
    <div className="deckslist-container">
      <div className="decks-header">
        <div className="decks-header-inner">
          <h2 style={{ marginRight: "5px" }}>Decks</h2>

          {privateAccess ? (
            <BsPlusSquare
              size="12px"
              className="plus-icon"
              onClick={createNewDeck}
            />
          ) : (
            <></>
          )}
        </div>
      </div>
      { decksPublic.length > 0 ? <p style={{margin: '8px'}}><i>Public</i></p>  : <></>}
      { decksPublic.length > 0 && decksPublic.map(deckMapper)}
      {decksPrivate.length > 0 ? <p style={{margin: '8px'}}><i>Private</i></p> : <></>}
      {decksPrivate.length > 0 && decksPrivate.map(deckMapper)}
    </div>
  );
}

export default Deckslist;