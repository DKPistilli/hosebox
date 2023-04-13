import { CButton, CModal, CModalHeader,
    CModalFooter, CModalTitle, CModalBody, } from '@coreui/react';
import { useState } from 'react';

import '../styles/DeleteDeck.css'

const DeleteCollectionButton = ({ deleteCollection }) => {

    const [visible, setVisible] = useState(false);

    const handleClick = () => {
        setVisible(!visible);
    }

    const handleDelete = async () => {
        await deleteCollection();
        setVisible(false);
    }

    return (
        <>
            <CButton className='delete-deck-btn' onClick={handleClick}>Delete Collection</CButton>
            <CModal className='delete-deck-modal' visible={visible} onClose={() => setVisible(false)}>
                <CModalHeader className='delete-deck-modal-header'>
                    <CModalTitle className='delete-deck-modal-title'>Be Careful, Planeswalker!</CModalTitle>
                </CModalHeader>
                <CModalBody className='delete-deck-modal-body'>
                    Are you sure you want to delete this collection? Once you confirm, the ENTIRE COLLECTION will be deleted permanently, and you will not be able to undo this action.
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

export default DeleteCollectionButton