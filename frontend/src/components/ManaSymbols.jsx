/// MANASYMBOLS COMPONENT
/// A small react component that converts strings like this: {2}{B}{B}
/// to the Magic: The Gathering image symbols for (2)(B)(B)
/// props: manaString("{U}{B}{G}{W}{R}{etc}")

function ManaSymbols({ manaString, layout }) {

    const lowerCaseManaString = manaString ? manaString.toLowerCase() : "";
    const manaArray     = [];
    var   symbolString  = "";

    // split strings into substrings for help
    let i = 0;

    while (i < lowerCaseManaString.length) {

        switch (lowerCaseManaString[i]) {
            // if current character is {, just look next
            case "{":
                i++;
                break;
                
            // if space, we know it's in the format {n0}{n99} // {m0}{m99}
            // so we add a text symbol of " // " to separate n from m
            case " ":
                manaArray.push(" // ");
                i += 4; // increment past the ' // ' chars
                break;
        
            // if current character is }, push current string, reset string, look next
            case "}":
                manaArray.push(symbolString);
                symbolString = "";
                i++;
                break;

            // if current char isn't {}, add it to symbolString, keep moving
            default:
                symbolString += lowerCaseManaString[i]; 
                i++;
        }
    }

    // define map function to turn text-symbols into image-symbols
    const mapFunction = (symbol, index) => {
        if (symbol === (' // ')) {
            return symbol;
        } else {
            return(<i className={`ms ms-${symbol} ms-cost ms-shadow`} key={index}></i>)
        }
    }

    return (
        <>{manaArray && manaArray.length > 0 ? manaArray.map(mapFunction) : ""}</>
    )
}

export default ManaSymbols