import hoseboxLogoImg from '../assets/hosebox.png';
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Spinner from '../components/Spinner'

function Welcome() {

    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth); // nav to inventory if user authorized

    const hoseboxLogoStyle = {
        maxWidth: '25%',
        height: 'auto',
    };
    
    const hoseboxTitleStyle = {
        fontSize: '7vw',
    };

    const hoseboxSubtitleStyle = {
        fontSize: 20,
        maxWidth: '75%',
        marginLeft: "auto",
        marginRight: "auto",
    };

    // if user logged in, landing page navs to user's inventory
    useEffect(() => {
        if (user) {
            navigate(`/inventories/${user._id}`);
        }
    }, [user, navigate])

    if (user) {
        return <Spinner />
    }

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