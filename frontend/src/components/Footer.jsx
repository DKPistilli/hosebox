import React from 'react';
import {CFooter } from '@coreui/react';
import './Footer.css';

const Footer = () => {
    return (
        <CFooter>
            <div>
                <br />
                <div className="footer-intro">Created by </div>
                <div className='footer-link'>
                    <a href="https://github.com/DKPistilli">
                        Dorian, the Baldest - Legendary Creature - Human Wizard
                    </a>
                </div>
                <br />
                <br />
            </div>
        </CFooter>
    );
};

export default Footer;