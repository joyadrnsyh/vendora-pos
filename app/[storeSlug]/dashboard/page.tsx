"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "../../globals.css";
import {
  BuildingStorefrontIcon,
  UserIcon,
  ShoppingCartIcon,
  PlayIcon
} from "@heroicons/react/24/outline";

export default function DashboardGateway({ params }: { params: Promise<{ storeSlug: string }> }) {
  const { storeSlug } = React.use(params);
  const router = useRouter();

  const handleSelectRole = (path: string, role: string) => {
    // Simulasi set role
    sessionStorage.setItem("userRole", role);
    router.push(`/${storeSlug}${path}`);
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center font-sans p-6 text-slate-800">
      <div className="max-w-4xl w-full">

        <div className="text-center mb-12">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-xl shadow-orange-600/20 mb-6">
            <BuildingStorefrontIcon className="h-10 w-10" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
            Selamat Datang di Vendora
          </h1>
          <p className="text-slate-500 text-lg max-w-lg mx-auto">
            Sistem Point of Sales Modern. Silakan pilih portal dashboard untuk melanjutkan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Admin Card */}
          <button
            onClick={() => handleSelectRole("/dashboard/admin", "Admin")}
            className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-orange-200 hover:-translate-y-1 transition-all text-left flex flex-col group focus:outline-none"
          >
            <div className="h-14 w-14 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-orange-50 group-hover:text-orange-600 flex items-center justify-center mb-6 transition-colors">
              <UserIcon className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Dashboard Admin</h2>
            <p className="text-sm text-slate-500 flex-1">
              Akses penuh ke semua laporan, manajemen stok, dan pengaturan pengguna sistem.
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity">
              Masuk sebagai Admin &rarr;
            </div>
          </button>

          {/* Cashier Card */}
          <button
            onClick={() => handleSelectRole("/dashboard/cashier", "Kasir")}
            className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-orange-200 hover:-translate-y-1 transition-all text-left flex flex-col group focus:outline-none"
          >
            <div className="h-14 w-14 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-orange-50 group-hover:text-orange-600 flex items-center justify-center mb-6 transition-colors">
              <ShoppingCartIcon className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Sistem Kasir (POS)</h2>
            <p className="text-sm text-slate-500 flex-1">
              Antarmuka point of sales untuk melayani pelanggan, mengelola pesanan dan keranjang.
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity">
              Masuk sebagai Kasir &rarr;
            </div>
          </button>

          {/* Demo Card */}
          <button
            onClick={() => handleSelectRole("/dashboard/demo", "Demo")}
            className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-orange-200 hover:-translate-y-1 transition-all text-left flex flex-col group focus:outline-none relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-amber-100 text-amber-700 text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-wider">
              Simulasi
            </div>
            <div className="h-14 w-14 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-orange-50 group-hover:text-orange-600 flex items-center justify-center mb-6 transition-colors">
              <PlayIcon className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Coba Demo</h2>
            <p className="text-sm text-slate-500 flex-1">
              Eksplorasi antarmuka dan fitur Vendora secara aman dengan mode demo tanpa mengubah data asli.
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity">
              Mulai Simulasi &rarr;
            </div>
          </button>

        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
            &larr; Kembali ke Beranda
          </Link>
        </div>

      </div>
    </main>
  );
}
