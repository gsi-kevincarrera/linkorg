// import { scan } from 'react-scan' // must be imported before React and React DOM
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// scan({
//   enabled: true,
// })

const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      })
      if (registration.installing) {
        console.log('Service worker installing')
      } else if (registration.waiting) {
        console.log('Service worker installed')
      } else if (registration.active) {
        console.log('Service worker active')
      }
    } catch (error) {
      console.error(`Registration failed with ${error}`)
    }
  }
}

createRoot(document.getElementById('root')!).render(
    <App />
)

registerServiceWorker()
