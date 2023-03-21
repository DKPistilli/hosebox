import hoseboxImage from '../assets/HoseboxFzzt.png';

function NoPage() {

    const hoseboxLogoStyle = {
        maxWidth: '45%',
        height: 'auto',
    };
    
    const hoseboxTitleStyle = {
        fontSize: 45,
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
            <br />
            <img
                src={hoseboxImage}
                alt='hosebox logo'
                style={hoseboxLogoStyle}
            />
            <br />
            <br />
            <p style={hoseboxSubtitleStyle}> Faithful mending required. </p>
            <br />
        </div>
    )
}
export default NoPage