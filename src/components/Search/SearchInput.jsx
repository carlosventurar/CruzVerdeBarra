import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import SearchOverlay from './SearchOverlay';
import './Search.css';

// URL del webhook de n8n
const N8N_WEBHOOK_URL = 'https://primary-production-7f25.up.railway.app/webhook/cruz-verde-search';

// Clave para localStorage
const STORAGE_KEY = 'cruzVerde_chatHistory';

// Máximo de mensajes a guardar (para no sobrecargar)
const MAX_HISTORY_MESSAGES = 20;

const SearchInput = () => {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    // Estados para la IA
    const [aiResponse, setAiResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const debounceRef = useRef(null);

    // Estado para historial de conversación
    const [conversationHistory, setConversationHistory] = useState([]);

    // Cargar historial de localStorage al montar
    useEffect(() => {
        try {
            const savedHistory = localStorage.getItem(STORAGE_KEY);
            if (savedHistory) {
                const parsed = JSON.parse(savedHistory);
                setConversationHistory(parsed);
            }
        } catch (error) {
            console.error('Error cargando historial:', error);
        }
    }, []);

    // Guardar historial en localStorage cuando cambie
    const saveHistory = (history) => {
        try {
            // Limitar cantidad de mensajes guardados
            const trimmedHistory = history.slice(-MAX_HISTORY_MESSAGES);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory));
            setConversationHistory(trimmedHistory);
        } catch (error) {
            console.error('Error guardando historial:', error);
        }
    };

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

    // Construir query con contexto de historial
    const buildQueryWithHistory = (userQuery) => {
        if (conversationHistory.length === 0) {
            return userQuery;
        }

        // Tomar últimos 10 mensajes del historial
        const recentHistory = conversationHistory.slice(-10);
        let context = '[Historial de conversación anterior]\n';

        for (const msg of recentHistory) {
            const prefix = msg.role === 'user' ? 'Usuario' : 'Asistente';
            context += `${prefix}: ${msg.content}\n`;
        }

        context += `[Fin del historial]\n\nNueva pregunta del usuario: ${userQuery}`;
        return context;
    };

    // Función para llamar al webhook de n8n con historial
    const fetchAIResponse = async (searchQuery) => {
        try {
            // Construir query con contexto de historial
            const queryWithContext = buildQueryWithHistory(searchQuery);

            const response = await fetch(N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: queryWithContext
                }),
            });

            if (!response.ok) {
                throw new Error('Error en la respuesta');
            }

            const data = await response.json();
            const aiText = data.response || 'No se pudo obtener una respuesta.';

            // Guardar en historial: mensaje del usuario y respuesta de IA
            const newHistory = [
                ...conversationHistory,
                { role: 'user', content: searchQuery },
                { role: 'assistant', content: aiText }
            ];
            saveHistory(newHistory);

            return aiText;
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
