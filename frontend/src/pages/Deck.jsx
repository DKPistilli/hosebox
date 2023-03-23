import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar    from '../components/Sidebar';
import Spinner    from '../components/Spinner';
import CardTable  from '../components/CardTable';
import CardAdder  from '../components/CardAdder';

// import http request service
import axios from 'axios';

// backend api url for authenticating user
const DECK_API_URL = '/api/decks';
const USER_API_URL = '/api/users';

function Deck() {

  // init navigation && find user
  const { user }   = useSelector((state) => state.auth);
  const { deckId } = useParams();

  const [ owner, setOwner ] = useState({})
  const [ deck, setDeck ]   = useState({});

  const navigate = useNavigate();

  // get Deck from DB
  const getDeck = useCallback( async () => {
    let response = await axios.get(`${DECK_API_URL}/${deckId}`);
    if (!response.data) {
      navigate('/NoPage.jsx');
    } else {
      setDeck(response.data);
    }
  }, [deckId, navigate])

  useEffect(() => {
    getDeck();
  }, [getDeck])

  useEffect(() => {

    const getOwner = async () => {

      if (user && deck && (user._id === deck.userId)) {
        setOwner(user);
      } else {
        let pageOwner = await axios.get(`${USER_API_URL}/${deck.userId}`);
        setOwner(pageOwner);
      }
    }

    getOwner();

  }, [deck, user])

  if (!deck) {
    return <Spinner />
  }

  return (
    <div>
      { !owner ? "" :
        <div>
          <div>
            <Sidebar activeTab="" owner={ owner } />
          </div>
          <div>
            <h3>{ !deck ? "" : deck.name }</h3>
          </div>
          <br />
          <div>
          <CardAdder apiUrl={DECK_API_URL} updateParent={getDeck} />
          <CardTable cards={deck.mainboard}
                     tableName={"Mainboard"}
                    tableStyle={"deck"} />
          </div>
          <br />
          <div>
            <CardTable cards={deck.sideboard}
                       tableName={"Sideboard"}
                       tableStyle={"deck"} />
          </div>
          <br />
          <div>
            <CardTable cards={deck.scratchpad}
                       tableName={"Scratchpad"}
                       tableStyle={"deck"} />
          </div>
        </div>
      }
    </div>
  )
}

export default Deck