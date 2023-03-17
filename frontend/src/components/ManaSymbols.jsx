/// MANASYMBOLS COMPONENT
/// A small react component that converts strings like this: {2}{B}{B}
/// to the Magic: The Gathering image symbols for (2)(B)(B)
/// props: manaString("{U}{B}{G}{W}{R}{etc}")

const W = require('../assets/mana_symbols/W.svg').default;
const U = require('../assets/mana_symbols/U.svg').default;


// TO DO: FIND A WAY TO SPLIT EXP
// FIND LINK TO IMAGE


// dictionary of {"mana abbreviation": "image/path/in/assets"}
const symbolToImage = {

    // Generic Mana Costs
    "{0}" : "../assets/mana_symbols/0.svg",
    "{1}" : "../assets/mana_symbols/1.svg",
    "{2}" : "../assets/mana_symbols/2.svg",
    "{3}" : "../assets/mana_symbols/3.svg",
    "{4}" : "../assets/mana_symbols/4.svg",
    "{5}" : "../assets/mana_symbols/5.svg",
    "{6}" : "../assets/mana_symbols/6.svg",
    "{7}" : "../assets/mana_symbols/7.svg",
    "{8}" : "../assets/mana_symbols/8.svg",
    "{9}" : "../assets/mana_symbols/9.svg",
    "{10}": "../assets/mana_symbols/10.svg",
    "{11}": "../assets/mana_symbols/11.svg",
    "{12}": "../assets/mana_symbols/12.svg",
    "{13}": "../assets/mana_symbols/13.svg",
    "{14}": "../assets/mana_symbols/14.svg",
    "{15}": "../assets/mana_symbols/15.svg",
    "{16}": "../assets/mana_symbols/16.svg",
    "{17}": "../assets/mana_symbols/17.svg",
    "{18}": "../assets/mana_symbols/18.svg",
    "{19}": "../assets/mana_symbols/19.svg",
    "{20}": "../assets/mana_symbols/20.svg",
    "{X}" : "../assets/mana_symbols/X.svg",
    "{S}" : "../assets/mana_symbols/S.svg",

    // Mana Symbols
    "{W}"    : "../assets/mana_symbols/W.svg",
    "{U}"    : "../assets/mana_symbols/U.svg",
    "{B}"    : "../assets/mana_symbols/B.svg",
    "{R}"    : "../assets/mana_symbols/R.svg",
    "{G}"    : "../assets/mana_symbols/G.svg",
    "{C}"    : "../assets/mana_symbols/C.svg",
    "{W/U}"  : "../assets/mana_symbols/WU.svg",
    "{W/B}"  : "../assets/mana_symbols/WB.svg",
    "{B/R}"  : "../assets/mana_symbols/BR.svg",
    "{B/G}"  : "../assets/mana_symbols/BG.svg",
    "{U/B}"  : "../assets/mana_symbols/UB.svg",
    "{U/R}"  : "../assets/mana_symbols/UR.svg",
    "{R/G}"  : "../assets/mana_symbols/RG.svg",
    "{R/W}"  : "../assets/mana_symbols/RW.svg",
    "{G/W}"  : "../assets/mana_symbols/GW.svg",
    "{G/U}"  : "../assets/mana_symbols/GU.svg",
    "{B/G/P}": "../assets/mana_symbols/BGP.svg",
    "{B/R/P}": "../assets/mana_symbols/BRP.svg",
    "{G/U/P}": "../assets/mana_symbols/GUP.svg",
    "{G/W/P}": "../assets/mana_symbols/GWP.svg",
    "{R/G/P}": "../assets/mana_symbols/RGP.svg",
    "{R/W/P}": "../assets/mana_symbols/RWP.svg",
    "{U/B/P}": "../assets/mana_symbols/UBP.svg",
    "{U/R/P}": "../assets/mana_symbols/URP.svg",
    "{W/B/P}": "../assets/mana_symbols/WBP.svg",
    "{W/U/P}": "../assets/mana_symbols/WUP.svg",
    "{2/W}"  : "../assets/mana_symbols/2W.svg",
    "{2/U}"  : "../assets/mana_symbols/2U.svg",
    "{2/B}"  : "../assets/mana_symbols/2B.svg",
    "{2/R}"  : "../assets/mana_symbols/2R.svg",
    "{2/G}"  : "../assets/mana_symbols/2G.svg",
    "{P}"    : "../assets/mana_symbols/P.svg",
    "{W/P}"  : "../assets/mana_symbols/WP.svg",
    "{U/P}"  : "../assets/mana_symbols/UP.svg",
    "{B/P}"  : "../assets/mana_symbols/BP.svg",
    "{R/P}"  : "../assets/mana_symbols/RP.svg",
    "{G/P}"  : "../assets/mana_symbols/GP.svg",
    
    // Unset Crazy Symbols
    "{HW}"     : "../assets/mana_symbols/Unknown.png",
    "{HR}"     : "../assets/mana_symbols/Unknown.png",
    "{Y}"      : "../assets/mana_symbols/Unknown.png",
    "{Z}"      : "../assets/mana_symbols/Unknown.png",
    "{½}"      : "../assets/mana_symbols/Unknown.png",
    "{100}"    : "../assets/mana_symbols/Unknown.png",
    "{1000000}": "../assets/mana_symbols/Unknown.png",
    "{∞}"      : "../assets/mana_symbols/Unknown.png",
};

function ManaSymbols(props) {

    const images = require.context('../assets/mana_symbols', false, /\.(png|jpe?g|svg)$/);

    // map over the keys of the images object to get the URLs of all images in the directory
    const imageUrls = images.keys().map(images);

    // manaString should be in format "{2}{B}{U}"
    const manaString = props.manaString;

    // regex split strings into substrings that begin with '{' and end with '}'
    const regex = /{[^{}]*}/;

    // split manaString into an arr of its individual
    // const manaArray = manaString.split(regex);
    // console.log(`props.manaArray: ${props.manaArray}`);

    const manaArray = ["{W}", "{U}",];

    // dictionary of potential mana symbols and their associated image

    // define map function to turn text-symbols into image-symbols
    const mapFunction = (symbol, i) => {
        // const imagePath = symbolToImage[symbol];
        return(<img src={U} alt={symbol} key={i} style={{width:'10px'}} />)
    }

    return (
        <div>{manaArray && manaArray.length > 0 ? manaArray.map(mapFunction) : ""}</div>
    )
}



export default ManaSymbols