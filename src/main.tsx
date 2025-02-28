import { scan } from 'react-scan' // must be imported before React and React DOM
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

scan({
  enabled: true,
})

createRoot(document.getElementById('root')!).render(
    <App />
)
