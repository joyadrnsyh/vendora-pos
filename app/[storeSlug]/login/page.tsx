"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "../../globals.css";

// Firebase imports
import { auth, db } from "../../../lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// In Next.js 13+ App Router, params is a promise in newer versions, but we can treat it as a prop
export default function StoreLoginPage({ params }: { params: Promise<{ storeSlug: string }> }) {
  const { storeSlug } = React.use(params);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginRole, setLoginRole] = useState<"Admin" | "Kasir">("Kasir");
  const [isLoading, setIsLoading] = useState(false);

  const [storeName, setStoreName] = useState("Memuat...");
  const [errorMsg, setErrorMsg] = useState("");
  const [storeLogo, setStoreLogo] = useState("");
  const [storeExists, setStoreExists] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const storeRef = doc(db, "stores", storeSlug);
        const storeSnap = await getDoc(storeRef);

        if (storeSnap.exists()) {
          const data = storeSnap.data();
          setStoreName(data.name);
          if (data.logoBase64) {
            setStoreLogo(data.logoBase64);
          }
          setStoreExists(true);
        } else {
          setStoreName("Toko Tidak Ditemukan");
          setStoreExists(false);
        }
      } catch (error) {
        console.error("Error fetching store:", error);
        setStoreName(storeSlug.replace(/-/g, " ").toUpperCase());
        setStoreExists(true); // Fallback if rules block it or network error
      }
    };

    fetchStore();
  }, [storeSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeExists) {
      setErrorMsg("Tidak dapat masuk, toko tidak ditemukan.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      // Login menggunakan Firebase Auth
      await signInWithEmailAndPassword(auth, email, password);

      // Simpan sesi di sessionStorage
      sessionStorage.setItem("isLoggedIn", "true");
      sessionStorage.setItem("userEmail", email);
      sessionStorage.setItem("userRole", loginRole);
      sessionStorage.setItem("storeSlug", storeSlug);
      sessionStorage.setItem("storeName", storeName);
      if (storeLogo) {
        sessionStorage.setItem("storeLogo", storeLogo);
      }

      if (loginRole === "Kasir") {
        router.push(`/${storeSlug}/dashboard/cashier`);
      } else {
        router.push(`/${storeSlug}/dashboard/admin`);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Login error:", error);
      setErrorMsg("Kredensial tidak valid: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden relative z-10">

        {/* Header */}
        <div className="p-8 pb-6 text-center border-b border-slate-100 bg-slate-50/50">
          <div className="inline-flex h-16 w-16 rounded-2xl bg-orange-100 items-center justify-center text-orange-600 text-2xl font-bold mb-4 shadow-inner border border-orange-200">
            {storeName !== "Memuat..." && storeName !== "Toko Tidak Ditemukan" ? storeName.charAt(0) : "🏪"}
          </div>
          <h1 className="text-xl font-extrabold text-slate-900">{storeName}</h1>
          <p className="text-slate-500 text-xs mt-1.5 font-medium bg-slate-200/50 inline-block px-3 py-1 rounded-full">
            Portal Karyawan
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-lg font-medium">
              {errorMsg}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Masuk Sebagai</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setLoginRole("Kasir")}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${loginRole === "Kasir"
                  ? "bg-orange-50 border-orange-500 text-orange-600 shadow-sm"
                  : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
              >
                Kasir
              </button>
              <button
                type="button"
                onClick={() => setLoginRole("Admin")}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${loginRole === "Admin"
                  ? "bg-orange-50 border-orange-500 text-orange-600 shadow-sm"
                  : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
              >
                Admin
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Email Pengguna</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={`Contoh: ${loginRole.toLowerCase()}@toko.com`}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all bg-slate-50 focus:bg-white"
              required
              disabled={storeExists === false}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Kata Sandi</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan sandi akun Anda"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all bg-slate-50 focus:bg-white"
              required
              disabled={storeExists === false}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || storeExists === false}
            className="w-full py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-lg shadow-orange-600/20 hover:shadow-orange-600/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Memproses...</span>
              </>
            ) : (
              `Masuk ke ${loginRole}`
            )}
          </button>

          <div className="text-center pt-4">
            <Link href="/Auth" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
              Bukan toko Anda? Kembali
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
