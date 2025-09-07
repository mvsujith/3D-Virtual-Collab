import React from "react";

class WebGLErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state to trigger fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("WebGL Error Boundary caught an error:", error, errorInfo);

    // Check if it's a WebGL-related error
    const isWebGLError =
      error.message &&
      (error.message.includes("WebGL") ||
        error.message.includes("webgl") ||
        error.message.includes("context") ||
        error.message.includes("CONTEXT_LOST") ||
        error.message.includes("gpu") ||
        error.message.includes("GPU"));

    this.setState({
      hasError: true,
      errorInfo: {
        error,
        errorInfo,
        isWebGLError,
        timestamp: new Date().toISOString(),
      },
    });

    // Auto-reload for WebGL errors after a delay
    if (isWebGLError) {
      console.log("🔄 WebGL error detected, will auto-reload in 3 seconds...");
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleRetry = () => {
    this.setState({ hasError: false, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      const { errorInfo } = this.state;
      const isWebGLError = errorInfo?.isWebGLError;

      return (
        <div className="w-full h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
          <div className="max-w-md mx-auto text-center text-white p-8 bg-black/50 backdrop-blur-sm rounded-lg border border-gray-700">
            <div className="text-6xl mb-4">⚠️</div>

            <h1 className="text-2xl font-bold mb-4">
              {isWebGLError ? "WebGL Error" : "Application Error"}
            </h1>

            <p className="text-gray-300 mb-6">
              {isWebGLError
                ? "A WebGL context error has occurred. This usually happens when your graphics card runs out of memory or encounters a driver issue."
                : "An unexpected error has occurred in the application."}
            </p>

            {isWebGLError && (
              <div className="bg-yellow-900/30 border border-yellow-600/50 rounded-lg p-4 mb-6 text-left text-sm">
                <h3 className="font-semibold text-yellow-400 mb-2">
                  💡 Quick Fixes:
                </h3>
                <ul className="text-yellow-200 space-y-1">
                  <li>• Close other browser tabs using 3D graphics</li>
                  <li>• Update your graphics drivers</li>
                  <li>• Restart your browser</li>
                  <li>• Try in an incognito/private window</li>
                </ul>
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <button
                onClick={this.handleRetry}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={this.handleReload}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
              >
                Reload Page
              </button>
            </div>

            {process.env.NODE_ENV === "development" && errorInfo && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-gray-400 hover:text-white">
                  Debug Info
                </summary>
                <pre className="mt-2 text-xs bg-gray-800 p-3 rounded overflow-auto max-h-40">
                  {errorInfo.error.stack}
                </pre>
              </details>
            )}

            {isWebGLError && (
              <p className="text-sm text-gray-400 mt-4">
                Auto-reloading in 3 seconds...
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default WebGLErrorBoundary;
