import { Component, type ErrorInfo, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryState {
  errorMessage: string | null;
}

class AppErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { errorMessage: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { errorMessage: error?.message || 'Unexpected application error.' };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Kaka-to-Bazara render error:', error, info);
  }

  render() {
    if (this.state.errorMessage) {
      return (
        <div className="min-h-screen bg-[#FAF8F5] text-[#1C241F] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white border border-[#E5E0D5] rounded-2xl p-6 space-y-3">
            <h1 className="text-lg font-semibold text-[#1B4332]">Kaka-to-Bazara</h1>
            <p className="text-sm text-[#525E56]">
              Something went wrong while loading the page: {this.state.errorMessage}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-xl bg-[#1B4332] text-white text-sm font-medium cursor-pointer"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <AppErrorBoundary>
    <App />
  </AppErrorBoundary>
);
