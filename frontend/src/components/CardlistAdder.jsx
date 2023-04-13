/// CARDLIST ADDER COMPONENT
/// Adds cards to whatever deck or collection it belongs to
/// props: addCard fx from parent (takes in a "cardName" and if isDeck, a listType) and isDeck bool

import { useState }     from 'react';
import TextArea from 'antd/es/input/TextArea';
import { toast } from 'react-toastify';

import '../styles/CardAdder.css';

function CardlistAdder({addCardlist, isDeck }) {
    
    // intialize necessary state
    const [listType, setListType] = useState("mainboard");
    const [cardlist, setCardlist] = useState("");

    // handle change to textarea
    const handleChange = (e) => {
        e.preventDefault();
        setCardlist(e.target.value);
    }

    // handle radio group clicks for decks
    const handleListTypeChange = (e) => {
        setListType(e.target.value);
    }

    // handle cardlist submission
    const handleCardlistSubmit = async () => {

        // throw error if no cardName given, else, add Card
        if (!cardlist) {
            toast.error(`Invalid cardlist given.`);
        } else {
            // check to see if listType given, or if it's adding to a collection
            try {
                if (isDeck) {
                    await addCardlist(cardlist, listType);
                } else {
                    await addCardlist(cardlist);
                }
                setCardlist("");
            } catch (err) {
                toast.error(err.message);
                setCardlist(""); // STUB - would love for this to be set to error-cards someday.
            }
        }
    };
  
    return (
        <div>
            <section className="form">
                <div className="form-group input-field-and-button-container">
                    <div className="input-field-container">                        
                        <TextArea
                            onChange={handleChange}
                            value={cardlist}
                            rows={3}
                            placeholder={'9 Spike Tiller\n7 Eldrazi Mimic\n1 Reality Smasher\n'} maxLength={99999}
                            className={"form-control add-card-field"}
                        />
                    </div>
                    <div className="button-container">
                        <button type="submit" onClick={handleCardlistSubmit} className="btn btn-block add-card-button">
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

export default CardlistAdder