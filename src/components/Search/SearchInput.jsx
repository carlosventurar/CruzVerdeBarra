import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import SearchOverlay from './SearchOverlay';
import './Search.css';

// URL del webhook de n8n
const N8N_WEBHOOK_URL = 'https://primary-production-7f25.up.railway.app/webhook/cruz-verde-search';

const SearchInput = () => {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    // Estados para la IA
    const [aiResponse, setAiResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const debounceRef = useRef(null);

    // Cerrar al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Función para llamar al webhook de n8n
    const fetchAIResponse = async (searchQuery) => {
        try {
            const response = await fetch(N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: searchQuery }),
            });

            if (!response.ok) {
                throw new Error('Error en la respuesta');
            }

            const data = await response.json();
            return data.response || 'No se pudo obtener una respuesta.';
        } catch (error) {
            console.error('Error llamando al asistente:', error);
            return 'Lo sentimos, hubo un error al procesar su consulta. Intente nuevamente.';
        }
    };

    const handleFocus = () => {
        if (query.length > 0) setIsOpen(true);
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        setIsOpen(value.length > 0);

        // Limpiar debounce anterior
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        // Si el query es menor a 3 caracteres, limpiar respuesta
        if (value.length < 3) {
            setAiResponse(null);
            setIsLoading(false);
            return;
        }

        // Debounce de 800ms antes de llamar a n8n
        setIsLoading(true);
        debounceRef.current = setTimeout(async () => {
            const response = await fetchAIResponse(value);
            setAiResponse(response);
            setIsLoading(false);
        }, 800);
    };

    const handleKeyDown = async (e) => {
        if (e.key === 'Enter' && query.length >= 3) {
            // Enviar inmediatamente al presionar Enter
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
            setIsLoading(true);
            const response = await fetchAIResponse(query);
            setAiResponse(response);
            setIsLoading(false);
        }
    };

    const clearSearch = () => {
        setQuery('');
        setIsOpen(false);
        setAiResponse(null);
        setIsLoading(false);
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
    };

    // Limpiar debounce al desmontar
    useEffect(() => {
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, []);

    return (
        <div className="search-wrapper" ref={containerRef}>
            <div className="search-input-container">
                <input
                    type="text"
                    className="search-input"
                    placeholder="¿Cuál es el estado de mi caso?"
                    value={query}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onKeyDown={handleKeyDown}
                />
                {query && (
                    <X size={18} className="search-close-icon" onClick={clearSearch} />
                )}
            </div>

            {isOpen && (
                <SearchOverlay
                    query={query}
                    aiResponse={aiResponse}
                    isLoading={isLoading}
                />
            )}
        </div>
    );
};

export default SearchInput;
