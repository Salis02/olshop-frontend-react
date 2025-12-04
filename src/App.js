export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-indigo-600 mb-4">
          🛍️ Hello Tailwind!
        </h1>
        <p className="text-gray-600 mb-4">
          Tailwind CSS is working perfectly!
        </p>
        <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
          Get Started
        </button>
      </div>
    </div>
  )
}