import React from 'react';
import Header from './components/Header/Header';
import HeroBanner from './components/Hero/HeroBanner';
import ChatWidget from './components/Dialogflow/ChatWidget';
import './index.css';

function App() {
    return (
        <div className="app-container">
            <Header />
            <HeroBanner />

            {/* Dialogflow Widget Container - Kept at bottom */}
            <ChatWidget />
        </div>
    )
}

export default App;
