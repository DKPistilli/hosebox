import { CTableDataCell } from '@coreui/react';
import { useState, useRef } from 'react';
import { toast } from 'react-toastify'
import '../styles/QuantityForm.css'

function QuantityForm({quantity, cardName, handleSubmit}) {

    const [currentQuantity, setCurrentQuantity] = useState(parseInt(quantity));
    const inputRef = useRef(null);

    const submitQuantity = (e) => {
        e.preventDefault();

        if (isNaN(currentQuantity)) {
            toast.error('Quantity must be a number!');
        } else if (currentQuantity < 0) {
            toast.error('Quantity must be greater than or equal to zero!');
        } else {
            handleSubmit(currentQuantity, cardName);
        }

        inputRef.current.blur();
    }

    const handleChange = (e) => {
        e.preventDefault();
        setCurrentQuantity(e.target.value);
    }

    return (
        <CTableDataCell className='quantity'>
            <form onSubmit={submitQuantity} >
            <input
                ref={inputRef}
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

export default QuantityForm;