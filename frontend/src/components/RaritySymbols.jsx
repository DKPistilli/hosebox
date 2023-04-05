import common   from '../assets/rarity_symbols/common.png';
import uncommon from '../assets/rarity_symbols/uncommon.png';
import rare     from '../assets/rarity_symbols/rare.png';
import mythic   from '../assets/rarity_symbols/mythic.png';
import '../styles/RaritySymbols.css';

function RaritySymbols({ rarityString }) {

    let rarity;
    
    // determine which image is needed
    switch (rarityString) {
        case "common":
            rarity = common;
            break;

        case "uncommon":
            rarity = uncommon;
            break;

        case "rare":
            rarity = rare;
            break;

        case "mythic":
            rarity = mythic;
            break;

        default:
            rarity = null;
            break; 
    }

    return (
        <div>{!rarity ? rarityString : <img className="rarity-symbol" title={rarityString} src={rarity} alt={rarityString} />}</div>
    )
}

export default RaritySymbols