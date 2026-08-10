import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Lock, Mail, Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Silakan isi email dan kata sandi.");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password,
    });

    if (error) {
      setLoading(false);
      toast.error(error.message || "Gagal masuk. Periksa email dan password Anda.");
    } else if (data.session) {
      toast.success("Login berhasil! Selamat datang kembali.");
      navigate({ to: "/admin" });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative torn-paper blobs in brand colors */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-yellow opacity-40 rounded-br-[80px] rotate-6 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-sky opacity-30 rounded-tl-[100px] -rotate-6 pointer-events-none" />
      <div className="absolute top-1/3 right-8 w-12 h-12 bg-red opacity-20 rounded-full pointer-events-none" />
      <div className="absolute bottom-1/3 left-8 w-8 h-8 bg-violet opacity-20 rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo / Brand */}
        <div className="text-center mb-8 space-y-3">
          <div className="flex justify-center">
            <LoginLogo />
          </div>
          <p className="text-xs font-sans text-muted-foreground flex items-center justify-center gap-1.5 border border-ink/20 rounded-full px-3 py-1 w-fit mx-auto bg-paper">
            <ShieldCheck className="h-3.5 w-3.5 text-violet" />
            Portal Administrator
          </p>
        </div>

        {/* Login Card — paper style with ink border + cut shadow */}
        <div className="bg-paper border border-ink rounded-sm shadow-cut p-8 space-y-6">
          <div className="border-b border-ink/20 pb-4">
            <h1 className="text-xl font-bold font-sans text-ink tracking-tight">Masuk ke Admin CMS</h1>
            <p className="text-xs text-muted-foreground mt-1">Kelola produk, galeri, dan pengaturan situs.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-bold text-ink uppercase tracking-widest">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@markasmerchan.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 bg-note border-ink rounded-sm focus:ring-violet focus:border-violet text-ink placeholder:text-ink/30 h-11"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-bold text-ink uppercase tracking-widest">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 pr-10 bg-note border-ink rounded-sm focus:ring-violet focus:border-violet text-ink placeholder:text-ink/30 h-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-ink text-paper font-bold font-sans text-sm tracking-wide rounded-sm shadow-cut hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="animate-pulse">Memproses...</span>
              ) : (
                <>
                  <span>Masuk Sekarang</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>


        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          <a href="/" className="hover:text-ink underline underline-offset-2 transition-colors">
            ← Kembali ke Storefront
          </a>
        </p>
      </div>
    </div>
  );
}

/* Inline ransom-note Logo matching the brand Logo.tsx component */
const COLORS = ["bg-red", "bg-sky", "bg-yellow", "bg-violet", "bg-ink", "bg-paper"];
const FG = ["text-paper", "text-ink", "text-ink", "text-paper", "text-yellow", "text-red"];

function LoginLetters({ word, offset = 0 }: { word: string; offset?: number }) {
  return (
    <span className="inline-flex flex-wrap justify-center">
      {word.split("").map((ch, i) => {
        const k = (i + offset) % COLORS.length;
        const rot = ((i + offset) % 5) - 2;
        return (
          <span
            key={`${ch}-${i}`}
            className={`hairline inline-block px-[0.12em] py-[0.02em] leading-[0.9] ${COLORS[k]} ${FG[k]} ${i % 2 === 0 ? "font-serif italic" : "font-sans"}`}
            style={{ transform: `rotate(${rot}deg) translateY(${(i % 3) - 1}px)` }}
          >
            {ch}
          </span>
        );
      })}
    </span>
  );
}

function LoginLogo() {
  return (
    <span className="inline-flex flex-col items-center font-bold uppercase text-4xl">
      <span className="sr-only">MarkasMerchan</span>
      <span aria-hidden="true" className="-mb-[0.12em]">
        <LoginLetters word="MARKAS" />
      </span>
      <span aria-hidden="true">
        <LoginLetters word="MERCHAN" offset={3} />
      </span>
    </span>
  );
}
