import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

import { CTable, CTableHead, CTableBody, CTableRow, CTableHeaderCell, CTableDataCell } from '@coreui/react'
import ManaSymbols   from './ManaSymbols';
import RaritySymbols from './RaritySymbols';
import Card          from './Card';
import Spinner       from './Spinner';
import QuantityForm from './QuantityForm';

import '../styles/CardTable.css';

function CollectionCardTable({ cards, tableName }) {

    const { ownerId } = useParams();
    const { user }    = useSelector((state) => state.auth);
    
    if (!cards) {
        return (<Spinner />) ;
    }

    // kind of hacky way of re-getting inventory after updating quantity
    // note, this fx is passed to <QuantityForm /> component
    const updateCardQuantity = async (quantity, cardName) => {

        // current user must be owner in order to update collection
        if (!user || !ownerId || (user._id !== ownerId)) {
            return;
        }

        const collectionRoute = tableName.toLowerCase();

        const config = {
            headers: { Authorization: `Bearer ${user.token}`},
            params : {
                name: cardName,
                quantity: quantity,
            }
        };
        
        // update card quantity
        await axios.put(`/api/${collectionRoute}Cards`, null, config)

        // reload page to refresh inventory w/ new quant
        window.location.reload();
    }
    
    return (
        <CTable bordered className='ctable' >
            <CTableHead>
                <CTableRow>
                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Type</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Cost</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Rarity</CTableHeaderCell>
                    <CTableHeaderCell scope="col">$</CTableHeaderCell>
                </CTableRow>
            </CTableHead>
            <CTableBody>
                {cards.map((card) => (
                    <CTableRow key={`card${card.cardId}`}>
                        <QuantityForm className='quantity-col' quantity={card.quantity} cardName={card.name} handleSubmit={updateCardQuantity} />
                        <CTableDataCell className='name'      key={`name${card.cardId}`}>
                            {<Card name={card.name} imageUrl={card.image_uris.normal} uri={card.related_uris.gatherer} />}
                        </CTableDataCell>
                        <CTableDataCell className='type_line' key={`type${card.cardId}`}>
                            {card.type_line  }
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
                ))}
            </CTableBody>
        </CTable>
    );
}

export default CollectionCardTable