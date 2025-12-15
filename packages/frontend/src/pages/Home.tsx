import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Device Capabilities Query Tool
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Query smartphone and device capabilities across different telecom
          providers. Search by device or by specific RF capabilities.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Query by Device Card */}
        <Link
          to="/device"
          className="card hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary-200 transition-colors">
              <svg
                className="w-6 h-6 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Query by Device
              </h2>
              <p className="text-gray-600">
                Search for a specific device and see all its global capabilities
                or filter by a specific telecom provider.
              </p>
            </div>
          </div>
        </Link>

        {/* Query by Capability Card */}
        <Link
          to="/capability"
          className="card hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary-200 transition-colors">
              <svg
                className="w-6 h-6 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Query by Capability
              </h2>
              <p className="text-gray-600">
                Search for devices that support a specific band, combo, or
                feature. Filter by telecom provider.
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Features Section */}
      <div className="mt-16 max-w-4xl mx-auto">
        <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
          Features
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h4 className="font-medium text-gray-900 mb-1">Advanced Search</h4>
            <p className="text-sm text-gray-600">
              Filter by vendor, model, technology, and more
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h4 className="font-medium text-gray-900 mb-1">Provider Support</h4>
            <p className="text-sm text-gray-600">
              See capabilities for Telus, Rogers, Bell, and more
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h4 className="font-medium text-gray-900 mb-1">Real-time Data</h4>
            <p className="text-sm text-gray-600">
              GraphQL-powered instant results
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
