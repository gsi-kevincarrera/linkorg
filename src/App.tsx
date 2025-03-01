import { Suspense } from 'react'
import './App.css'
import Board from './components/board'
import Navbar from './components/navigation/navbar'
import ErrorBoundary from './components/error-boundary'
import { Toaster } from '@/components/ui/sonner'

function App() {
  

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
      <Navbar />
      <ErrorBoundary fallback={<div>Error</div>}>
        <Suspense fallback={<div>Loading...</div>}>
          <Board />
        </Suspense>
      </ErrorBoundary>
      <Toaster  richColors position='top-center' theme='light'/>
    </div>
  )
}

export default App
