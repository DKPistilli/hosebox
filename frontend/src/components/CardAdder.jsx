/// CARD ADDER COMPONENT
/// Adds cards to whatever deck or collection it belongs to
/// props required: addCard fx from parent that takes in a "cardName" and that's it

import { useState } from 'react'
import { toast } from 'react-toastify'

import '../styles/CardAdder.css';

function CardAdder({ addCard, isDeck }) {
    
    // intialize necessary state (card name input, user, etc.)
    const [cardName, setCardName] = useState("");
    const [listType, setListType] = useState("mainboard");

    // handle card addition submit event
    const handleSubmit = async (e) => {
        e.preventDefault();

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
    };

    const handleCardNameChange = (e) => {
        setCardName(e.target.value);
    };

    const handleListTypeChange = (e) => {
        setListType(e.target.value);
    }
  
    return (
        <div>
            <section className="form">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                        type={'text'}
                        className="form-control add-card-field"
                        id='cardName'
                        name='cardName'
                        value={cardName}
                        placeholder='Add card here e.g. Jace, the Mind Sculptor'
                        onChange={handleCardNameChange}
                        />
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
                    <div className="form-group add-card-button-container">
                        <button type="submit" className='btn btn-block add-card-button '>
                            Submit
                        </button>
                    </div>
                </form>
            </section>
        </div>
    )
}

export default CardAdder