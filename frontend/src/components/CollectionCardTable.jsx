import { CTable, CTableHead, CTableBody, CTableRow, CTableHeaderCell, CTableDataCell } from '@coreui/react'
import ManaSymbols   from './ManaSymbols';
import RaritySymbols from './RaritySymbols';
import Card          from './Card';
import Spinner       from './Spinner';

import '../styles/CardTable.css';

function CollectionCardTable({ cards, tableName }) {
    
    if (!cards) {
        return (<Spinner />) ;
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
                        <CTableDataCell className='quantity'  key={`quan${card.cardId}`}>
                            {card.quantity   }
                        </CTableDataCell>
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