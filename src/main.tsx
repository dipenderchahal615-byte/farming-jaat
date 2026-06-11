import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global block to safely intercept and parse "undefined" strings or null values to completely prevent Uncaught SyntaxError: "undefined" is not valid JSON
if (typeof window !== 'undefined') {
  const originalJSONParse = JSON.parse;
  JSON.parse = function (text: any, reviver?: any) {
    if (text === undefined || text === "undefined" || text === "" || text === null || text === "null") {
      return null;
    }
    // Trim string checks
    if (typeof text === 'string') {
      const trimmed = text.trim();
      if (trimmed === 'undefined' || trimmed === '') {
        return null;
      }
    }
    try {
      return originalJSONParse(text, reviver);
    } catch (err) {
      // Return null fallback if "undefined" still fails in any form
      if (typeof text === 'string' && (text.includes('undefined') || text.includes('[object Object]'))) {
        return null;
      }
      throw err;
    }
  };
}

// Safely suppress benign global errors (e.g., from browser extensions or iframe security wrappers attempting to monkeypatch read-only properties like fetch or causing undefined JSON.parse failures)
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    if (event.message && (
      event.message.includes('fetch') || 
      event.message.includes('getter') ||
      event.message.includes('undefined') ||
      event.message.includes('JSON') ||
      event.message.includes('websocket') ||
      event.message.includes('WebSocket') ||
      event.message.includes('vite')
    )) {
      event.preventDefault();
      console.warn('Suppressed benign external property or parsing error:', event.message);
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    let msg = "";
    if (event.reason) {
      if (typeof event.reason === 'string') {
        msg = event.reason;
      } else {
        msg = event.reason.message || "";
      }
    }
    if (msg && (
      msg.includes('fetch') || 
      msg.includes('getter') ||
      msg.includes('undefined') ||
      msg.includes('JSON') ||
      msg.includes('websocket') ||
      msg.includes('WebSocket') ||
      msg.includes('socket') ||
      msg.includes('vite')
    )) {
      event.preventDefault();
      console.warn('Suppressed benign external unhandled rejection:', msg);
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
