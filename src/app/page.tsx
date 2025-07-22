import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AutoPR
          </h1>
          <p className="text-gray-600">
            Media Coverage Report Generator
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h2 className="font-semibold text-blue-900 mb-2">
              📄 PDF Generator Ready
            </h2>
            <p className="text-sm text-blue-700 mb-4">
              Transform JSON media data into professional client reports
            </p>
            <Link 
              href="/test-pdf"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
            >
              Test PDF Generation
            </Link>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-2">API Endpoints</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <div><code className="bg-gray-200 px-2 py-1 rounded text-xs">POST /api/generate-pdf</code></div>
              <div><code className="bg-gray-200 px-2 py-1 rounded text-xs">GET /api/test-pdf</code></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
