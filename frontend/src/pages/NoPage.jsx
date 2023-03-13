import hoseboxLogoImg from '../assets/hosebox.png';

function NoPage() {

    const hoseboxLogoStyle = {
        maxWidth: '25%',
        height: 'auto',
    };
    
    const hoseboxTitleStyle = {
        fontSize: 50,
    };

    const hoseboxSubtitleStyle = {
        fontSize: 20,
        maxWidth: '75%',
        marginLeft: "auto",
        marginRight: "auto",
    };

    return (
        <div>
            <h1 style={hoseboxTitleStyle}> url.notFound===true </h1>
            <img
                src={hoseboxLogoImg}
                alt='hosebox logo'
                style={hoseboxLogoStyle}
            />

            <p style={hoseboxSubtitleStyle}> Ktzzzz...short circuit. Faithful mending required. </p>
        </div>
    )
}
export default NoPage