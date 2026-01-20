import React from 'react';
import TopBar from './TopBar';
import NavBar from './NavBar';
import './Header.css';

const Header = () => {
    return (
        <header className="header-container">
            <TopBar />
            <NavBar />
        </header>
    );
};

export default Header;
