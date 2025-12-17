import { Outlet, Link, useLocation } from "react-router-dom";
import { Smartphone, Radio, Home } from "lucide-react";

export function Layout() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <Smartphone className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-gray-900">
                  Device Capabilities
                </span>
                <p className="text-xs text-gray-500">Query Tool</p>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center space-x-1">
              <Link
                to="/"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive("/")
                    ? "bg-primary-100 text-primary-700 shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
              <Link
                to="/device"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive("/device")
                    ? "bg-primary-100 text-primary-700 shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span className="hidden sm:inline">By Device</span>
              </Link>
              <Link
                to="/capability"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive("/capability")
                    ? "bg-primary-100 text-primary-700 shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Radio className="w-4 h-4" />
                <span className="hidden sm:inline">By Capability</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <p className="text-center sm:text-left">
              © 2024 Device Capabilities. Built with React + GraphQL +
              TypeScript.
            </p>
            <div className="flex items-center space-x-4">
              <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-medium">
                v{import.meta.env.VITE_APP_VERSION || "1.0.0"}
              </span>
              <a
                href="http://localhost:3000/graphql"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-600 transition-colors"
              >
                GraphQL Playground
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
