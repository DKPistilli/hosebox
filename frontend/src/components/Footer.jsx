import React from 'react';
import {CFooter } from '@coreui/react';
import '../styles/Footer.css';

const Footer = () => {
    return (
        <CFooter>
            <div className='footer'>
                <br />
                <div className="footer-intro">Created by </div>
                <div className='footer-link'>
                    <a href="/about">
                        Dorian, the Glimmering Baldness - Legendary Creature - Human Wizard
                    </a>
                </div>
                <br />
                <br />
            </div>
        </CFooter>
    );
};

export default Footer;