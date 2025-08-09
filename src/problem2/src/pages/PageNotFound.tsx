export default function PageNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800 p-4">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-blue-600 drop-shadow-lg animate-bounce-slow">404</h1>
        <p className="text-3xl md:text-4xl font-bold mt-4 mb-2">Page Not Found</p>
        <p className="text-lg md:text-xl text-gray-600 mb-8">Oops! The page you're looking for doesn't exist.</p>
        <a
          href="/"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          Go to Homepage
        </a>
      </div>
    </div>
  );
}
