import { Link } from 'react-router-dom';
import dorianImg from '../assets/DORIAN_THE_GLIMMERING_BALDNESS.png';

import '../styles/About.css';

const DORIAN_GITHUB_URL = 'https://github.com/DKPistilli';

function About() {
    return (
        <div>
            <Link to={DORIAN_GITHUB_URL}>
                <img
                    className='about-mtg-card'
                    src={dorianImg}
                    alt={'Joke magic card of Dorian, The Glimmering Baldness - Legendary Human Wizard'}
                />
            </Link>
        </div>
    )
}

export default About