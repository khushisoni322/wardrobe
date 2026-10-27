import { useEffect, useState } from "react";
import { LoaderCircle, LogOut, Shirt } from "lucide-react";

import App from "../App";
import AuthScreen from "./AuthScreen";
import { authAPI, getToken } from "../lib/api";

export default function AuthGate() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      if (!getToken()) {
        setLoading(false);
        return;
      }

      try {
        const result = await authAPI.me();

        if (!result?.success || !result?.user) {
          throw new Error("Please log in again.");
        }

        if (!cancelled) {
          setUser(result.user);
        }
      } catch (err) {
        authAPI.logout();

        if (!cancelled) {
          setError(err.message || "Please log in again.");
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  function handleAuthenticated(authenticatedUser) {
    setError("");
    setUser(authenticatedUser);
  }

  function handleLogout() {
    authAPI.logout();
    setUser(null);
    setError("");
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#faf9f6]">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-900 text-white">
            <Shirt size={28} />
          </div>

          <LoaderCircle
            size={25}
            className="animate-spin text-amber-700"
          />

          <p className="text-sm text-stone-500">
            Preparing your wardrobe...
          </p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <div>
        {error && (
          <div
            role="alert"
            className="fixed left-1/2 top-4 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 shadow-sm"
          >
            {error}
          </div>
        )}

        <AuthScreen onAuthenticated={handleAuthenticated} />
      </div>
    );
  }

  return (
    <>
      {/* IMPORTANT: user + logout App ko pass ho rahe hain */}
      <App user={user} onLogout={handleLogout} />

      <div className="fixed bottom-4 right-4 z-50 flex max-w-[calc(100%-2rem)] items-center gap-3 rounded-2xl border border-stone-200 bg-white/95 px-4 py-3 shadow-lg backdrop-blur">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 font-semibold text-amber-900">
          {(user.name || user.email || "U")
            .trim()
            .charAt(0)
            .toUpperCase()}
        </div>

        <div className="min-w-0">
          <p className="max-w-40 truncate text-sm font-semibold text-stone-800">
            {user.name || "Wardrobe user"}
          </p>

          <p className="max-w-40 truncate text-xs text-stone-500">
            {user.email || "No email"}
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="ml-1 inline-flex shrink-0 items-center gap-2 rounded-xl border border-stone-200 px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
          aria-label="Log out"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </>
  );
}