import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#060810",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        gap: 24,
      }}
    >
      <div
        style={{
          fontSize: 96,
          fontWeight: 800,
          color: "#0052FF",
          lineHeight: 1,
          letterSpacing: "-0.04em",
        }}
      >
        404
      </div>

      <div
        style={{
          fontSize: 22,
          fontWeight: 600,
          color: "white",
          letterSpacing: "-0.01em",
        }}
      >
        Page not found
      </div>

      <div
        style={{
          fontSize: 15,
          color: "rgba(255,255,255,0.4)",
          maxWidth: 360,
          textAlign: "center",
          lineHeight: 1.6,
        }}
      >
        The page you are looking for does not exist or may have moved.
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
        <button
          onClick={() => setLocation("/")}
          style={{
            padding: "10px 24px",
            borderRadius: 10,
            background: "#0052FF",
            color: "white",
            fontSize: 14,
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
          }}
        >
          Go to Home
        </button>
        <button
          onClick={() => setLocation("/app")}
          style={{
            padding: "10px 24px",
            borderRadius: 10,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "rgba(255,255,255,0.65)",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Open LocalOS
        </button>
      </div>
    </div>
  );
}
