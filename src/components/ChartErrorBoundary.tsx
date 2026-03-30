import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

export class ChartErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
            Chart failed to load. Data is still being collected.
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
