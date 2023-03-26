/// CARD ADDER COMPONENT
/// Adds cards to whatever deck or collection it belongs to
/// props required: addCard fx from parent that takes in a "cardName" and that's it

import { useState, useEffect }     from 'react'
import { toast }        from 'react-toastify'
import { AutoComplete } from 'antd';

import '../styles/CardAdder.css';

import axios from 'axios';
const SCRYFALL_API_URL = 'https://api.scryfall.com/catalog/card-names'


function CardAdder({ addCard, isDeck }) {
    
    // intialize necessary state (card name input, user, etc.)
    const [listType, setListType]         = useState("mainboard");
    const [cardOptions, setCardOptions]   = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [inputValue, setInputValue]     = useState('');

    // get all potential card options from scryfall cards API for autocomplete
    useEffect(() => {
        const getCardOptions = async () => {
            const response = await axios.get(SCRYFALL_API_URL);
            if (response) {
                const formattedCardOptions = response.data.data.map(cardName => ({
                    value: cardName,
                    label: cardName,
                }));
                setCardOptions(formattedCardOptions);
            }
        }
    
        getCardOptions();
    }, []);

    const handleChange = (value) => {
        setInputValue(value);
    }

    // handle card addition submit event
    const handleCardNameSelect = async (cardName) => {

        // throw error if no cardName given, else, add Card
        if (!cardName) {
            toast.error(`Invalid card name: ${cardName}`);
        } else {
            // check to see if listType given, or if it's adding to a collection
            if (isDeck) {
                await addCard(cardName, listType);
            } else {
                await addCard(cardName);
            }
        }

        setInputValue('');
        setDropdownOpen(false);
    };

    const handleListTypeChange = (e) => {
        setListType(e.target.value);
    }
  
    return (
        <div>
            <section className="form">
                <div className="form-group input-field-and-button-container">
                        <AutoComplete
                        options={cardOptions}
                        value={inputValue}
                        onChange={handleChange}
                        className="form-control add-card-field"
                        id='cardName'
                        name='cardName'
                        placeholder='Add card here e.g. Jace, the Mind Sculptor'
                        onSelect={handleCardNameSelect}
                        // only begin suggesting after first character
                        open={dropdownOpen}
                        onSearch={(value) => setDropdownOpen(value ? true : false)}
                        // case insensitive search
                        filterOption={(inputValue, option) =>
                            inputValue && option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                        }
                        notFoundContent="This card doesn't exist, Planeswalker."
                        />
                        <div className="button-container">
                            <button type="submit" className="btn btn-block add-card-button">
                            Submit
                            </button>
                        </div>
                    </div>
                    {isDeck ? (
                        <div className="form-group radio-group">
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="listType" id="mainboard"
                                       value="mainboard" checked={listType === "mainboard"} onChange={handleListTypeChange}
                                />
                                <label className="form-check-label" htmlFor="mainboard">
                                    Mainboard
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="listType" id="sideboard"
                                       value="sideboard" checked={listType === "sideboard"} onChange={handleListTypeChange}
                                />
                                <label className="form-check-label" htmlFor="sideboard">
                                    Sideboard
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="radio" name="listType" id="scratchpad"
                                       value="scratchpad" checked={listType === "scratchpad"} onChange={handleListTypeChange}
                                />
                                <label className="form-check-label" htmlFor="scratchpad">
                                    Scratchpad
                                </label>
                            </div>
                        </div>
                    ) : null}
            </section>
        </div>
    )
}

export default CardAdder