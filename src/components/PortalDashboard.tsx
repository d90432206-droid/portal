"use client";
import { useState, useEffect } from "react";
import { useClerk } from "@clerk/nextjs";

const ALL_SYSTEMS = [
  {
    id: "eopi",
    name: "EOPI 系統",
    description: "主要業務管理系統",
    url: "https://eopi-seven.vercel.app/#/login",
    color: "#7c6af7",
    icon: "◈",
  },
  {
    id: "supaproject",
    name: "Supa Project",
    description: "專案管理平台",
    url: "https://supaproject.vercel.app/",
    color: "#34d399",
    icon: "⬡",
  },
  {
    id: "supacali",
    name: "Supacali",
    description: "資料管理系統",
    url: "https://supacali-xzgd.vercel.app/",
    color: "#fbbf24",
    icon: "◎",
  },
  {
    id: "iso17025",
    name: "ISO 17025",
    description: "即將上線",
    url: "#",
    color: "#f87171",
    icon: "◐",
    comingSoon: true,
  },
  {
    id: "inquiry",
    name: "詢價系統",
    description: "即將上線",
    url: "#",
    color: "#60a5fa",
    icon: "◑",
    comingSoon: true,
  },
];

type SystemId = string;

interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string;
  systems: SystemId[];
  role: string;
}

interface Props {
  userName: string;
  userEmail: string;
  userImageUrl: string;
  allowedSystems: SystemId[];
  isAdmin: boolean;
}

