import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg)",
      flexDirection: "column",
      gap: "2rem"
    }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{
          fontSize: "1.75rem",
          fontWeight: 600,
          color: "var(--text)",
          letterSpacing: "-0.02em"
        }}>系統管理入口</h1>
        <p style={{ color: "var(--text-muted)", marginTop: "0.5rem", fontSize: "0.9rem" }}>
          登入後可存取已授權的系統
        </p>
      </div>
      <SignIn
        appearance={{
          elements: {
            rootBox: { width: "100%" },
            card: {
              background: "var(--bg2)",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              boxShadow: "none"
            },
            headerTitle: { color: "var(--text)" },
            headerSubtitle: { color: "var(--text-muted)" },
            formFieldLabel: { color: "var(--text-muted)" },
            formFieldInput: {
              background: "var(--bg3)",
              border: "1px solid var(--border)",
              color: "var(--text)",
              borderRadius: "8px"
            },
            footerActionText: { color: "var(--text-muted)" },
            footerActionLink: { color: "var(--accent)" },
          }
        }}
      />
    </div>
  );
}
