import { Outlet, Link, useLocation } from "react-router-dom";

export function Layout() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">DC</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">
                Device Capabilities
              </span>
            </Link>

            {/* Navigation */}
            <nav className="flex space-x-1">
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/")
                    ? "bg-primary-100 text-primary-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                Home
              </Link>
              <Link
                to="/device"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/device")
                    ? "bg-primary-100 text-primary-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                Query by Device
              </Link>
              <Link
                to="/capability"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/capability")
                    ? "bg-primary-100 text-primary-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                Query by Capability
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
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <p>© 2025 Device Capabilities. Built with React + GraphQL.</p>
            <p>Version {import.meta.env.VITE_APP_VERSION || "1.0.0"}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
