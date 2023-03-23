import { CButton, CModal, CModalHeader,
         CModalFooter, CModalTitle, CModalBody, } from '@coreui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../styles/DeleteDeck.css'

const DeleteDeckButton = ({ deleteDeck }) => {

    const [visible, setVisible] = useState(false);
    const navigate = useNavigate();

    const handleClick = () => {
        setVisible(!visible);
    }

    const handleDelete = async () => {
        await deleteDeck();
        navigate(-1);
    }

    return (
      <>
        <CButton className='delete-deck-btn' onClick={handleClick}>Delete Deck</CButton>
        <CModal className='delete-deck-modal' visible={visible} onClose={() => setVisible(false)}>
            <CModalHeader className='delete-deck-modal-header'>
                <CModalTitle className='delete-deck-modal-title'>Be Careful, Planeswalker!</CModalTitle>
            </CModalHeader>
            <CModalBody className='delete-deck-modal-body'>
                Are you sure you want to delete this deck? Once you confirm, the deck will be deleted permanently, and you will not be able to undo this action.
            </CModalBody>
            <CModalFooter className='delete-deck-modal-footer'>
                <CButton className='cancel-delete-btn' color="secondary" onClick={() => setVisible(false)}>
                    Cancel
                </CButton>
                <CButton className='confirm-delete-btn' color="primary" onClick={handleDelete}>Delete</CButton>
          </CModalFooter>
        </CModal>
      </>
    )
}

export default DeleteDeckButton