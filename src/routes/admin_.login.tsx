import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/admin_/login")({
  head: () => ({ meta: [{ title: "تسجيل الدخول — لوحة التحكم" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { signIn, session, loading } = useAuth();
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const tt = (ar: string, en: string) => (lang === "ar" ? ar : en);

  useEffect(() => {
    if (!loading && session) navigate({ to: "/admin" });
  }, [loading, session, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const { error } = await signIn(email.trim(), password);
    setBusy(false);
    if (error) {
      setError(tt("بيانات الدخول غير صحيحة.", "Invalid login credentials."));
      return;
    }
    navigate({ to: "/admin" });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-background px-4"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-full bg-text-primary text-background flex items-center justify-center text-lg font-bold mb-3">
            {lang === "ar" ? "ف" : "P"}
          </div>
          <h1 className="text-2xl font-bold text-text-primary">
            {tt("لوحة التحكم", "Admin Panel")}
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            {tt("سجّل الدخول للمتابعة", "Sign in to continue")}
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-text-primary mb-1">
              {tt("البريد الإلكتروني", "Email")}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 px-3 rounded-[12px] bg-surface border border-border text-sm focus:outline-none focus:ring-2 focus:ring-text-primary/20"
            />
          </div>
          <div>
            <label className="block text-sm text-text-primary mb-1">
              {tt("كلمة المرور", "Password")}
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 px-3 rounded-[12px] bg-surface border border-border text-sm focus:outline-none focus:ring-2 focus:ring-text-primary/20"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-[10px] px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full h-11 rounded-[12px] bg-text-primary text-background text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {busy ? tt("جارٍ الدخول...", "Signing in...") : tt("دخول", "Sign in")}
          </button>
        </form>
      </div>
    </div>
  );
}
