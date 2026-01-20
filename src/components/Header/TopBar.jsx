import React from 'react';
import { Menu, MapPin, User, ShoppingBag } from 'lucide-react';
import SearchInput from '../Search/SearchInput';
import './Header.css';

const TopBar = () => {
    return (
        <div className="top-bar">
            <div className="logo-container">
                {/* Simple text logo recreation */}
                <span className="logo-text">Cruz Verde</span>
                <span className="logo-plus">+</span>
            </div>

            <button className="categories-btn">
                <Menu size={16} className="categories-icon" />
                Menú de Categorías
            </button>

            {/* Search Component */}
            <div className="search-container-placeholder">
                <SearchInput />
            </div>

            <div className="actions-container">
                <div className="action-item">
                    <MapPin size={24} className="action-icon" />
                    <span>Las Condes</span>
                </div>

                <div className="action-item">
                    <User size={24} className="action-icon" />
                    <div className="user-text">
                        <span>Bienvenid@</span>
                        <span className="user-sub">Iniciar sesión</span>
                    </div>
                </div>

                <div className="action-item">
                    <div className="cart-icon-wrapper">
                        <ShoppingBag size={24} className="action-icon" />
                        <span className="cart-count">0</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopBar;
