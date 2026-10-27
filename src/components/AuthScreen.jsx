import { useState } from "react";
import { Shirt, Eye, EyeOff, LoaderCircle, ArrowRight } from "lucide-react";
import { authAPI } from "../lib/api";

export default function AuthScreen({ onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isRegister = mode === "register";

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();

    if (isRegister && !name) {
      setError("Please enter your full name.");
      return;
    }

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    if (!form.password) {
      setError("Please enter your password.");
      return;
    }

    if (isRegister && form.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      let result;

      if (isRegister) {
        result = await authAPI.register({
          name,
          email,
          password: form.password,
        });
      } else {
        result = await authAPI.login({
          email,
          password: form.password,
        });
      }

      if (!result?.success || !result?.token || !result?.user) {
        throw new Error(
          result?.message || "Authentication could not be completed."
        );
      }

      setSuccess(
        isRegister
          ? "Account created successfully!"
          : "Login successful!"
      );

      onAuthenticated(result.user);
    } catch (err) {
      setError(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function switchMode() {
    setMode((previous) =>
      previous === "login" ? "register" : "login"
    );

    setError("");
    setSuccess("");
    setForm({
      name: "",
      email: form.email,
      password: "",
    });
  }

  return (
    <main className="min-h-screen bg-[#faf9f6] text-stone-800">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left: Brand section */}
        <section className="relative hidden overflow-hidden bg-[#29251f] px-12 py-12 text-white lg:flex lg:flex-col lg:justify-between xl:px-20">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-amber-700/20 blur-3xl" />

          <div className="relative flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-700">
              <Shirt size={25} />
            </div>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                wardrobe<span className="text-amber-500">.</span>
              </h1>

              <p className="text-xs tracking-widest text-stone-400">
                YOUR PERSONAL CLOSET
              </p>
            </div>
          </div>

          <div className="relative max-w-xl">
            <span className="mb-5 inline-block rounded-full border border-white/15 px-4 py-2 text-xs tracking-wider text-amber-200">
              YOUR STYLE, YOUR SPACE
            </span>

            <h2 className="text-5xl font-light leading-tight xl:text-6xl">
              Every outfit.
              <br />
              Every memory.
              <br />
              <span className="font-semibold text-amber-400">
                One wardrobe.
              </span>
            </h2>

            <p className="mt-6 max-w-md text-base leading-7 text-stone-300">
              Organise your clothes, discover your favourite pieces
              and bring your family&apos;s wardrobe together in one place.
            </p>

            <div className="mt-10 flex items-center gap-3">
              <div className="flex -space-x-2">
                {["👩🏻", "👨🏻", "👧🏻", "👵🏻"].map((emoji, index) => (
                  <span
                    key={index}
                    className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#29251f] bg-[#f4e7d1] text-xl"
                  >
                    {emoji}
                  </span>
                ))}
              </div>

              <p className="text-sm text-stone-300">
                Made for your everyday style
              </p>
            </div>
          </div>

          <p className="relative text-xs text-stone-500">
            Your clothes. Your collection. Your story.
          </p>
        </section>

        {/* Right: Authentication form */}
        <section className="flex items-center justify-center px-5 py-10 sm:px-10">
          <div className="w-full max-w-md">
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-900 text-white">
                <Shirt size={23} />
              </div>

              <h1 className="text-2xl font-semibold tracking-tight">
                wardrobe<span className="text-amber-700">.</span>
              </h1>
            </div>

            <div className="mb-8">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[3px] text-amber-800">
                YOUR STYLE STARTS HERE
              </p>

              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {isRegister ? "Create your account" : "Welcome back"}
              </h2>

              <p className="mt-3 text-sm leading-6 text-stone-500">
                {isRegister
                  ? "Create your account and start organising your wardrobe."
                  : "Sign in to continue to your personal wardrobe."}
              </p>
            </div>

            <div className="mb-7 grid grid-cols-2 rounded-2xl bg-stone-100 p-1">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError("");
                  setSuccess("");
                }}
                className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                  !isRegister
                    ? "bg-white text-stone-900 shadow-sm"
                    : "text-stone-500 hover:text-stone-900"
                }`}
              >
                Login
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError("");
                  setSuccess("");
                }}
                className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isRegister
                    ? "bg-white text-stone-900 shadow-sm"
                    : "text-stone-500 hover:text-stone-900"
                }`}
              >
                Register
              </button>
            </div>

            {error && (
              <div
                role="alert"
                className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
              >
                {error}
              </div>
            )}

            {success && (
              <div
                role="status"
                className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
              >
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {isRegister && (
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-stone-700"
                  >
                    Full name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    maxLength={100}
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    disabled={loading}
                    className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-stone-400 focus:border-amber-700 focus:ring-4 focus:ring-amber-700/10 disabled:opacity-60"
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-stone-700"
                >
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  maxLength={254}
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  disabled={loading}
                  className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-stone-400 focus:border-amber-700 focus:ring-4 focus:ring-amber-700/10 disabled:opacity-60"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-stone-700"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={
                      isRegister ? "new-password" : "current-password"
                    }
                    value={form.password}
                    onChange={handleChange}
                    placeholder={
                      isRegister
                        ? "At least 8 characters"
                        : "Enter your password"
                    }
                    required
                    disabled={loading}
                    className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3.5 pr-12 text-sm outline-none transition placeholder:text-stone-400 focus:border-amber-700 focus:ring-4 focus:ring-amber-700/10 disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((previous) => !previous)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {isRegister && (
                <p className="text-xs leading-5 text-stone-500">
                  Use a password with at least 8 characters.
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-stone-900 px-5 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-stone-800 focus:outline-none focus:ring-4 focus:ring-stone-900/15 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <LoaderCircle size={19} className="animate-spin" />
                    Please wait...
                  </>
                ) : (
                  <>
                    {isRegister ? "Create account" : "Login to Wardrobe"}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-stone-500">
              {isRegister
                ? "Already have an account?"
                : "New to Wardrobe?"}{" "}
              <button
                type="button"
                onClick={switchMode}
                disabled={loading}
                className="font-semibold text-amber-800 hover:text-amber-900 disabled:opacity-60"
              >
                {isRegister ? "Login instead" : "Create an account"}
              </button>
            </p>

            <p className="mt-10 text-center text-xs leading-5 text-stone-400">
              Your account is personal. Only join families you trust.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}