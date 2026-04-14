/* ───────────  src/main.jsx  ─────────── */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';          // ← NEW
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />

      {/* Global toast portal – ONE per app */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style:   { background: '#fff', color: '#1e293b' },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
    </BrowserRouter>
  </StrictMode>
);
