import React from 'react';

const Footer = () => (
    <footer className="text-white" style={{ padding: '1rem', textAlign: 'center', background: 'black' }}>
        <p>&copy; {new Date().getFullYear()} One Drive Fitness Training. All rights reserved.</p>
    </footer>
);

export default Footer;