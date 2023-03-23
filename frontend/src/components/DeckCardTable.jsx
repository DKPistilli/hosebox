import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

import './CardTable.css';

import { CTable, CTableHead, CTableBody, CTableRow,
         CTableHeaderCell, CTableDataCell, CTableCaption } from '@coreui/react'

import QuantityForm  from './QuantityForm'
import ManaSymbols   from './ManaSymbols';
import RaritySymbols from './RaritySymbols';
import Card          from './Card';
import Spinner       from './Spinner';

import './CardTable.css';

const DECK_API_URL = '/api/decks';

function DeckCardTable({ cards, tableName }) {

    const { deckId } = useParams();
    const { user }   = useSelector((state) => state.auth);

    const [totalCards, setTotalCards] = useState(0);

    // initiate state variable of sorted card arrays
    const [sortedByType, setSortedByType] = useState({
        creatures    : [], instants     : [],
        sorceries    : [], artifacts    : [],
        enchantments : [], planeswalkers: [],
        lands        : [], unmatched    : [],
    })

    // define function to sort input cards by type for table display
    const sortCardsByType = useCallback(() => {

        setTotalCards(0);

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

        // for each card, match it up to each cardtype,
        // and add to correct sorted Array in state
        cards.forEach((card) => {

            let matched = false;
            setTotalCards((count) => count + card.quantity);

            for (const cardType in cardTypes) {
                if (card.type_line.toLowerCase().includes(cardTypes[cardType])) {
                    sortedCards[cardType].push(card);
                    matched = true;
                    break;
                }
            }

            // if card doesn't belong to categories (somehow...)
            if (!matched) {
                sortedCards.unmatched.push(card);
            }

            setSortedByType(sortedCards);
        }

    )}, [cards]);

    // sort cards when mounted / cards are updated
    useEffect(() => {
        if (cards) {
            sortCardsByType();
        }
    }, [cards, sortCardsByType]);
    
    if (!cards) {
        return (<Spinner />) ;
    }

    // kind of hacky way of re-getting inventory after updating quantity
    // note, this fx is passed to <QuantityForm /> component
    const updateCardQuantity = async (quantity, cardName) => {

        const config = {
            headers: { Authorization: `Bearer ${user.token}`},
            params : {
                listType: tableName.toLowerCase(),
                name: cardName,
                quantity: quantity,
            }
        };
        
        // update card quantity
        await axios.put(`${DECK_API_URL}/${deckId}`, null, config)

        // reload page to refresh inventory w/ new quant
        window.location.reload();
    }

    // tablify a card
    const renderCard = (card) => {
        return(
            <CTableRow key={`card${card.cardId}`}>
                <QuantityForm className='quantity-col' quantity={card.quantity} cardName={card.name} handleSubmit={updateCardQuantity} />
                <CTableDataCell className='name'      key={`name${card.cardId}`}>
                    {<Card name={card.name} imageUrl={card.image_uris.normal} uri={card.related_uris.gatherer} />}
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

    // tablify a category of cards -- null if category is empty
    const renderCategory = (category, categoryName) => {
        if (sortedByType[category].length > 0) {
            return (
                <>
                <CTableRow key={categoryName} className="headerRow">
                  <CTableDataCell colSpan="6">{categoryName}</CTableDataCell>
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
        <CTable bordered className='ctable'>
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