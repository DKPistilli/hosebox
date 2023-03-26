/// CARD TABLE COMPONENT
/// Takes in a prop of cards and returns a table of them
/// props required: cards=[cards], "tableName", "tableStyle"
/// props optional: number collectionSize, fx getCollection

import CollectionCardTable from "./CollectionCardTable";
import DeckCardTable       from "./DeckCardTable";

function CardTable({ cards, tableName, tableStyle, collectionSize, getCollection }) {
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
                        getCollection={getCollection}
                    />
            }
        </div>
    );
};

export default CardTable