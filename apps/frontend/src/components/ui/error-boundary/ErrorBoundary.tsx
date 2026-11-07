import { Component, type ErrorInfo, type ReactNode } from 'react'
import { clientLogger } from '@/services/logger/clientLogger'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  isCopied: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    isCopied: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null, isCopied: false }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo })

    // Central Automated Error Logging for Users & System
    try {
      clientLogger.log({
        name: error.name || 'ComponentCrash',
        message: error.message || 'React render crash occurred in component tree',
        stack: errorInfo.componentStack || error.stack,
        level: 'critical',
      })
    } catch {
      // Fallback
    }

    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error('Uncaught error in component tree:', error, errorInfo)
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null, isCopied: false })
    window.location.reload()
  }

  private handleCopyDiagnostic = async () => {
    try {
      const diagnosticReport = {
        title: 'Kietfolio System Exception Diagnostic Report',
        timestamp: new Date().toISOString(),
        error: {
          name: this.state.error?.name,
          message: this.state.error?.message,
          stack: this.state.error?.stack,
          componentStack: this.state.errorInfo?.componentStack,
        },
        clientTelemetry: clientLogger.getClientContext(),
      }

      await navigator.clipboard.writeText(JSON.stringify(diagnosticReport, null, 2))
      this.setState({ isCopied: true })
      setTimeout(() => this.setState({ isCopied: false }), 3000)
    } catch {
      // ignore clipboard error
    }
  }

  private handleDownloadLog = () => {
    clientLogger.downloadLogsFile()
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-[#050a14] text-[#f1f5f9] flex items-center justify-center p-4 sm:p-6 font-mono">
          <div className="max-w-lg w-full p-6 sm:p-8 rounded-lg bg-[#0a1224] border border-red-500/40 shadow-[0_0_50px_rgba(239,68,68,0.25)] text-center space-y-5">
            <div className="inline-flex p-3 sm:p-4 rounded-full bg-red-500/10 text-red-400 border border-red-500/30">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <div className="space-y-1.5">
              <h1 className="text-lg sm:text-xl font-bold tracking-wider text-red-400 uppercase">
                [SYSTEM FAULT RECOVERY]
              </h1>
              <p className="text-xs text-[#94a3b8]">
                Ngoại lệ giao diện đã được chặn và ghi nhận vào hệ thống nhật ký lỗi trung tâm (Error Telemetry).
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-[#050a14] border border-[#172847] rounded text-left text-[11px] text-[#ef4444] overflow-x-auto max-h-36 font-mono">
                <div className="font-bold text-red-300 mb-1">
                  {this.state.error.name}: {this.state.error.message}
                </div>
                {this.state.error.stack && (
                  <pre className="text-[10px] text-slate-500 leading-tight whitespace-pre-wrap">
                    {this.state.error.stack.slice(0, 500)}...
                  </pre>
                )}
              </div>
            )}

            {/* Diagnostic Actions for Users */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={this.handleCopyDiagnostic}
                className="py-2 px-3 rounded border border-[#172847] bg-[#0f1b33] hover:border-[#00d2ff] hover:text-[#00d2ff] text-slate-300 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>{this.state.isCopied ? '✓ Đã sao chép!' : '📋 Sao chép mã lỗi'}</span>
              </button>

              <button
                type="button"
                onClick={this.handleDownloadLog}
                className="py-2 px-3 rounded border border-[#172847] bg-[#0f1b33] hover:border-[#00d2ff] hover:text-[#00d2ff] text-slate-300 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>💾 Tải file Log</span>
              </button>
            </div>

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
