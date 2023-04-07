import { CTableRow, CTableDataCell } from '@coreui/react'
import QuantityForm  from './QuantityForm';
import RaritySymbols from './RaritySymbols';
import ManaSymbols   from './ManaSymbols';
import CardName      from './CardName';
import CardTypeLine  from './CardTypeLine';

// func : Displays collection or deck cardtable row
// props: Card Object, fx to update parent on cardQuantityChange
// note : Not only does this allow us to DRY the code for displaying cards, it also allows us to
//        isolate the logic of special cards -- mdfcs, splits, flips, transforms (and potential futures)
function CardTableRow({ card, updateCardQuantity }) {

    // declare the constants that are NOT affected by layout/special cards
    const layout = card.layout;
    const cardName = card.name;
    const cardId = card.cardId;
    const quantity = card.quantity;
    const typeLine = card.type_line;
    const rarityString = card.rarity;
    const price = card.prices.usd;
    const cardUri = card.scryfall_uri;

    let imageUri, manaString;
    
    // handle the special case vars (currently imgUri + manaString)
    switch (layout) {
        
        // normal JSON structured cards
        case "normal":
            imageUri = card.image_uris.normal;
            manaString = card.mana_cost;
            break;

        // flip, eg Nezumi Shortfang (currently doesn't require special cases.)
        case "flip":
            imageUri = card.image_uris.normal;
            manaString = card.mana_cost;
            break;

        // split, eg Boom // Bust. 
        case "split":
            imageUri = card.image_uris.normal;
            manaString = card.mana_cost;
            break;

        // transform, eg Delver of Secrets
        case "transform":
            imageUri = card.card_faces[0].image_uris.normal;
            manaString = card.card_faces[0].mana_cost;
            break;

        // transform, eg Silundi Vision
        case "modal_dfc":
            imageUri = card.card_faces[0].image_uris.normal;

            // cases: no mana (mdfc land), front-face mana (silundi vision), both-face mana (birgi, god of storytelling)
            const frontMana = card.card_faces[0].mana_cost;
            const backMana  = card.card_faces[1].mana_cost;
            manaString = "";

            // add front ie not an mdfc land
            if (frontMana) {
                manaString += frontMana;
            }

            // add visual separator if both
            if (frontMana && backMana) {
                manaString += " // ";
            }

            // now that separator's added, add backMana
            if (backMana) {
                manaString += backMana;
            }

            break;

        // abnormal types that don't require cases (saga, battle, etc.)
        default:
            imageUri = card.image_uris.normal;
            manaString = card.mana_cost;
            break;
    }

    return (
        <CTableRow key={`card${cardId}`}>
            <QuantityForm className='quantity-col' quantity={quantity} cardName={cardName} handleSubmit={updateCardQuantity} />
            <CTableDataCell className='cardName' key={`cardName${cardId}`}>
                {<CardName layout={layout} cardName={cardName} imageUrl={imageUri} uri={cardUri} />}
            </CTableDataCell>
            <CTableDataCell className='type_line' key={`type${cardId}`}>
                <CardTypeLine typeLine={typeLine} layout={layout} />
            </CTableDataCell>
            <CTableDataCell className='mana_cost' key={`cost${cardId}`}>
                <ManaSymbols manaString={manaString} layout={layout} />
            </CTableDataCell>
            <CTableDataCell className='rarity' key={`rare${cardId}`}>
                <RaritySymbols rarityString={rarityString} />
            </CTableDataCell>
            <CTableDataCell className='price' key={`pric${cardId}`}>
                ${price}
            </CTableDataCell>
        </CTableRow>
    )
}

export default CardTableRow