export default function PortalDashboard({ userName, userEmail, userImageUrl, allowedSystems, isAdmin }: Props) {
  const { signOut } = useClerk();
  const [tab, setTab] = useState<"portal" | "admin">("portal");
  const [users, setUsers] = useState<User[]>([]);
  const [saving, setSaving] = useState<string | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    if (tab === "admin" && isAdmin) {
      setLoadingUsers(true);
      fetch("/api/admin/users")
        .then((r) => r.json())
        .then((data) => { setUsers(data); setLoadingUsers(false); });
    }
  }, [tab, isAdmin]);

  const toggleSystem = async (userId: string, systemId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;
    const newSystems = user.systems.includes(systemId)
      ? user.systems.filter((s) => s !== systemId)
      : [...user.systems, systemId];

    setSaving(userId + systemId);
    await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, systems: newSystems, role: user.role }),
    });
    setUsers((prev) =>
      prev.map((u) => u.id === userId ? { ...u, systems: newSystems } : u)
    );
    setSaving(null);
  };

  const toggleRole = async (userId: string, currentRole: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;
    const newRole = currentRole === "admin" ? "user" : "admin";
    setSaving(userId + "role");
    await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, systems: user.systems, role: newRole }),
    });
    setUsers((prev) =>
      prev.map((u) => u.id === userId ? { ...u, role: newRole } : u)
    );
    setSaving(null);
  };

  const visibleSystems = isAdmin ? ALL_SYSTEMS : ALL_SYSTEMS.filter((s) => allowedSystems.includes(s.id));

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header style={{
        borderBottom: "1px solid var(--border)",
        padding: "0 2rem",
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "var(--bg2)",
        position: "sticky",
        top: 0,
        zIndex: 10
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <span style={{ fontWeight: 700, fontSize: "1.1rem", letterSpacing: "-0.02em", color: "var(--text)" }}>
            ⬡ Portal
          </span>
          <nav style={{ display: "flex", gap: "0.25rem" }}>
            <TabBtn active={tab === "portal"} onClick={() => setTab("portal")}>系統入口</TabBtn>
            {isAdmin && <TabBtn active={tab === "admin"} onClick={() => setTab("admin")}>用戶管理</TabBtn>}
          </nav>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <img src={userImageUrl} alt={userName} style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid var(--border)" }} />
          <div style={{ lineHeight: 1.3 }}>
            <div style={{ fontSize: "0.85rem", fontWeight: 500 }}>{userName}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{userEmail}</div>
          </div>
          <button onClick={() => signOut({ redirectUrl: "/sign-in" })} style={{
            background: "transparent",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            color: "var(--text-muted)",
            fontSize: "0.8rem",
            padding: "0.35rem 0.75rem",
            cursor: "pointer"
          }}>登出</button>
        </div>
      </header>

      <main style={{ flex: 1, padding: "2.5rem 2rem", maxWidth: "960px", margin: "0 auto", width: "100%" }}>
        {tab === "portal" && (
          <>
            <div style={{ marginBottom: "2rem", animation: "fadeUp 0.4s ease" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 600, letterSpacing: "-0.02em" }}>
                歡迎，{userName} 👋
              </h2>
              <p style={{ color: "var(--text-muted)", marginTop: "0.4rem", fontSize: "0.9rem" }}>
                {isAdmin ? "管理員帳號，可存取所有系統" : `你有 ${visibleSystems.filter(s => !s.comingSoon).length} 個可用系統`}
              </p>
            </div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "1rem"
            }}>
              {visibleSystems.map((sys, i) => (
                <SystemCard key={sys.id} system={sys} delay={i * 60} />
              ))}
            </div>
          </>
        )}

        {tab === "admin" && isAdmin && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <div style={{ marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 600, letterSpacing: "-0.02em" }}>用戶權限管理</h2>
              <p style={{ color: "var(--text-muted)", marginTop: "0.4rem", fontSize: "0.9rem" }}>
                勾選每位用戶可以存取的系統，變更即時生效
              </p>
            </div>

            {loadingUsers ? (
              <div style={{ color: "var(--text-muted)", textAlign: "center", padding: "3rem" }}>載入用戶中...</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {users.map((u) => (
                  <div key={u.id} style={{
                    background: "var(--bg2)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    padding: "1rem 1.25rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    flexWrap: "wrap"
                  }}>
                    <img src={u.imageUrl} alt={u.email} style={{ width: 38, height: 38, borderRadius: "50%", flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: "160px" }}>
                      <div style={{ fontWeight: 500, fontSize: "0.9rem" }}>{u.firstName ?? ""} {u.lastName ?? ""}</div>
                      <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{u.email}</div>
                    </div>

                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
                      {ALL_SYSTEMS.filter(s => !s.comingSoon).map((sys) => {
                        const on = u.systems.includes(sys.id);
                        const loading = saving === u.id + sys.id;
                        return (
                          <button
                            key={sys.id}
                            onClick={() => toggleSystem(u.id, sys.id)}
                            disabled={loading}
                            style={{
                              padding: "0.3rem 0.7rem",
                              borderRadius: "6px",
                              fontSize: "0.78rem",
                              fontWeight: 500,
                              cursor: loading ? "wait" : "pointer",
                              border: on ? "none" : "1px solid var(--border)",
                              background: on ? sys.color + "33" : "transparent",
                              color: on ? sys.color : "var(--text-muted)",
                              transition: "all 0.15s",
                              opacity: loading ? 0.6 : 1
                            }}
                          >
                            {sys.icon} {sys.name}
                          </button>
                        );
                      })}

                      <button
                        onClick={() => toggleRole(u.id, u.role)}
                        disabled={saving === u.id + "role"}
                        style={{
                          padding: "0.3rem 0.7rem",
                          borderRadius: "6px",
                          fontSize: "0.78rem",
                          fontWeight: 500,
                          cursor: "pointer",
                          border: u.role === "admin" ? "none" : "1px solid var(--border)",
                          background: u.role === "admin" ? "rgba(248,113,113,0.2)" : "transparent",
                          color: u.role === "admin" ? "var(--red)" : "var(--text-muted)",
                          transition: "all 0.15s"
                        }}
                      >
                        {u.role === "admin" ? "★ 管理員" : "☆ 一般"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function TabBtn({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      padding: "0.35rem 0.85rem",
      borderRadius: "8px",
      fontSize: "0.85rem",
      fontWeight: 500,
      cursor: "pointer",
      border: "none",
      background: active ? "var(--bg3)" : "transparent",
      color: active ? "var(--text)" : "var(--text-muted)",
      transition: "all 0.15s"
    }}>
      {children}
    </button>
  );
}

function SystemCard({ system, delay }: { system: typeof ALL_SYSTEMS[0]; delay: number }) {
  const [hover, setHover] = useState(false);

  return (
    <a
      href={system.comingSoon ? undefined : system.url}
      target={system.comingSoon ? undefined : "_blank"}
      rel="noopener noreferrer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "block",
        textDecoration: "none",
        background: hover && !system.comingSoon ? "var(--bg3)" : "var(--bg2)",
        border: `1px solid ${hover && !system.comingSoon ? system.color + "55" : "var(--border)"}`,
        borderRadius: "14px",
        padding: "1.5rem",
        cursor: system.comingSoon ? "default" : "pointer",
        transition: "all 0.2s",
        animation: `fadeUp 0.4s ease ${delay}ms both`,
        opacity: system.comingSoon ? 0.5 : 1,
        position: "relative",
        overflow: "hidden"
      }}
    >
      {hover && !system.comingSoon && (
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: "2px",
          background: system.color,
          borderRadius: "14px 14px 0 0"
        }} />
      )}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <span style={{ fontSize: "1.8rem", color: system.color }}>{system.icon}</span>
        {system.comingSoon
          ? <span style={{ fontSize: "0.72rem", padding: "0.2rem 0.5rem", background: "rgba(255,255,255,0.06)", borderRadius: "4px", color: "var(--text-muted)" }}>即將推出</span>
          : <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>→ 開啟</span>
        }
      </div>
      <div style={{ fontWeight: 600, fontSize: "1rem", marginBottom: "0.3rem" }}>{system.name}</div>
      <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{system.description}</div>
    </a>
  );
}
