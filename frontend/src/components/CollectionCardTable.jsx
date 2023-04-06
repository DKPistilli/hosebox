import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

import { CTable, CTableHead, CTableBody, CTableRow,
    CTableHeaderCell, CTableCaption } from '@coreui/react'
import CardTableRow from './CardTableRow';

import Spinner   from './Spinner';
import { toast } from 'react-toastify'

import '../styles/CardTable.css';

const COLLECTION_API_URL = process.env.REACT_APP_ENV === 'development' ? 'http://localhost:8000/api/' : 'https://api.hosebox.net/api/';

function CollectionCardTable({ cards, tableName, collectionSize, getCollection }) {

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
                cardName: cardName,
                quantity: quantity,
            }
        };
        
        // update card quantity
        const res = await axios.put(`${COLLECTION_API_URL}${collectionRoute}Cards`, null, config);

        if (!res.data) {
            toast.error(`Error updating quantity of ${cardName}`);
        } else {
            getCollection();
        }
    }
    
    return (
        <CTable bordered className='ctable' >
            <CTableCaption className="caption-left">{`${tableName} (${collectionSize} cards)`}</CTableCaption>
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
                    <CardTableRow key={`card${card.cardId}`} card={card} updateCardQuantity={updateCardQuantity} />
                ))}
            </CTableBody>
        </CTable>
    );
}

export default CollectionCardTable