import React, { useEffect, useRef } from 'react';
import './ChatWidget.css';

const ChatWidget = ({ autoSendQuery, onResponse, showWidget = true }) => {
    const dfMessengerRef = useRef(null);
    const lastQueryRef = useRef(null);

    // Listener para capturar respuestas de Dialogflow
    useEffect(() => {
        const handleResponse = (event) => {
            try {
                // Extraer respuesta del evento df-response-received
                const response = event.detail?.response;
                const queryResult = response?.queryResult;

                // Intentar obtener el texto de la respuesta
                let text = '';

                // Opción 1: fulfillmentMessages
                const fulfillmentMessages = queryResult?.fulfillmentMessages;
                if (fulfillmentMessages && fulfillmentMessages.length > 0) {
                    text = fulfillmentMessages[0]?.text?.text?.[0] || '';
                }

                // Opción 2: fulfillmentText
                if (!text && queryResult?.fulfillmentText) {
                    text = queryResult.fulfillmentText;
                }

                // Opción 3: responseMessages (formato CX)
                if (!text && queryResult?.responseMessages) {
                    const messages = queryResult.responseMessages;
                    for (const msg of messages) {
                        if (msg.text?.text?.[0]) {
                            text = msg.text.text[0];
                            break;
                        }
                    }
                }

                if (onResponse && text) {
                    onResponse(text);
                }
            } catch (e) {
                console.error('Error procesando respuesta de Dialogflow:', e);
            }
        };

        // Escuchar evento en el documento (el evento burbujea)
        document.addEventListener('df-response-received', handleResponse);

        return () => {
            document.removeEventListener('df-response-received', handleResponse);
        };
    }, [onResponse]);

    // Auto-enviar query cuando cambia
    useEffect(() => {
        const dfMessenger = dfMessengerRef.current;
        if (!dfMessenger || !autoSendQuery) return;

        // Evitar enviar la misma query dos veces
        if (lastQueryRef.current === autoSendQuery) return;
        lastQueryRef.current = autoSendQuery;

        // Auto-expand
        dfMessenger.setAttribute('expand', 'true');
        dfMessenger.setAttribute('expanded', 'true');

        setTimeout(() => {
            try {
                // Traverse Shadow DOM
                const chat = dfMessenger.shadowRoot?.querySelector('df-messenger-chat');
                const userInput = chat?.shadowRoot?.querySelector('df-messenger-user-input');
                const inputField = userInput?.shadowRoot?.querySelector('input');
                const sendButton = userInput?.shadowRoot?.querySelector('button#send-icon');

                if (inputField && sendButton) {
                    // Simular escritura
                    inputField.value = autoSendQuery;
                    inputField.dispatchEvent(new Event('input', { bubbles: true, composed: true }));

                    // Esperar y enviar
                    setTimeout(() => {
                        sendButton.click();
                    }, 100);
                }
            } catch (e) {
                console.error('Error enviando mensaje al chat:', e);
            }
        }, 500);
    }, [autoSendQuery]);

    return (
        <div className={showWidget ? '' : 'chat-widget-hidden'} style={{ width: '100%', height: '100%' }}>
            {/* Dialogflow Widget */}
            <df-messenger
                ref={dfMessengerRef}
                project-id="demos-bot-informacion-general"
                agent-id="042401fe-a6b8-4976-86ea-d8cc28feb98f"
                language-code="es"
                max-query-length="-1"
            >
                <df-messenger-chat-bubble chat-title="bot-demo-general" />
            </df-messenger>
        </div>
    );
};

export default ChatWidget;
