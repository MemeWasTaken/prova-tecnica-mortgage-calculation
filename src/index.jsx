
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

/**
 * Application entry point.
 *
 * Mounts the React app on the `#root` element of `index.html`, wrapped in:
 *   - `StrictMode`: enables extra development-only checks (effects and
 *     renders may run twice in dev; this does not happen in production).
 *   - `BrowserRouter`: provides history-based routing to the whole app.
 *     Routes are declared in `App.jsx`.
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
