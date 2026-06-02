/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "../globals.css";

// Supabase imports
import { supabase } from "../../lib/supabase";

export default function SetupStorePage() {
  const router = useRouter();
  const [storeName, setStoreName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
      } else {
        router.push("/auth");
      }
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        router.push("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    setErrorMsg("");

    try {
      const slug = generateSlug(storeName);

      // 1. Cek apakah toko sudah ada
      const { data: existingStore } = await supabase
        .from("stores")
        .select("slug")
        .eq("slug", slug)
        .single();

      if (existingStore) {
        throw new Error("Nama toko ini sudah terdaftar. Silakan pilih nama lain.");
      }
      
      // abaikan checkError "PGRST116" (not found) karena itu berarti slug tersedia

      // 2. Simpan data toko ke Supabase
      const plan = sessionStorage.getItem("planSubscribed") || "Uji Coba 14 Hari";

      const { error: insertError } = await supabase
        .from("stores")
        .insert({
          slug: slug,
          name: storeName,
          owner_name: ownerName,
          owner_email: user.email,
          owner_uid: user.id,
          plan: plan,
          // created_at akan diisi otomatis oleh DB
        });

      if (insertError) throw insertError;

      // Simpan sesi lokal
      sessionStorage.setItem("isLoggedIn", "true");
      sessionStorage.setItem("userEmail", user.email || "");
      sessionStorage.setItem("userRole", "Admin");
      sessionStorage.setItem("storeName", storeName);
      sessionStorage.setItem("storeSlug", slug);
      sessionStorage.setItem("userName", ownerName);

      // 3. Redirect ke dashboard admin dengan slug
      router.push(`/${slug}/dashboard/admin`);

    } catch (error: unknown) {
      console.error("Error setting up store:", error);
      setErrorMsg((error as Error).message);
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden relative z-10">

        <div className="p-8 pb-6 text-center border-b border-slate-100 bg-slate-50/50">
          <div className="inline-flex h-16 w-16 rounded-2xl bg-orange-100 items-center justify-center text-orange-600 text-2xl font-bold mb-4 shadow-inner border border-orange-200">
            🏢
          </div>
          <h1 className="text-xl font-extrabold text-slate-900">Setup Toko Baru</h1>
          <p className="text-slate-500 text-xs mt-1.5 font-medium">
            Satu langkah lagi untuk memulai bisnis Anda.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-lg font-medium">
              {errorMsg}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Nama Toko / Bisnis</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="Contoh: Kopi Kencana"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all bg-slate-50 focus:bg-white"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Nama Lengkap Pemilik</label>
            <input
              type="text"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder="Contoh: Alex Mercer"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all bg-slate-50 focus:bg-white"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || storeName.length < 3}
            className="w-full py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-lg shadow-orange-600/20 hover:shadow-orange-600/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Membangun Toko...</span>
              </>
            ) : (
              "Selesaikan & Masuk Dashboard"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
