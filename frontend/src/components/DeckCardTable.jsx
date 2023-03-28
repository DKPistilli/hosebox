import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

import '../styles/CardTable.css';

import { CTable, CTableHead, CTableBody, CTableRow,
         CTableHeaderCell, CTableDataCell, CTableCaption } from '@coreui/react'

import QuantityForm  from './QuantityForm'
import ManaSymbols   from './ManaSymbols';
import RaritySymbols from './RaritySymbols';
import Card          from './Card';
import Spinner       from './Spinner';

const DECK_API_URL = 'http://3.135.246.186/api/decks';

function DeckCardTable({ cards, tableName }) {

    const { deckId } = useParams();
    const { user }   = useSelector((state) => state.auth);

    const [tableCards, setTableCards] = useState([]);

    // initiate state to keep track of # cards  in array
    const [totalCards, setTotalCards]   = useState(0);
    const [totalByType, setTotalByType] = useState({
        creatures    : 0, instants     : 0,
        sorceries    : 0, artifacts    : 0,
        enchantments : 0, planeswalkers: 0,
        lands        : 0, unmatched    : 0,
    })

    // initiate state variable of sorted card arrays
    const [sortedByType, setSortedByType] = useState({
        creatures    : [], instants     : [],
        sorceries    : [], artifacts    : [],
        enchantments : [], planeswalkers: [],
        lands        : [], unmatched    : [],
    })

    useEffect(() => {
        setTableCards(cards);
    }, [cards]);

    // define function to sort input cards by type for table display
    const sortCardsByType = useCallback(() => {

        const cardTypes = {
            creatures    : 'creature',    instants     : 'instant',
            sorceries    : 'sorcery',     artifacts    : 'artifact',
            enchantments : 'enchantment', planeswalkers: 'planeswalker',
            lands        : 'land',        unmatched    : 'sdadsfasdfasdf',
        }

        let sortedCards = {
            creatures    : [], instants     : [],
            sorceries    : [], artifacts    : [],
            enchantments : [], planeswalkers: [],
            lands        : [], unmatched    : [],
        };

        let totalInTable = 0;
        let totals = {
            creatures    : 0, instants     : 0,
            sorceries    : 0, artifacts    : 0,
            enchantments : 0, planeswalkers: 0,
            lands        : 0, unmatched    : 0,
        };

        // for each card, match it up to each cardtype,
        // and add to correct sorted Array in state
        tableCards.forEach((card) => {
            
            let matched = false;

            for (const cardType in cardTypes) {
                if (card.type_line.toLowerCase().includes(cardTypes[cardType])) {
                    // if matched, add card to sorted array
                    sortedCards[cardType].push(card);

                    //update quantities (both total table + by type)
                    totals[cardType] += card.quantity;
                    totalInTable     += card.quantity;

                    matched = true;
                    break;
                }
            }

            // if card doesn't belong to categories (somehow...)
            if (!matched) {
                sortedCards.unmatched.push(card);
                totals.unmatched++;
            }
        })

        // update state with sorted cards and totals
        setSortedByType(sortedCards);
        setTotalByType(totals);
        setTotalCards(totalInTable)

    }, [tableCards]);

    // sort cards when mounted / cards are updated
    useEffect(() => {
        if (tableCards) {
            sortCardsByType();
        }
    }, [tableCards, sortCardsByType]);
    
    if (!tableCards) {
        return (<Spinner />) ;
    }

    // kind of hacky way of re-getting inventory after updating quantity
    // note, this fx is passed to <QuantityForm /> component
    const updateCardQuantity = async (quantity, cardName) => {

        const config = {
            headers: { Authorization: `Bearer ${user.token}`},
            params : {
                listType: tableName.toLowerCase(),
                cardName: cardName,
                quantity: quantity,
            }
        };
        
        // update card quantity
        const res = await axios.put(`${DECK_API_URL}/${deckId}`, null, config);
        setTableCards(res.data);
    }

    // tablify a card
    const renderCard = (card) => {
        return(
            <CTableRow key={`card${card.cardId}`}>
                <QuantityForm className='quantity-col' quantity={card.quantity} cardName={card.name} card={card} handleSubmit={updateCardQuantity} />
                <CTableDataCell className='name'      key={`name${card.cardId}`}>
                    {<Card cardName={card.name} imageUrl={card.image_uris.normal} uri={card.related_uris.gatherer} />}
                </CTableDataCell>
                <CTableDataCell className='type_line' key={`type${card.cardId}`}>
                    {card.type_line}
                </CTableDataCell>
                <CTableDataCell className='mana_cost' key={`cost${card.cardId}`}>
                    <ManaSymbols manaString={card.mana_cost}  />
                </CTableDataCell>
                <CTableDataCell className='rarity'    key={`rare${card.cardId}`}>
                    <RaritySymbols rarityString={card.rarity} />
                </CTableDataCell>
                <CTableDataCell className='price'     key={`pric${card.cardId}`}>
                    ${card.prices.usd}
                </CTableDataCell>
            </CTableRow>
        )
    };

    // helper fx for displaying #of Creatures/Insts/Sorceries/etc. in list
    const minTwoDigits = (n) => {
        return (n < 10 ? '0' : '') + n;
    }

    // tablify a category of cards -- null if category is empty
    const renderCategory = (category, categoryName) => {
        if (totalByType[category] > 0) {
            return (
                <>
                    <CTableRow key={categoryName} className="headerRow">
                        <CTableDataCell colSpan="6" style={{paddingLeft: "7px"}}>
                            {`${categoryName} (${minTwoDigits(totalByType[category])})`}
                        </CTableDataCell>
                    </CTableRow>
                    {sortedByType[category].map(renderCard)}
              </>
            )
        } else {
            return null;
        }
    };

    // return the table!
    return (
        <CTable bordered className='ctable' style={{padding: '4px'}}>
            <CTableCaption className="caption-left">{`${tableName} (${totalCards} cards)`}</CTableCaption>
            <CTableHead>
                <CTableRow>
                    <CTableHeaderCell scope="col" className="quantity-col">#</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Type</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Cost</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Rarity</CTableHeaderCell>
                    <CTableHeaderCell scope="col">$</CTableHeaderCell>
                </CTableRow>
            </CTableHead>
            <CTableBody>
                {renderCategory("creatures", "Creatures")}
                {renderCategory("instants", "Instants")}
                {renderCategory("sorceries", "Sorceries")}
                {renderCategory("artifacts", "Artifacts")}
                {renderCategory("enchantments", "Enchantments")}
                {renderCategory("planeswalkers", "Planeswalkers")}
                {renderCategory("lands", "Lands")}
                {renderCategory("unmatched", "Miscellaneous")}
            </CTableBody>
        </CTable>
    );
}

export default DeckCardTable