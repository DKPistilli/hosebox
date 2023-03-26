/// CARD TABLE COMPONENT
/// Takes in a prop of cards and returns a table of them
/// props required: cards=[cards]

import CollectionCardTable from "./CollectionCardTable";
import DeckCardTable       from "./DeckCardTable";

function CardTable({ cards, tableName, tableStyle, collectionSize }) {
    return (
        <div>
            {
                tableStyle==="deck" ?
                    <DeckCardTable 
                        cards={cards} 
                        tableName={ tableName }
                    /> :
                    <CollectionCardTable
                        cards={ cards }
                        tableName={ tableName }
                        collectionSize={collectionSize}
                    />
            }
        </div>
    );
};

export default CardTable