import { useState } from 'react';

import '../styles/DeckTitle.css';

const DeckTitle = ({ deckTitle, updateTitle }) => {

    const [currentTitle, setCurrentTitle] = useState(deckTitle || "");

    const handleSubmit = (e) => {
        e.preventDefault();
        updateTitle(currentTitle);
    }
    
    const handleChange = (e) => {
        e.preventDefault();
        setCurrentTitle(e.target.value);
    }

    return (
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
    )
}

export default DeckTitle