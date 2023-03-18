/// CARD TABLE COMPONENT
/// Takes in a prop of cards and returns a table of them
/// props required: cards=[cards]
import './CardTable.css';
import ManaSymbols   from './ManaSymbols';
import RaritySymbols from './RaritySymbols';

function CardTable({ cards }) {

    return (
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Cost</th>
                    <th>Rarity</th>
                    <th>$</th>
                </tr>
            </thead>
            <tbody>
                {cards.map((card) => (
                    <tr key={`card${card.cardId}`}>
                        <td className='quantity'  key={`quan${card.cardId}`}>{card.quantity   }</td>
                        <td className='name'      key={`name${card.cardId}`}>{card.name       }</td>
                        <td className='type_line' key={`type${card.cardId}`}>{card.type_line  }</td>
                        <td className='mana_cost' key={`cost${card.cardId}`}><ManaSymbols manaString={card.mana_cost}  /></td>
                        <td className='rarity'    key={`rare${card.cardId}`}><RaritySymbols rarityString={card.rarity} /></td>
                        <td className='price'     key={`pric${card.cardId}`}>${card.prices.usd}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default CardTable