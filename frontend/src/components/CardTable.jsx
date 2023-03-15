/// CARD TABLE COMPONENT
/// Takes in a prop of cards and returns a table of them
/// props required: cards=[cards]
import './CardTable.css'


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
                    <th>$$</th>
                </tr>
            </thead>
            <tbody>
                {cards.map((card) => (
                <tr key={`card${card.cardId}`}>
                    <td className='quantity' key={`quan${card.cardId}`}>{card.quantity  }</td>
                    <td key={`name${card.cardId}`}>{card.name      }</td>
                    <td key={`type${card.cardId}`}>{card.type_line }</td>
                    <td key={`cost${card.cardId}`}>{card.mana_cost }</td>
                    <td key={`rare${card.cardId}`}>{card.rarity    }</td>
                    <td className='price' key={`pric${card.cardId}`}>{card.prices.usd}</td>
                </tr>
                ))}
            </tbody>
        </table>
    );
};

export default CardTable