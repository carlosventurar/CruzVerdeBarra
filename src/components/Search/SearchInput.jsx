import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import SearchOverlay from './SearchOverlay';
import ChatWidget from '../Dialogflow/ChatWidget';
import './Search.css';

const SearchInput = () => {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    // Estados para la integración con IA
    const [aiResponse, setAiResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [queryToSend, setQueryToSend] = useState(null);
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
            setQueryToSend(null);
            return;
        }

        // Debounce de 300ms antes de enviar a Dialogflow
        setIsLoading(true);
        debounceRef.current = setTimeout(() => {
            setQueryToSend(value);
        }, 300);
    };

    // Callback cuando Dialogflow responde
    const handleAIResponse = useCallback((response) => {
        setAiResponse(response);
        setIsLoading(false);
    }, []);

    const clearSearch = () => {
        setQuery('');
        setIsOpen(false);
        setAiResponse(null);
        setIsLoading(false);
        setQueryToSend(null);
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
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && query.length >= 3) {
                            // Enviar inmediatamente al presionar Enter
                            if (debounceRef.current) {
                                clearTimeout(debounceRef.current);
                            }
                            setIsLoading(true);
                            setQueryToSend(query);
                        }
                    }}
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

            {/* ChatWidget oculto - solo para comunicación con Dialogflow */}
            <ChatWidget
                autoSendQuery={queryToSend}
                onResponse={handleAIResponse}
                showWidget={false}
            />
        </div>
    );
};

export default SearchInput;
