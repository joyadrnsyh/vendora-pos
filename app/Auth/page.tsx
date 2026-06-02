"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "../globals.css";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [storeName, setStoreName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn === "true") {
      router.push("/dashboard");
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", email || "admin@vendora.com");
      localStorage.setItem("storeName", storeName || "Vendora Store #01");
      localStorage.setItem("userName", ownerName || "Alex Mercer");
      
      setIsLoading(false);
      router.push("/dashboard");
    }, 1200);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center p-6 font-sans">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-orange-300/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-red-300/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-3xl border border-zinc-200/60 shadow-xl overflow-hidden relative z-10 transition-all duration-300">
        {/* Card Header */}
        <div className="p-8 pb-4 text-center">
          <div className="inline-flex h-12 w-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-red-500 items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg shadow-orange-500/20">
            🏪
          </div>
          <h1 className="text-2xl font-extrabold text-zinc-950">Selamat Datang di Vendora</h1>
          <p className="text-zinc-500 text-xs mt-1.5">
            Sistem kasir pintar untuk bisnis modern Anda.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="px-8 flex border-b border-zinc-100">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-all duration-300 ${
              isLogin
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-zinc-400 hover:text-zinc-600"
            }`}
          >
            Masuk
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-all duration-300 ${
              !isLogin
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-zinc-400 hover:text-zinc-600"
            }`}
          >
            Daftar Toko
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          {!isLogin && (
            <>
              {/* Store Name input */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-zinc-700">Nama Toko / Bisnis</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="Contoh: Kopi Kencana"
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm placeholder-zinc-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  required
                />
              </div>

              {/* Owner Name input */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-zinc-700">Nama Lengkap Pemilik</label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="Contoh: Alex Mercer"
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm placeholder-zinc-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  required
                />
              </div>
            </>
          )}

          {/* Email input */}
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

          {/* Password input */}
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold text-sm shadow-md shadow-orange-500/10 hover:shadow-lg hover:shadow-orange-500/20 hover:scale-[1.01] transition-all duration-300 flex items-center justify-center gap-2 mt-6"
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
              "Buat Toko Baru"
            )}
          </button>

          {/* Back Home */}
          <div className="text-center pt-2">
            <Link href="/" className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors">
              ← Kembali ke Beranda
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
