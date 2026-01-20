import React from 'react';
import Header from './components/Header/Header';
import HeroBanner from './components/Hero/HeroBanner';
import './index.css';

function App() {
    return (
        <div className="app-container">
            <Header />
            <HeroBanner />
        </div>
    )
}

export default App;
