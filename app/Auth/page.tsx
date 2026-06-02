"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import "../globals.css";

// Supabase imports
import { supabase } from "../../lib/supabase";

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // Penjaga URL: Memastikan pengunjung datang dari /pricing atau /checkout
    const hasPaid = sessionStorage.getItem("hasPaid");
    const isTrial = searchParams.get("trial");
    if (!hasPaid && !isTrial) {
      router.push("/pricing");
    }
  }, [router, searchParams]);

  const checkUserStoreAndRedirect = async (uid: string, userEmail: string | null) => {
    // Cari toko yang dimiliki oleh uid ini
    const { data: stores, error } = await supabase
      .from("stores")
      .select("*")
      .eq("owner_uid", uid);

    if (error) {
      console.error("Error fetching stores:", error);
      setErrorMsg("Gagal memeriksa data toko.");
      return;
    }

    if (stores && stores.length > 0) {
      // Toko ditemukan
      const storeData = stores[0];
      const slug = storeData.slug;
      
      sessionStorage.setItem("isLoggedIn", "true");
      sessionStorage.setItem("userEmail", userEmail || "");
      sessionStorage.setItem("userRole", "Admin");
      sessionStorage.setItem("storeSlug", slug);
      sessionStorage.setItem("storeName", storeData.name);
      
      router.push(`/${slug}/dashboard/admin`);
    } else {
      // Tidak punya toko, arahkan ke setup
      sessionStorage.setItem("isLoggedIn", "true");
      sessionStorage.setItem("userEmail", userEmail || "");
      router.push("/setup-store");
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
      // Note: Supabase OAuth akan me-redirect halaman, jadi eksekusi di bawah ini mungkin tidak langsung jalan
      // Pengecekan toko idealnya dilakukan di halaman callback atau melalui listener onAuthStateChange
    } catch (error: unknown) {
      console.error(error);
      setErrorMsg("Gagal login dengan Google: " + (error as Error).message);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      if (isLogin) {
        // Mode Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        await checkUserStoreAndRedirect(data.user.id, data.user.email ?? "");
      } else {
        // Mode Daftar Akun Baru (Tanpa isi toko dulu)
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        if (data.user) {
          await checkUserStoreAndRedirect(data.user.id, data.user.email ?? "");
        }
      }
    } catch (error: unknown) {
      console.error("Error during auth:", error);
      setErrorMsg((error as Error).message);
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center p-6 font-sans">
      <div className="absolute top-0 left-0 w-80 h-80 bg-orange-300/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-red-300/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-3xl border border-zinc-200/60 shadow-xl overflow-hidden relative z-10 transition-all duration-300">
        <div className="p-8 pb-4 text-center">
          <div className="inline-flex h-12 w-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-red-500 items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg shadow-orange-500/20">
            🏪
          </div>
          <h1 className="text-2xl font-extrabold text-zinc-950">Selamat Datang</h1>
          <p className="text-zinc-500 text-xs mt-1.5">
            Portal Pemilik Bisnis & Manajemen Sistem.
          </p>
        </div>

        <div className="px-8 flex border-b border-zinc-100">
          <button
            onClick={() => { setIsLogin(true); setErrorMsg(""); }}
            className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-all duration-300 ${
              isLogin
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-zinc-400 hover:text-zinc-600"
            }`}
          >
            Masuk
          </button>
          <button
            onClick={() => { setIsLogin(false); setErrorMsg(""); }}
            className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-all duration-300 ${
              !isLogin
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-zinc-400 hover:text-zinc-600"
            }`}
          >
            Daftar Akun
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-4 pt-6">
          
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-lg font-medium">
              {errorMsg}
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 font-semibold text-sm shadow-sm transition-all duration-300 flex items-center justify-center gap-3 mb-4 disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Lanjutkan dengan Google
          </button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-zinc-200"></div>
            <span className="flex-shrink-0 mx-4 text-zinc-400 text-xs">atau dengan email</span>
            <div className="flex-grow border-t border-zinc-200"></div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-zinc-700">Alamat Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Contoh: admin@toko.com"
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm placeholder-zinc-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
              required
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-semibold text-zinc-700">Kata Sandi</label>
              {isLogin && (
                <a href="#" className="text-[11px] text-orange-600 hover:underline">
                  Lupa Sandi?
                </a>
              )}
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm placeholder-zinc-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
              minLength={6}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold text-sm shadow-md shadow-orange-500/10 hover:shadow-lg hover:shadow-orange-500/20 hover:scale-[1.01] transition-all duration-300 flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Memproses...</span>
              </>
            ) : isLogin ? (
              "Masuk ke Akun"
            ) : (
              "Daftar Akun Baru"
            )}
          </button>

          {/* Menghapus opsi Coba Demo untuk Admin, fokus pada flow pembuatan toko */}

          <div className="text-center pt-2">
            <Link href="/pricing" className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors">
              ← Kembali ke Pilihan Paket
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Memeriksa Keamanan...</div>}>
      <AuthForm />
    </Suspense>
  );
}
