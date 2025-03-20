export default function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "70vh",
        padding: "1rem",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: "3.75rem",
          fontWeight: "bold",
          color: "#1a2234",
          marginBottom: "1rem",
        }}
      >
        404
      </h1>
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: "semibold",
          color: "#2d3a4f",
          marginBottom: "1.5rem",
        }}
      >
        Página no encontrada
      </h2>
      <p
        style={{
          color: "#4b5563",
          maxWidth: "28rem",
          marginBottom: "2rem",
        }}
      >
        Lo sentimos, la página que estás buscando no existe o ha sido movida.
      </p>
      <a
        href="/"
        style={{
          backgroundColor: "#2d3a4f",
          color: "white",
          padding: "0.5rem 1rem",
          borderRadius: "0.375rem",
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
        }}
      >
        Volver al inicio
      </a>
    </div>
  )
}

