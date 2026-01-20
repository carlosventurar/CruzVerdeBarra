import React from 'react';
import { MapPin, Phone, Grid, Map } from 'lucide-react';
import './Header.css';

const NavBar = () => {
    return (
        <div className="nav-bar">
            <div className="nav-left">
                <div className="nav-link">
                    <MapPin size={16} />
                    Inventory de Las Condes
                </div>
            </div>
            <div className="nav-right">
                <div className="nav-link">
                    <Grid size={16} />
                    Productos Más
                </div>
                <div className="nav-link">
                    <Phone size={16} />
                    Venta Telefónica
                </div>
                <div className="nav-link">
                    <Map size={16} />
                    Ubicación de Farmacias
                </div>
            </div>
        </div>
    );
};

export default NavBar;
