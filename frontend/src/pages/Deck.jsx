import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Sidebar    from '../components/Sidebar';
import Spinner    from '../components/Spinner';
import CardTable  from '../components/CardTable';
import CardAdder  from '../components/CardAdder';
import DeckTitle  from '../components/DeckTitle';
import DeleteDeck from '../components/DeleteDeck';

// import http request service
import axios from 'axios';

// backend api url for authenticating user
const DECK_API_URL = 'http://3.135.246.186/api/decks';
const USER_API_URL = 'http://3.135.246.186/api/users';

function Deck() {

  // init navigation && find user
  const { user }   = useSelector((state) => state.auth);
  const { deckId } = useParams();

  const [ owner, setOwner ] = useState({})
  const [ deck, setDeck ]   = useState({});

  const [ mainboard, setMainboard ]   = useState([])
  const [ sideboard, setSideboard ]   = useState([])
  const [ scratchpad, setScratchpad ] = useState([])

  const [ loadingDeck, setLoadingDeck] = useState(true);

  const navigate = useNavigate();

  // get Deck from DB
  const getDeck = useCallback( async () => {

    setLoadingDeck(true);

    let response = await axios.get(`${DECK_API_URL}/${deckId}`);

    if (!response.data) {
      navigate('/NoPage.jsx');
    } else {
      setDeck(response.data);
      setMainboard(response.data.mainboard);
      setSideboard(response.data.sideboard);
      setScratchpad(response.data.scratchpad);
    }

    setLoadingDeck(false);

  }, [deckId, navigate])

  useEffect(() => {
    getDeck();
  }, [getDeck])

  useEffect(() => {

    const getOwner = async () => {

      // can't get owner if there's no deckOwnerId!
      if (!deck.userId) {
        return;
      }

      if (user && deck && (user._id === deck.userId)) {
        setOwner(user);
      } else {
        let pageOwner = await axios.get(`${USER_API_URL}/${deck.userId}`);
        setOwner(pageOwner);
      }
    }

    getOwner();

  }, [deck, user])

  // onSubmit fx for adding card of cardName to deck
  const addCardToDeck = async ( cardName, listType ) => {
    if (!cardName || !deckId || !user) {
      return;
    } else {
      const alreadyInDeckIndex = deck[listType].findIndex(card => (card.name === cardName));
      if (alreadyInDeckIndex !== -1) {
        toast.error(`${cardName} is already in your ${listType}, Planeswalker...`);
        return;
      }

      // @query  listType=(listtype)&cardName=(cardName)&quantity=(quantity to set)
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
        params : { 
          cardName: cardName,
          listType: listType,
          quantity: 1,
        },
      };

      const res = await axios.put(`${DECK_API_URL}/${deckId}`, null, config);

      if (listType === 'mainboard') {
        setMainboard(res.data);
      } else if (listType === 'sideboard') {
        setSideboard(res.data);
      } else if (listType === 'scratchpad') {
        setScratchpad(res.data);
      } else {
        throw new Error(`Incorrect listtype given: ${listType}`);
      }
    }
  }

  // onSubmit fx for updating the deck's title
  const updateDeckTitle = async (newName) => {
    if (!newName || !deckId || !user) {
      return;
    } else {

      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
        params : { deckName: newName },
      };

      await axios.put(`${DECK_API_URL}/${deckId}/name`, null, config);
      navigate(0);
    }
  };

  const deleteDeck = async () => {
    if (!deck || !deckId || !user) {
      return;
    } else {
      const config = {
        headers: { Authorization: `Bearer ${user.token}`},
      };
      
      await axios.delete(`${DECK_API_URL}/${deckId}`, config);
    }
  }

  if (!deck || loadingDeck ) {
    return <Spinner />
  }

  return (
    <>
      { !owner ? "" :
        <div className='deck-page'>
          <div className='sidebar'>
            <Sidebar activeTab="" owner={ owner } />
          </div>
          <div className='deck-header'>
            <DeckTitle
              deckTitle={deck.name}
              deckId={deckId}
              isPublic={deck.isPublic}
              updateTitle={updateDeckTitle}
            />
          </div>
          <br />
          <div className='card-adder'>
          { (user) && (user._id === owner._id) ?
            <CardAdder
                addCard={addCardToDeck}
                isDeck={true}
            />
            : <></> }
          </div>
          <div className='deck-table-main'>
            {mainboard && (
              <CardTable cards={mainboard}
                        tableName={"Mainboard"}
                        key={`mainboard-${deckId}`}
                        tableStyle={"deck"} />
            )}
          </div>
          <br />
          <div className='deck-table-side'>
            {sideboard && (
              <CardTable cards={sideboard}
                        tableName={"Sideboard"}
                        key={`sideboard-${deckId}`}
                        tableStyle={"deck"} />
            )}
          </div>
          <br />
          <div className='deck-table-scratch'>
            {scratchpad && (
              <CardTable cards={scratchpad}
                        tableName={"Scratchpad"}
                        key={`scratchpad-${deckId}`}
                        tableStyle={"deck"} />
            )}
          </div>
          <div>
            <DeleteDeck deleteDeck={deleteDeck}/>
          </div>
        </div>
      }
    </>
  );
}

export default Deck