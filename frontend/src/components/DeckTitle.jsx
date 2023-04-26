import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { CButton, CModal, CModalHeader,
    CModalFooter, CModalTitle, CModalBody, } from '@coreui/react';
import axios from 'axios';
import { toast } from 'react-toastify';

import '../styles/DeckTitle.css';

const DECK_API_URL     = process.env.REACT_APP_ENV === 'development' ? 'http://localhost:8000/api/collections' : 'https://api.hosebox.net/api/collections';
const MAX_TITLE_LENGTH = 22;

const DeckTitle = ({ deckTitle, deckId, isPublic, updateTitle }) => {

    const [currentTitle, setCurrentTitle] = useState(deckTitle || "");
    const [visible, setVisible] = useState(false);
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    // handle click of decklist privacy setting to reveal modal
    const handleClick = () => {
        setVisible(!visible);
    }

    // handle change of decklist privacy
    const handlePrivacy = async () => {
        if (!user || !user._id || !deckId) {
            toast.error('Something went wrong updating deck privacy.');
            return;
        }

        const newPrivacy = isPublic ? "private" : "public" // case sensitive

        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
            params: {
                access: newPrivacy,
            }
        }

        const res = await axios.put(`${DECK_API_URL}/${deckId}/privacy`, null, config);
        console.log(JSON.stringify(res));
        navigate(0);

    }

    //handle submit of new deck title
    const handleSubmit = (e) => {
        e.preventDefault();
        if (currentTitle.length > MAX_TITLE_LENGTH) {
            toast.error(`That title is too long, planeswalker. ${MAX_TITLE_LENGTH} chars...max.`);
            setCurrentTitle(deckTitle);
        } else {
            updateTitle(currentTitle);
        }
    }
    
    //handle char-by-char typing of new deck title
    const handleChange = (e) => {
        e.preventDefault();
        setCurrentTitle(e.target.value);
    }

    return (
        <div className='deck-title-container'>
            <form className='deck-title' onSubmit={handleSubmit} >
                <input
                    className='deck-title-input'
                    onChange={handleChange}
                    value={currentTitle}
                />
                <input
                    type='submit'
                    style={{'display': 'none'}}
                />
            </form>
            <div className='deck-title-privacy'>
                <CButton className='privacy-deck-btn' onClick={handleClick}>{isPublic ? <>Public</> : <>Private</>}</CButton>
                <CModal className='privacy-deck-modal' visible={visible} onClose={() => setVisible(false)}>
                    <CModalHeader className='privacy-deck-modal-header'>
                        <CModalTitle className='privacy-deck-modal-title'>Greetings, Planeswalker...</CModalTitle>
                    </CModalHeader>
                    <CModalBody className='privacy-deck-modal-body'>
                        {isPublic ? 
                        <p>Are you sure you'd like to make {deckTitle} private? Your friends won't be able to see the brilliant tinkering you've done here.</p>
                        :
                        <p>Are you sure you'd like to make {deckTitle} public? Any planeswalker will be able to see your list, and Goose, the Greedlord is ever-watchful.</p>
                        }
                    </CModalBody>
                    <CModalFooter className='privacy-deck-modal-footer'>
                        <CButton className='cancel-privacy-btn' color="secondary" onClick={() => setVisible(false)}>
                            Cancel
                        </CButton>
                        <CButton className='confirm-privacy-btn' color="primary" onClick={handlePrivacy}>Update Privacy</CButton>
                </CModalFooter>
                </CModal>
            </div>
        </div>
    )
}

export default DeckTitle