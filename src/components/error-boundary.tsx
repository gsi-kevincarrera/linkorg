import { Component, ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode 
  fallback: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Algo salió mal:</h2>
          <p>{String(this.state.error) || 'Error desconocido'}</p>
          {this.props.fallback}
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
