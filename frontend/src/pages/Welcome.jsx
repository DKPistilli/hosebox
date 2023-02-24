import hoseboxLogoImg from '../assets/hosebox.png';

function Welcome() {

    const hoseboxLogoStyle = {
        maxWidth: '25%',
        height: 'auto',
    };
    
    const hoseboxTitleStyle = {
        fontSize: 80,
    };

    const hoseboxSubtitleStyle = {
        fontSize: 20,
        maxWidth: '75%',
        marginLeft: "auto",
        marginRight: "auto",
    };

    return (
        <div>
            <p> Welcome to...</p>
            <h1 style={hoseboxTitleStyle}> Hosebox </h1>
            <img
                src={hoseboxLogoImg}
                alt='hosebox logo'
                style={hoseboxLogoStyle}
            />
            <p style={hoseboxSubtitleStyle}> The official inventory-management and deckbuilding
            website of the Meadow Lane <i>Magic: The Gathering</i> League (MLMTG)! </p>
        </div>
    )
}
export default Welcome