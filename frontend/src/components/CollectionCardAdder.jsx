/// CARD TABLE COMPONENT
/// Takes in a prop of cards and returns a table of them
/// props required: cards=[cards]

import { useState } from 'react'
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux'

// import http request service
import axios from 'axios';

function CollectionCardAdder(props) {
    
    // intialize necessary state (card name input, user, etc.)
    const [cardName, setCardName] = useState("");
    const { user } = useSelector((state) => state.auth);

    const apiUrl = props.apiUrl;
    const setIsParentOutOfDate = props.setIsParentOutOfDate

    // handle card addition submit event
    const onSubmit = (e) => {
        e.preventDefault();

        const submitCard = async () => {

            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
                params : { name: cardName },
            };

            await axios.post(apiUrl, null, config);
        };

        // verify that both fields have been filled
        let isValidCardRequest = true;

        if (!cardName) {
            toast.error(`Invalid card name: ${cardName}`);
            isValidCardRequest = false;
        }

        if (isValidCardRequest) {
            submitCard();
            setIsParentOutOfDate(true);
        }
    };

    const onChange = ((e) => {
        setCardName(e.target.value);
    });
  
    return (
        <div>
            <section className="form">
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <input
                        type={'text'}
                        className="form-control"
                        id='cardName'
                        name='cardName'
                        value={cardName}
                        placeholder='Add card here e.g. Jace, the Mind Sculptor'
                        onChange={onChange}
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

export default CollectionCardAdder