"use client";

import React from "react";
import Link from "next/link";
import "../globals.css";
import { CheckCircleIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-900 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-12">
          <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-orange-600 transition-colors font-medium">
            <ArrowLeftIcon className="h-5 w-5" />
            Kembali ke Beranda
          </Link>
        </div>

        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
            Pilih Paket yang Sesuai untuk <span className="text-orange-600">Bisnis Anda</span>
          </h1>
          <p className="text-lg text-slate-500">
            Mulai dari uji coba gratis hingga solusi *enterprise*. Tingkatkan efisiensi kasir dan manajemen toko Anda bersama Vendora POS.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
          
          {/* Trial Plan */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-lg transition-shadow">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Uji Coba 14 Hari</h3>
              <p className="text-sm text-slate-500 mb-6">Tanpa kartu kredit. Coba semua fitur Pro secara gratis selama 14 hari pertama.</p>
              <div className="text-4xl font-black text-slate-900 mb-8">Rp 0</div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex gap-3 text-sm text-slate-600"><CheckCircleIcon className="h-5 w-5 text-orange-500 shrink-0" /> Akses 100% Fitur Pro</li>
                <li className="flex gap-3 text-sm text-slate-600"><CheckCircleIcon className="h-5 w-5 text-orange-500 shrink-0" /> Support via Email</li>
              </ul>
            </div>
            <Link href="/Auth?trial=true" className="w-full block text-center py-4 rounded-xl font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 transition-colors">
              Mulai Gratis
            </Link>
          </div>

          {/* Starter Plan */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-lg transition-shadow">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Starter</h3>
              <p className="text-sm text-slate-500 mb-6">Cocok untuk usaha kecil mandiri yang baru merintis bisnis pertama.</p>
              <div className="text-4xl font-black text-slate-900 mb-1">Rp 149k<span className="text-base font-medium text-slate-500">/bln</span></div>
              <p className="text-xs text-slate-400 mb-8">Ditagih tahunan atau Rp 179k/bln</p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex gap-3 text-sm text-slate-600"><CheckCircleIcon className="h-5 w-5 text-orange-500 shrink-0" /> 1 Akun Kasir</li>
                <li className="flex gap-3 text-sm text-slate-600"><CheckCircleIcon className="h-5 w-5 text-orange-500 shrink-0" /> Maksimal 200 Produk</li>
                <li className="flex gap-3 text-sm text-slate-600"><CheckCircleIcon className="h-5 w-5 text-orange-500 shrink-0" /> Laporan Harian Dasar</li>
              </ul>
            </div>
            <Link href="/checkout?plan=starter" className="w-full block text-center py-4 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20">
              Beli Paket Starter
            </Link>
          </div>

          {/* Pro Plan (Highlighted) */}
          <div className="bg-white rounded-3xl p-8 border-2 border-orange-500 shadow-xl flex flex-col justify-between relative transform lg:-translate-y-4">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full">
              Paling Populer
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Business Pro</h3>
              <p className="text-sm text-slate-500 mb-6">Sempurna untuk kafe, ritel, dan bisnis dengan volume tinggi.</p>
              <div className="text-4xl font-black text-orange-600 mb-1">Rp 299k<span className="text-base font-medium text-slate-500">/bln</span></div>
              <p className="text-xs text-slate-400 mb-8">Ditagih tahunan atau Rp 349k/bln</p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex gap-3 text-sm text-slate-800 font-medium"><CheckCircleIcon className="h-5 w-5 text-orange-500 shrink-0" /> Unlimited Akun Kasir</li>
                <li className="flex gap-3 text-sm text-slate-800 font-medium"><CheckCircleIcon className="h-5 w-5 text-orange-500 shrink-0" /> Unlimited Produk</li>
                <li className="flex gap-3 text-sm text-slate-800 font-medium"><CheckCircleIcon className="h-5 w-5 text-orange-500 shrink-0" /> Manajemen Stok Otomatis</li>
                <li className="flex gap-3 text-sm text-slate-800 font-medium"><CheckCircleIcon className="h-5 w-5 text-orange-500 shrink-0" /> Program Pelanggan Loyal</li>
              </ul>
            </div>
            <Link href="/checkout?plan=pro" className="w-full block text-center py-4 rounded-xl font-bold text-white bg-orange-600 hover:bg-orange-700 transition-colors shadow-xl shadow-orange-600/30">
              Beli Business Pro
            </Link>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-lg transition-shadow">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Enterprise</h3>
              <p className="text-sm text-slate-500 mb-6">Bagi waralaba multi-cabang yang membutuhkan fitur khusus.</p>
              <div className="text-4xl font-black text-slate-900 mb-8">Custom</div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex gap-3 text-sm text-slate-600"><CheckCircleIcon className="h-5 w-5 text-orange-500 shrink-0" /> Semua Fitur Pro</li>
                <li className="flex gap-3 text-sm text-slate-600"><CheckCircleIcon className="h-5 w-5 text-orange-500 shrink-0" /> Integrasi ERP Khusus</li>
                <li className="flex gap-3 text-sm text-slate-600"><CheckCircleIcon className="h-5 w-5 text-orange-500 shrink-0" /> Dedicated Manager 24/7</li>
                <li className="flex gap-3 text-sm text-slate-600"><CheckCircleIcon className="h-5 w-5 text-orange-500 shrink-0" /> On-site Setup & Training</li>
              </ul>
            </div>
            <Link href="/checkout?plan=enterprise" className="w-full block text-center py-4 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20">
              Hubungi Sales
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}
