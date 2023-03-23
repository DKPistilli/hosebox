/// CARD ADDER COMPONENT
/// Adds cards to whatever deck or collection it belongs to
/// props required: addCard fx from parent that takes in a "cardName" and that's it

import { useState } from 'react'
import { toast } from 'react-toastify'

function CardAdder({ addCard, updateTrigger }) {
    
    // intialize necessary state (card name input, user, etc.)
    const [cardName, setCardName] = useState("");

    // handle card addition submit event
    const handleSubmit = async (e) => {
        e.preventDefault();

        // throw error if no cardName given, else, add Card
        if (!cardName) {
            toast.error(`Invalid card name: ${cardName}`);
        } else {
            await addCard(cardName);
            updateTrigger((trigger) => !trigger);
        }
    };

    const handleChange = ((e) => {
        setCardName(e.target.value);
    });
  
    return (
        <div>
            <section className="form">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                        type={'text'}
                        className="form-control"
                        id='cardName'
                        name='cardName'
                        value={cardName}
                        placeholder='Add card here e.g. Jace, the Mind Sculptor'
                        onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <button type="submit" className='btn btn-block'>
                        Submit
                        </button>
                    </div>
                </form>
            </section>
        </div>
    )
}

export default CardAdder