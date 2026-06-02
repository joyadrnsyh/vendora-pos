"use client";

import React from "react";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.includes("/dashboard") || pathname?.startsWith("/setup-store")) {
      return null;
  }

  return (
    <footer className="w-full bg-zinc-950 text-zinc-400 py-16 px-6 border-t border-zinc-900 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
        {/* Column 1: Brand and Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Vendora
            </span>
          </div>
          <p className="text-zinc-400 max-w-sm text-sm leading-relaxed">
            Sistem kasir pintar berbasis cloud untuk mengelola transaksi, stok, dan laporan bisnis Anda secara real-time. Membantu UMKM berkembang lebih cepat dengan efisiensi teknologi modern.
          </p>
          <div className="flex gap-4">
            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="h-10 w-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-orange-500 hover:text-white hover:border-orange-500 hover:scale-105 transition-all duration-300"
              aria-label="Instagram"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </a>
            {/* LinkedIn */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="h-10 w-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-orange-500 hover:text-white hover:border-orange-500 hover:scale-105 transition-all duration-300"
              aria-label="LinkedIn"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
            {/* Twitter */}
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="h-10 w-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-orange-500 hover:text-white hover:border-orange-500 hover:scale-105 transition-all duration-300"
              aria-label="Twitter"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Column 2: Products */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold tracking-wider text-sm uppercase">Produk</h3>
          <ul className="space-y-2.5 text-sm">
            <li><a href="#services" className="hover:text-orange-500 transition-colors duration-200">Fitur Utama</a></li>
            <li><a href="#pricing" className="hover:text-orange-500 transition-colors duration-200">Paket Harga</a></li>
            <li><a href="#about" className="hover:text-orange-500 transition-colors duration-200">Demo Interaktif</a></li>
            <li><a href="#top" className="hover:text-orange-500 transition-colors duration-200">Pembaruan</a></li>
          </ul>
        </div>

        {/* Column 3: Company */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold tracking-wider text-sm uppercase">Perusahaan</h3>
          <ul className="space-y-2.5 text-sm">
            <li><a href="#about" className="hover:text-orange-500 transition-colors duration-200">Tentang Kami</a></li>
            <li><a href="https://wa.me/6285161128731" target="_blank" rel="noreferrer" className="hover:text-orange-500 transition-colors duration-200">Kontak Kami</a></li>
            <li><a href="#portfolio" className="hover:text-orange-500 transition-colors duration-200">Mitra Kami</a></li>
            <li><a href="https://wa.me/6285161128731" target="_blank" rel="noreferrer" className="hover:text-orange-500 transition-colors duration-200">Bantuan</a></li>
          </ul>
        </div>

        {/* Column 4: Newsletter */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold tracking-wider text-sm uppercase">Newsletter</h3>
          <p className="text-sm leading-relaxed">
            Dapatkan tips pengelolaan bisnis dan penawaran spesial langsung di email Anda.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Masukkan email Anda"
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-300"
              required
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm transition-all duration-300 hover:scale-[1.02]"
            >
              Langganan
            </button>
          </form>
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-7xl mx-auto my-12 border-t border-zinc-900" />

      {/* Bottom Row */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
        <p>&copy; {new Date().getFullYear()} Vendora POS. Hak Cipta Dilindungi.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-orange-500 transition-colors duration-200">Kebijakan Privasi</a>
          <a href="#" className="hover:text-orange-500 transition-colors duration-200">Syarat & Ketentuan</a>
        </div>
      </div>
    </footer>
  );
}
