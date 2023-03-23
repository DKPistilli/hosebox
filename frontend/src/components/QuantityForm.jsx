import { CTableDataCell } from '@coreui/react';
import { useState, useEffect } from 'react';
import './QuantityForm.css'

function QuantityForm({quantity, cardName, handleSubmit}) {

    const [currentQuantity, setCurrentQuantity] = useState(parseInt(quantity));


    const submitQuantity = (e) => {
        e.preventDefault();
        handleSubmit(currentQuantity, cardName);
    }

    const handleChange = (e) => {
        e.preventDefault();
        setCurrentQuantity(e.target.value);
    }

    return (
        <CTableDataCell className='quantity'>
            <form onSubmit={submitQuantity} >
            <input
                className='quantity-input'
                onChange={handleChange}
                value={currentQuantity}
                maxLength='3'
            />
            <input
                type='submit'
                style={{'display': 'none'}}
            />
            </form>
        </CTableDataCell>
    );
}

export default QuantityForm