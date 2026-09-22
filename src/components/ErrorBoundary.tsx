import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Trash2, Home } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught React rendering error in ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetCache = () => {
    try {
      localStorage.removeItem("codemaster_progress");
      sessionStorage.clear();
    } catch (e) {
      console.warn("Failed to clear storage:", e);
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 font-sans">
          <div className="max-w-lg w-full rounded-2xl border border-rose-500/30 bg-slate-900/90 p-6 sm:p-8 shadow-2xl shadow-rose-950/30 space-y-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertTriangle className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-bold text-white tracking-tight">
                页面渲染遇到意外错误
              </h1>
              <p className="text-sm text-slate-400 leading-relaxed">
                应用遇到未预期的运行时异常（可能是由于旧版学习记录缓存不兼容导致）。您可以尝试刷新或一键修复本地进度缓存。
              </p>
            </div>

            {this.state.error && (
              <div className="text-left rounded-xl bg-slate-950 border border-slate-800 p-3.5 text-xs font-mono text-rose-300 overflow-x-auto max-h-36">
                <div className="font-bold text-slate-400 mb-1">错误诊断信息:</div>
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={this.handleReload}
                className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
              >
                <RefreshCw className="h-4 w-4" />
                <span>刷新并重试</span>
              </button>

              <button
                onClick={this.handleResetCache}
                className="flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-rose-950/40 hover:text-rose-300 hover:border-rose-500/40 border border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-300 transition-all active:scale-95"
              >
                <Trash2 className="h-4 w-4 text-rose-400" />
                <span>修复并重置学习缓存</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
