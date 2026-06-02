/* eslint-disable @next/next/no-img-element */
import React from "react";
import Link from "next/link";
import { BoltIcon, CubeIcon, ChartBarIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import "./globals.css";

export default function Home() {


  return (
    <main className="font-sans text-zinc-900 bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen overflow-hidden bg-white">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-red-50" />

        {/* Animated Background Glow */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-orange-300/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 -right-32 w-[500px] h-[500px] bg-red-300/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-yellow-300/20 rounded-full blur-3xl animate-pulse" />

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen max-w-7xl mx-auto px-6 pt-28 text-center">
          <h1 className="max-w-5xl text-5xl md:text-7xl font-bold leading-tight text-black">
            Kelola Penjualan
            <br />

            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Lebih Cepat
              </span>

              {/* Garis coretan bawah */}
              <span className="absolute left-0 -bottom-2 w-full h-3 bg-orange-300/60 rounded-full -z-10 rotate-[-2deg]" />
            </span>

            <span> dan Mudah</span>
            <br />
            dalam
            <br />
            Satu Dashboard
          </h1>

          <p className="max-w-2xl mt-8 text-gray-500 text-lg md:text-xl leading-relaxed">
            Pantau transaksi, stok barang, laporan penjualan, dan pelanggan
            secara real-time dalam satu platform yang mudah digunakan.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <Link href="/pricing" className="group relative text-center overflow-hidden bg-orange-500 hover:bg-orange-600 text-white font-semibold px-10 py-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/30">
              <span className="relative z-10">Coba Gratis</span>
              <div className="absolute inset-0 -translate-x-full bg-white/20 skew-x-12 group-hover:translate-x-full transition-transform duration-700" />
            </Link>

            <a href="https://wa.me/6285161128731?text=Halo%20Vendora%20POS%2C%20saya%20tertarik%20dengan%20layanan%20sistem%20kasir." target="_blank" rel="noreferrer" className="border border-gray-300 text-center bg-white hover:bg-gray-50 text-black font-semibold px-10 py-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg">
              Hubungi Kami
            </a>
          </div>
        </div>
      </section>

      {/* Services/Features Section */}
      <section id="services" className="py-24 bg-zinc-50 border-y border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold mb-4">
            Fitur Unggulan
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-950 tracking-tight">
            Dirancang Khusus untuk Membantu Bisnis UMKM
          </h2>
          <p className="text-zinc-500 mt-4 max-w-2xl mx-auto text-base">
            Meningkatkan efisiensi kerja kasir dan transparansi keuangan agar Anda dapat berfokus membesarkan bisnis Anda.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
            {/* Feature 1 */}
            <div className="bg-white rounded-3xl p-8 border border-zinc-200/60 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 text-left space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-600">
                <BoltIcon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-zinc-950">Transaksi Instan</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Kecepatan kasir andal. Rampungkan antrean pelanggan kurang dari 3 detik dengan antarmuka yang sangat responsif.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-3xl p-8 border border-zinc-200/60 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 text-left space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-600">
                <CubeIcon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-zinc-950">Kelola Stok Otomatis</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Stok berkurang otomatis setelah transaksi. Dapatkan notifikasi saat stok menipis agar tidak pernah kehabisan barang.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-3xl p-8 border border-zinc-200/60 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 text-left space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-600">
                <ChartBarIcon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-zinc-950">Laporan Finansial</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Pantau pendapatan harian, laba kotor, produk terlaris, dan performa pegawai langsung dari HP atau Laptop secara instan.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-3xl p-8 border border-zinc-200/60 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 text-left space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-600">
                <GlobeAltIcon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-zinc-950">Dukungan Multi-Outlet</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Kelola banyak cabang toko dalam satu akun administrator. Monitor arus barang dan kasir di semua lokasi secara terpusat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio / Showcase Section */}
      <section id="portfolio" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-16">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">
                Pilihan Bisnis
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-950 tracking-tight">
                Satu Aplikasi Kasir untuk Berbagai Jenis Usaha
              </h2>
            </div>
            <p className="text-zinc-500 text-base max-w-md">
              Apapun jenis bisnis Anda, Vendora POS menyesuaikan fitur checkout, manajemen persediaan, dan struk belanja untuk alur operasional Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Business 1 */}
            <div className="group rounded-3xl overflow-hidden border border-zinc-200/60 bg-zinc-50 hover:bg-white hover:shadow-xl transition-all duration-300">
              <div className="h-48 bg-zinc-100 flex items-center justify-center relative overflow-hidden">
                <img src="/cafe_illustration.png" alt="Kafe dan F&B" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-6 space-y-2">
                <h3 className="text-lg font-bold text-zinc-950">Kafe & F&B</h3>
                <p className="text-zinc-500 text-xs leading-relaxed">
                  Dukungan menu ber-opsi (size, topping), split bill, cetak pesanan langsung ke dapur, dan manajemen meja pelanggan.
                </p>
              </div>
            </div>

            {/* Business 2 */}
            <div className="group rounded-3xl overflow-hidden border border-zinc-200/60 bg-zinc-50 hover:bg-white hover:shadow-xl transition-all duration-300">
              <div className="h-48 bg-zinc-100 flex items-center justify-center relative overflow-hidden">
                <img src="/retail_illustration.png" alt="Ritel dan Minimarket" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-6 space-y-2">
                <h3 className="text-lg font-bold text-zinc-950">Ritel & Minimarket</h3>
                <p className="text-zinc-500 text-xs leading-relaxed">
                  Scan barcode cepat, impor data produk massal via Excel, manajemen SKU, pencatatan supplier, dan kartu garansi digital.
                </p>
              </div>
            </div>

            {/* Business 3 */}
            <div className="group rounded-3xl overflow-hidden border border-zinc-200/60 bg-zinc-50 hover:bg-white hover:shadow-xl transition-all duration-300">
              <div className="h-48 bg-zinc-100 flex items-center justify-center relative overflow-hidden">
                <img src="/salon_illustration.png" alt="Jasa dan Salon" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-6 space-y-2">
                <h3 className="text-lg font-bold text-zinc-950">Jasa & Salon</h3>
                <p className="text-zinc-500 text-xs leading-relaxed">
                  Penjadwalan janji temu pelanggan (booking), komisi ber-kapasitas pegawai kasir, dan integrasi pembayaran non-tunai (QRIS).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-zinc-50 border-t border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold mb-4">
            Paket Langganan
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-950 tracking-tight">
            Investasi Terjangkau untuk Hasil Maksimal
          </h2>
          <p className="text-zinc-500 mt-4 max-w-2xl mx-auto text-base">
            Tanpa biaya tambahan tersembunyi. Mulai gratis selama 14 hari pertama dan upgrade kapan saja bisnis Anda bertumbuh.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-5xl mx-auto items-stretch">
            {/* Plan 1 */}
            <div className="bg-white rounded-3xl p-8 border border-zinc-200/60 shadow-sm flex flex-col justify-between text-left space-y-6 hover:shadow-md transition">
              <div>
                <h3 className="text-zinc-900 font-bold text-xl">Starter</h3>
                <p className="text-zinc-400 text-xs mt-1">Cocok untuk usaha kecil mandiri yang baru merintis.</p>
                <div className="mt-6 flex items-baseline">
                  <span className="text-3xl font-extrabold text-zinc-950">Rp 149k</span>
                  <span className="text-zinc-400 text-sm ml-1">/bulan</span>
                </div>
                <ul className="mt-8 space-y-3.5 text-xs text-zinc-500">
                  <li className="flex items-center gap-2.5">
                    <span className="text-orange-500">✓</span> 1 Akun Outlet Kasir
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-orange-500">✓</span> Hingga 200 Produk
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-orange-500">✓</span> Laporan Harian Dasar
                  </li>
                  <li className="flex items-center gap-2.5 text-zinc-300 line-through">
                    <span>✗</span> Sinkronisasi Stok Real-Time
                  </li>
                </ul>
              </div>
              <Link
                href="/checkout?plan=starter"
                className="block w-full text-center py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs transition"
              >
                Pilih Starter
              </Link>
            </div>

            {/* Plan 2: Featured Pro */}
            <div className="bg-white rounded-3xl p-8 border-2 border-orange-500 shadow-xl flex flex-col justify-between text-left space-y-6 relative hover:scale-[1.01] transition-transform duration-300">
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-extrabold tracking-wider px-3.5 py-1 rounded-full uppercase shadow-md">
                Terpopuler
              </div>
              <div>
                <h3 className="text-zinc-900 font-bold text-xl">Business Pro</h3>
                <p className="text-zinc-400 text-xs mt-1">Sempurna untuk kafe, ritel, dan bisnis dengan pertumbuhan tinggi.</p>
                <div className="mt-6 flex items-baseline">
                  <span className="text-3xl font-extrabold text-zinc-950">Rp 299k</span>
                  <span className="text-zinc-400 text-sm ml-1">/bulan</span>
                </div>
                <ul className="mt-8 space-y-3.5 text-xs text-zinc-500">
                  <li className="flex items-center gap-2.5 font-medium text-zinc-700">
                    <span className="text-orange-500">✓</span> Unlimited Akun Outlet
                  </li>
                  <li className="flex items-center gap-2.5 font-medium text-zinc-700">
                    <span className="text-orange-500">✓</span> Unlimited Data Produk
                  </li>
                  <li className="flex items-center gap-2.5 font-medium text-zinc-700">
                    <span className="text-orange-500">✓</span> Sinkronisasi Stok & Supplier
                  </li>
                  <li className="flex items-center gap-2.5 font-medium text-zinc-700">
                    <span className="text-orange-500">✓</span> Laporan Finansial & Pajak Lengkap
                  </li>
                  <li className="flex items-center gap-2.5 font-medium text-zinc-700">
                    <span className="text-orange-500">✓</span> Program CRM Loyalty Pelanggan
                  </li>
                </ul>
              </div>
              <Link
                href="/checkout?plan=pro"
                className="block w-full text-center py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition shadow-lg shadow-orange-500/20"
              >
                Pilih Business Pro
              </Link>
            </div>

            {/* Plan 3 */}
            <div className="bg-white rounded-3xl p-8 border border-zinc-200/60 shadow-sm flex flex-col justify-between text-left space-y-6 hover:shadow-md transition">
              <div>
                <h3 className="text-zinc-900 font-bold text-xl">Enterprise</h3>
                <p className="text-zinc-400 text-xs mt-1">Bagi waralaba multi-cabang yang butuh penyesuaian khusus.</p>
                <div className="mt-6 flex items-baseline">
                  <span className="text-3xl font-extrabold text-zinc-950">Custom</span>
                </div>
                <ul className="mt-8 space-y-3.5 text-xs text-zinc-500">
                  <li className="flex items-center gap-2.5">
                    <span className="text-orange-500">✓</span> Semua Fitur Pro
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-orange-500">✓</span> Integrasi Sistem ERP Custom
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-orange-500">✓</span> Dedicated Account Manager 24/7
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-orange-500">✓</span> On-site Training & Setup Gratis
                  </li>
                </ul>
              </div>
              <a
                href="https://wa.me/6285161128731?text=Halo%20Vendora%20POS%2C%20saya%20tertarik%20dengan%20paket%20Enterprise."
                target="_blank"
                rel="noreferrer"
                className="block w-full text-center py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs transition"
              >
                Hubungi Kami
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-white border-t border-zinc-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold mb-4">
              Pusat Bantuan
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-950 tracking-tight">
              Pertanyaan yang Sering Diajukan
            </h2>
          </div>

          <div className="space-y-4">
            {/* FAQ 1 */}
            <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200/60 hover:border-orange-200 transition-colors">
              <h3 className="text-lg font-bold text-zinc-900 mb-2">Apakah ada batasan perangkat?</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Aplikasi kami dirancang responsif dan fleksibel. Anda dapat mengakses dashboard dan mode kasir di segala perangkat mulai dari Smartphone, Tablet (iPad/Android), hingga PC & Laptop tanpa perlu instalasi aplikasi khusus.
              </p>
            </div>
            
            {/* FAQ 2 */}
            <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200/60 hover:border-orange-200 transition-colors">
              <h3 className="text-lg font-bold text-zinc-900 mb-2">Bisakah saya menggunakan aplikasi ini tanpa internet (Offline)?</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Saat ini Vendora POS adalah sistem Point of Sale berbasis Cloud (Cloud POS) modern. Ini berarti Anda membutuhkan koneksi internet stabil (bisa menggunakan seluler) agar data penjualan dan stok bisa tersinkronisasi secara real-time.
              </p>
            </div>

            {/* FAQ 3 */}
            <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200/60 hover:border-orange-200 transition-colors">
              <h3 className="text-lg font-bold text-zinc-900 mb-2">Apakah sistem mendukung printer struk thermal?</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Ya! Vendora POS didesain khusus agar kompatibel dengan fitur Print bawaan OS Anda. Cukup hubungkan perangkat Anda ke printer Thermal Bluetooth atau USB, dan struk belanja akan tercetak sempurna.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-white overflow-hidden">
        <div className="max-w-5xl mx-auto px-6">
          <div className="relative rounded-3xl bg-gradient-to-br from-orange-500 to-red-600 text-white p-12 md:p-16 text-center space-y-8 overflow-hidden shadow-2xl shadow-orange-500/25">
            {/* Background blobs */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-3xl -z-10" />

            <h2 className="text-3xl md:text-5xl font-extrabold max-w-2xl mx-auto leading-tight">
              Siap Mengembangkan Bisnis Anda Bersama Vendora?
            </h2>
            <p className="text-orange-100 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
              Mulai gratis 14 hari sekarang. Akses penuh fitur, tidak membutuhkan kartu kredit, batalkan kapan saja Anda mau.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Link
                href="/pricing"
                className="px-8 py-3.5 rounded-2xl bg-white hover:bg-zinc-100 text-orange-600 font-extrabold text-sm transition shadow-lg hover:shadow-xl hover:scale-105 duration-300"
              >
                Mulai Berlangganan
              </Link>
              <a
                href="https://wa.me/6285161128731?text=Halo%20Vendora%20POS%2C%20saya%20ingin%20berkonsultasi%20mengenai%20langganan."
                target="_blank"
                rel="noreferrer"
                className="px-8 py-3.5 rounded-2xl border border-white/40 hover:bg-white/10 text-white font-bold text-sm transition duration-300"
              >
                Hubungi CS Kami
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
