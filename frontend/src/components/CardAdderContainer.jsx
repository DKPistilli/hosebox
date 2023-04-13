import { useState } from "react";

import SingleCardAdder from './SingleCardAdder';
import CardlistAdder   from './CardlistAdder';

const CardAdderContainer = ({addCard, addCardlist, isDeck}) => {

    const [selectedAdder, setSelectedAdder] = useState('singleCard');

    const selectSingleCardAdder = () => {
        setSelectedAdder('singleCard');
    }

    const selectCardlistAdder = () => {
        setSelectedAdder('cardlist');
    }

    const displaySelectedAdder = () => {
        switch (selectedAdder) {
            case "singleCard":
                return <SingleCardAdder addCard={addCard} isDeck={isDeck} />
            case "cardlist":
                return <CardlistAdder addCardlist={addCardlist} isDeck={isDeck} />
            default:
                return <></>
        }
    }

    return (
        <div className="card-add-container">
            <div className="card-add-selectors">
                <button className="btn add-selector-button" onClick={selectSingleCardAdder}>
                    Add Card
                </button>
                <button className="btn add-selector-button" onClick={selectCardlistAdder}>
                    Add List
                </button>
            </div>
            {displaySelectedAdder()}
        </div>
    )
}

export default CardAdderContainer