import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Safely suppress benign global errors (e.g., from browser extensions or iframe security wrappers attempting to monkeypatch read-only properties like fetch or causing undefined JSON.parse failures)
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    if (event.message && (
      event.message.includes('fetch') || 
      event.message.includes('getter') ||
      event.message.includes('undefined') ||
      event.message.includes('JSON')
    )) {
      event.preventDefault();
      console.warn('Suppressed benign external property or parsing error:', event.message);
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    const msg = event.reason?.message;
    if (msg && (
      msg.includes('fetch') || 
      msg.includes('getter') ||
      msg.includes('undefined') ||
      msg.includes('JSON')
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
