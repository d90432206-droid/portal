# React 系統 Clerk 整合說明
# 把這個套用到你的三個 React 系統（eopi / supaproject / supacali）

# ────────────────────────────────────────
# 步驟 1：安裝 Clerk SDK
# ────────────────────────────────────────
# npm install @clerk/clerk-react

# ────────────────────────────────────────
# 步驟 2：在 Vercel 加環境變數
# ────────────────────────────────────────
# 變數名稱：VITE_CLERK_PUBLISHABLE_KEY（如果用 Vite）
# 或：REACT_APP_CLERK_PUBLISHABLE_KEY（如果用 CRA）
# 值：pk_test_cmVhZHktdmlwZXItMjEuY2xlcmsuYWNjb3VudHMuZGV2JA

# ────────────────────────────────────────
# 步驟 3：修改 main.tsx / index.tsx
# ────────────────────────────────────────
# 把你原本的 main.tsx 改成這樣：

/*
import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App";

const PUBLISHABLE_KEY =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ||
  process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
*/

# ────────────────────────────────────────
# 步驟 4：保護需要登入的頁面（加到 App.tsx 或 Router）
# ────────────────────────────────────────
/*
import { useAuth, RedirectToSignIn } from "@clerk/clerk-react";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return <div>載入中...</div>;
  if (!isSignedIn) return <RedirectToSignIn redirectUrl="https://your-portal.vercel.app" />;

  return <>{children}</>;
}

// 用法：把原本的 <Route> 包起來
// <ProtectedRoute><YourComponent /></ProtectedRoute>
*/

# ────────────────────────────────────────
# 步驟 5：把未授權的用戶導回 Portal
# ────────────────────────────────────────
/*
import { useUser } from "@clerk/clerk-react";

function useSystemAccess(systemId: string) {
  const { user } = useUser();
  const allowed = (user?.publicMetadata?.systems as string[]) ?? [];
  return allowed.includes(systemId);
}

// 在 App 最上層加這個 check：
function AppGuard() {
  const hasAccess = useSystemAccess("eopi"); // 改成對應系統 ID
  
  if (!hasAccess) {
    window.location.href = "https://your-portal.vercel.app";
    return null;
  }
  
  return <App />;
}
*/
