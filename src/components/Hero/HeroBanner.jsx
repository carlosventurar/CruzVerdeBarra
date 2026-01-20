import React from 'react';
import './Hero.css';

const HeroBanner = () => {
    return (
        <div className="hero-container">
            {/* Main Promo Banner */}
            <div className="permission-banner">
                <div className="banner-content">
                    <div className="banner-left">
                        {/* Mocking the 'Productos mas' icon */}
                        <div style={{ fontWeight: 'bold', fontSize: '2rem', color: '#5ed57f', lineHeight: 1 }}>
                            + <br /><span style={{ fontSize: '1rem', color: '#333' }}>productos</span>
                        </div>

                        <div className="banner-text-content">
                            <h2>Descuentos permanentes</h2>
                            <h2 style={{ fontWeight: 400 }}>para medicamentos recurrentes</h2>
                        </div>
                    </div>

                    <div className="banner-center">
                        <button className="banner-btn">
                            <span style={{ background: '#3b3bbd', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</span>
                            <span className="insc-input">Inscribe aquí</span>
                        </button>
                    </div>

                    <div className="discounts-circles">
                        <div className="circle-badge circle-green">
                            <span className="percent">35%</span>
                            <span className="label">1ª UNIDAD</span>
                        </div>
                        <div className="circle-badge circle-purple">
                            <span className="percent">50%</span>
                            <span className="label">2ª UNIDAD</span>
                        </div>
                        <div className="circle-badge circle-blue">
                            <span className="percent">50%</span>
                            <span className="label">3ª UNIDAD</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Orange Tape/Bar */}
            <div className="orange-tape">
                {Array.from({ length: 15 }).map((_, i) => (
                    <span key={i} className="tape-icon">☂️ ☀️</span>
                ))}
            </div>

            {/* Secondary Banners (Summer Savings) */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '20px', gap: '2rem' }}>
                <div style={{ background: '#fff', borderRadius: '15px', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', flex: 1, maxWidth: '500px' }}>
                    <div style={{ background: '#c0392b', color: 'white', padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold', fontSize: '1.5rem', textAlign: 'center' }}>
                        AHORRO<br />VERANO☀️
                    </div>
                </div>

                <div style={{ background: '#fff', borderRadius: '15px', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', flex: 1, maxWidth: '500px' }}>
                    <div>
                        <div style={{ color: '#e67e22', fontWeight: 'bold' }}>¡PROTÉGETE ESTAS VACACIONES!</div>
                        <div>ARMA TU BOTIQUÍN</div>
                        <div style={{ fontSize: '3rem', fontWeight: '800', color: '#e67e22', lineHeight: 1 }}>
                            50 <span style={{ fontSize: '1.5rem' }}>% DCTO.</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default HeroBanner;
