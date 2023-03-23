/// CARD ADDER COMPONENT
/// Adds cards to whatever deck or collection it belongs to
/// props required: apiUrl="path/of/api/url" updateParent=function that updates parent collection

import { useState } from 'react'
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux'

// import http request service
import axios from 'axios';

function CardAdder({ apiUrl, updateParent }) {
    
    // intialize necessary state (card name input, user, etc.)
    const [cardName, setCardName] = useState("");
    const { user } = useSelector((state) => state.auth);

    // handle card addition submit event
    const handleSubmit = (e) => {
        e.preventDefault();

        const submitCard = async () => {

            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
                params : { name: cardName },
            };

            await axios.post(apiUrl, null, config);

            updateParent();
        };

        // throw error if no cardName given, else, attempt ard addition
        if (!cardName) {
            toast.error(`Invalid card name: ${cardName}`);
        } else {
            submitCard();
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