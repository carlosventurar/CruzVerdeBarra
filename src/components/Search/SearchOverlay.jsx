import React from 'react';
import { Sparkles, Loader2, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './Search.css';

// Función para limpiar y formatear la respuesta de IA
const formatAIResponse = (response) => {
    if (!response) return '';

    let formatted = response;

    // Convertir bullets inline (• producto) a líneas separadas
    formatted = formatted.replace(/\s*•\s*/g, '\n\n• ');

    // Limpiar "🔗 Ver producto:" y dejar solo el link
    formatted = formatted.replace(/🔗\s*Ver producto:\s*/gi, '\n  → ');

    // Limpiar dobles saltos de línea excesivos
    formatted = formatted.replace(/\n{3,}/g, '\n\n');

    return formatted.trim();
};

const SearchOverlay = ({ query, aiResponse, isLoading }) => {
    if (!query) return null;

    const formattedResponse = formatAIResponse(aiResponse);

    return (
        <div className="search-overlay detached">
            {/* Sección AI Overview - Visión general creada por IA */}
            <div className="ai-overview-section">
                <div className="ai-overview-header">
                    <Sparkles size={18} />
                    <span>Visión general creada por IA</span>
                </div>

                {isLoading && (
                    <div className="ai-loading">
                        <Loader2 size={18} className="spinning" />
                        <span>Generando respuesta...</span>
                    </div>
                )}

                {aiResponse && !isLoading && (
                    <div className="ai-content ai-summary">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                // Mostrar URLs como "Ver producto →" en lugar del link completo
                                a: ({ href, children }) => {
                                    // Si el children es una URL, mostrar texto corto
                                    const isUrl = typeof children === 'string' &&
                                                  (children.startsWith('http') || children.includes('storage.cloud'));

                                    return (
                                        <a
                                            href={href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="product-link"
                                        >
                                            {isUrl ? (
                                                <>
                                                    Ver producto <ExternalLink size={12} />
                                                </>
                                            ) : children}
                                        </a>
                                    );
                                },
                                // Mejorar estilo de emphasis (nombres de producto)
                                em: ({ children }) => (
                                    <strong className="product-name">{children}</strong>
                                )
                            }}
                        >
                            {formattedResponse}
                        </ReactMarkdown>
                    </div>
                )}

                {!aiResponse && !isLoading && query.length >= 3 && (
                    <p className="ai-hint">Escriba su consulta para obtener ayuda del asistente</p>
                )}

                {!aiResponse && !isLoading && query.length < 3 && (
                    <p className="ai-hint">Escriba al menos 3 caracteres para activar el asistente</p>
                )}
            </div>

            <div className="search-header">
                <span>Resultados de la búsqueda para <strong>"{query}"</strong></span>
                <a href="#" className="search-link">Ver todos los resultados &gt;</a>
            </div>

            <div className="search-content">
                <div className="search-sidebar">
                    <div className="search-section">
                        <div className="search-section-title">Marcas</div>
                        <div className="search-item">PANTENE</div>
                    </div>
                    <div className="search-section">
                        <div className="search-section-title">Categorías</div>
                        <div className="search-item">Styling</div>
                    </div>
                </div>

                <div className="search-results-main">
                    <div className="search-product-card">
                        <div style={{ width: '60px', height: '60px', background: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: '24px' }}>🧴</span>
                        </div>
                        <div className="product-info">
                            <span className="product-brand">PANTENE</span>
                            <span className="product-title">Rizos Definidos Espuma para Rizos...</span>
                            <div className="product-prices">
                                <span className="price-normal">$ 4.990 (Normal)</span>
                                <span className="price-offer">$ 3.493 <span style={{ background: '#e67e22', color: 'white', fontSize: '0.7em', padding: '1px 4px', borderRadius: '4px' }}>Oferta</span></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchOverlay;
