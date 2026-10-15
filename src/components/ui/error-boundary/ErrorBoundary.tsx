import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error('Uncaught error in component tree:', error, errorInfo)
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-[#050a14] text-[#f1f5f9] flex items-center justify-center p-6 font-mono">
          <div className="max-w-md w-full p-8 rounded-lg bg-[#0a1224] border border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.2)] text-center space-y-6">
            <div className="inline-flex p-4 rounded-full bg-red-500/10 text-red-400 border border-red-500/30">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-xl font-bold tracking-wider text-red-400 uppercase">
                [SYSTEM FAULT RECOVERY]
              </h1>
              <p className="text-xs text-[#94a3b8]">
                A critical rendering exception was intercepted. Operational telemetry preserved.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-[#050a14] border border-[#172847] rounded text-left text-[11px] text-[#ef4444] overflow-x-auto max-h-32">
                {this.state.error.message}
              </div>
            )}

            <button
              type="button"
              onClick={this.handleReset}
              className="w-full py-2.5 px-4 rounded bg-[#00d2ff] hover:bg-[#38bdf8] text-[#050a14] font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-[0_0_20px_rgba(0,210,255,0.4)]"
            >
              Reboot System Matrix
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
