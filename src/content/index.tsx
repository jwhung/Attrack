import React from 'react';
import { createRoot } from 'react-dom/client';
import { Toast } from './Toast';

console.log('Attrack content script loaded.');

// Create a container for our toast
const container = document.createElement('div');
container.id = 'attrack-root';
// Attach to shadow DOM to isolate styles
const shadow = container.attachShadow({ mode: 'open' });
document.body.appendChild(container);

// Helper to render Toast
const renderToast = () => {
    const root = createRoot(shadow);
    const handleClose = () => {
        root.unmount();
    };
    root.render(
        <React.StrictMode>
            <Toast onClose={handleClose} />
        </React.StrictMode>
    );
};

// Listen for messages from background
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === 'CELEBRATE') {
        renderToast();
    }
    sendResponse({ received: true });
});
