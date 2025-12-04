export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-red-800 flex items-center justify-center p-4">
      <div className="bg-none border border-cyan-900 items-center rounded-lg p-8 max-w-md w-full">
        <div className="mx-auto flex flex-col items-center">
          <svg class="h-32 w-32 text-yellow-200 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">  <circle cx="9" cy="21" r="1" />  <circle cx="20" cy="21" r="1" />  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
          <h1 className=" text-3xl font-bold text-yellow-200 mb-4">
            SANS ECOMMERCE
          </h1>
          <hr></hr>
          <p className="text-orange-200 text-center my-4">
            Your one-stop shop for everything you need. Explore our wide range of products and enjoy seamless shopping experience.
          </p>
          <button className="border border-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-800 transition-colors mx-auto flex items-center gap-2">
            <svg className="h-8 w-8 text-yellow-500" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" />
              <path d="M4 13a8 8 0 0 1 7 7a6 6 0 0 0 3 -5a9 9 0 0 0 6 -8a3 3 0 0 0 -3 -3a9 9 0 0 0 -8 6a6 6 0 0 0 -5 3" />
              <path d="M7 14a6 6 0 0 0 -3 6a6 6 0 0 0 6 -3" />
              <circle cx="15" cy="9" r="1" />
            </svg>
            Still Developing
          </button>
        </div>
      </div>
    </div>
  )
}