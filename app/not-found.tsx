export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] px-4 py-16 text-center">
      <h1 className="text-6xl font-bold text-navy-900 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-navy-800 mb-6">Página no encontrada</h2>
      <p className="text-gray-600 max-w-md mb-8">
        Lo sentimos, la página que estás buscando no existe o ha sido movida.
      </p>
      <a href="/" className="bg-navy-800 hover:bg-navy-900 text-white py-2 px-4 rounded-md inline-flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        Volver al inicio
      </a>
    </div>
  )
}

