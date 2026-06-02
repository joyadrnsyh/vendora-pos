"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "../globals.css";
import {
  BuildingStorefrontIcon,
  Squares2X2Icon,
  DocumentTextIcon,
  ArchiveBoxIcon,
  UsersIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  BellIcon,
  BanknotesIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ShoppingBagIcon
} from "@heroicons/react/24/outline";

interface Transaction {
  id: string;
  customer: string;
  date: string;
  total: number;
  method: string;
  status: "Sukses" | "Pending" | "Gagal";
}

interface LowStockItem {
  id: string;
  name: string;
  sku: string;
  stock: number;
  minStock: number;
}

const mockTransactions: Transaction[] = [
  { id: "INV-883011", customer: "Budi Santoso", date: "Hari Ini, 14:20", total: 85000, method: "QRIS", status: "Sukses" },
  { id: "INV-883010", customer: "Siti Rahma", date: "Hari Ini, 13:45", total: 128000, method: "Tunai", status: "Sukses" },
  { id: "INV-883009", customer: "Agus Pratama", date: "Hari Ini, 11:15", total: 45000, method: "Tunai", status: "Sukses" },
  { id: "INV-883008", customer: "Dewi Lestari", date: "Kemarin, 19:30", total: 210000, method: "Kartu Debit", status: "Sukses" },
  { id: "INV-883007", customer: "Rian Hidayat", date: "Kemarin, 16:10", total: 32000, method: "QRIS", status: "Gagal" }
];

const initialLowStockItems: LowStockItem[] = [
  { id: "ls1", name: "Paper Cup 8oz", sku: "SKU-CUP8", stock: 12, minStock: 50 },
  { id: "ls2", name: "Sirup Vanila 1L", sku: "SKU-VAN1", stock: 2, minStock: 10 },
  { id: "ls3", name: "Sedotan Kertas", sku: "SKU-SEDOT", stock: 45, minStock: 200 },
  { id: "ls4", name: "Biji Kopi Espresso 1kg", sku: "SKU-KOP1", stock: 4, minStock: 15 }
];

export default function Dashboard() {
  const router = useRouter();
  const [storeName, setStoreName] = useState("Toko Vendora");
  const [userName, setUserName] = useState("Alex Mercer");
  const [activeTab, setActiveTab] = useState("Overview");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [lowStock, setLowStock] = useState<LowStockItem[]>(initialLowStockItems);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn !== "true") {
      router.push("/Auth");
      return;
    }
    
    const storedStore = localStorage.getItem("storeName") || "Vendora Store #01";
    const storedUser = localStorage.getItem("userName") || "Alex Mercer";
    setTimeout(() => {
      setStoreName(storedStore);
      setUserName(storedUser);
    }, 0);
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  const handleRestock = (id: string) => {
    setLowStock((prev) =>
      prev.map((item) => (item.id === id ? { ...item, stock: item.minStock + 10 } : item))
    );
    alert("Stok barang berhasil ditambah!");
  };

  const navigation = [
    { name: "Overview", label: "Ringkasan", icon: Squares2X2Icon },
    { name: "Transactions", label: "Transaksi", icon: DocumentTextIcon },
    { name: "Products", label: "Produk & Stok", icon: ArchiveBoxIcon },
    { name: "Customers", label: "Pelanggan", icon: UsersIcon },
    { name: "Reports", label: "Laporan", icon: ChartBarIcon },
    { name: "Settings", label: "Pengaturan", icon: Cog6ToothIcon }
  ];

  return (
    <main className="min-h-screen bg-white flex font-sans text-slate-800">
      {/* 1. Left Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-100 min-h-screen p-6 justify-between shrink-0">
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-600/20">
              <BuildingStorefrontIcon className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold text-slate-900 tracking-tight">
              Vendora
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-orange-50 text-orange-600 shadow-sm border border-orange-100"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? "text-orange-600" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer info */}
        <div className="pt-6 border-t border-slate-100 space-y-4">
          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm">
              {userName.charAt(0)}
            </div>
            <div className="space-y-0.5 flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-slate-900 truncate">{userName}</h4>
              <p className="text-xs text-slate-500 truncate">{storeName}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
            <span>Keluar Sistem</span>
          </button>
        </div>
      </aside>

      {/* 2. Main content container */}
      <section className="flex-1 flex flex-col min-w-0 bg-slate-50/50">
        {/* Top Navbar */}
        <header className="bg-white border-b border-slate-100 px-8 py-5 flex justify-between items-center z-10 sticky top-0">
          <div className="flex items-center gap-4">
            {/* Mobile Sidebar toggle or logo */}
            <div className="lg:hidden flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-orange-600 flex items-center justify-center text-white text-sm">
                <BuildingStorefrontIcon className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold text-slate-900">Vendora</span>
            </div>
            <h2 className="hidden lg:block text-xl font-semibold text-slate-900 tracking-tight">
              {activeTab === "Overview" && "Ringkasan Dashboard"}
              {activeTab === "Transactions" && "Data Transaksi Penjualan"}
              {activeTab === "Products" && "Manajemen Produk & Stok"}
              {activeTab === "Customers" && "CRM Pelanggan"}
              {activeTab === "Reports" && "Analisis & Laporan Keuangan"}
              {activeTab === "Settings" && "Pengaturan Sistem POS"}
            </h2>
          </div>

          <div className="flex items-center gap-5">
            {/* Notification alert */}
            <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
              <BellIcon className="h-6 w-6" />
              <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-orange-500 border-2 border-white" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 focus:outline-none"
              >
                <div className="hidden sm:block text-right">
                  <h4 className="text-sm font-semibold text-slate-900">{userName}</h4>
                  <span className="text-xs text-slate-500">{storeName}</span>
                </div>
                <div className="h-10 w-10 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 font-bold text-sm shadow-sm">
                  {userName.charAt(0)}
                </div>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-30 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-5 py-3 border-b border-slate-50">
                    <p className="font-semibold text-slate-900 text-sm">{userName}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{storeName}</p>
                  </div>
                  <button
                    onClick={() => {
                      alert("Membuka profil...");
                      setIsProfileOpen(false);
                    }}
                    className="w-full text-left px-5 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Profil Saya
                  </button>
                  <button
                    onClick={() => {
                      alert("Membuka pengaturan toko...");
                      setIsProfileOpen(false);
                    }}
                    className="w-full text-left px-5 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Pengaturan Toko
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-5 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-slate-50"
                  >
                    Keluar Sistem
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Main Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Metric 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-slate-500">Total Pendapatan</span>
                <div className="h-10 w-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                  <BanknotesIcon className="h-5 w-5" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Rp 45.280.000</h3>
              <div className="flex items-center text-sm">
                <ArrowTrendingUpIcon className="h-4 w-4 text-emerald-500 mr-1" />
                <span className="font-medium text-emerald-600">+12.4%</span>
                <span className="text-slate-400 ml-2">bulan ini</span>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-slate-500">Total Transaksi</span>
                <div className="h-10 w-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                  <DocumentTextIcon className="h-5 w-5" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">1.240</h3>
              <div className="flex items-center text-sm">
                <ArrowTrendingUpIcon className="h-4 w-4 text-emerald-500 mr-1" />
                <span className="font-medium text-emerald-600">+8.2%</span>
                <span className="text-slate-400 ml-2">bulan ini</span>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-slate-500">Produk Aktif</span>
                <div className="h-10 w-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                  <ShoppingBagIcon className="h-5 w-5" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">320</h3>
              <div className="flex items-center text-sm">
                <span className="font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                  Stok aman terkelola
                </span>
              </div>
            </div>

            {/* Metric 4 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-slate-500">Peringatan Stok</span>
                <div className="h-10 w-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                  <ExclamationTriangleIcon className="h-5 w-5" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                {lowStock.filter((i) => i.stock <= i.minStock).length}
              </h3>
              <div className="flex items-center text-sm">
                <span className="font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                  Butuh Restok Segera
                </span>
              </div>
            </div>
          </div>

          {/* Graphs and stock list grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Sales Chart */}
            <div className="xl:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900">Tren Pendapatan</h3>
                <select className="bg-slate-50 border border-slate-200 text-slate-600 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-orange-500">
                  <option>7 Hari Terakhir</option>
                  <option>Bulan Ini</option>
                  <option>Tahun Ini</option>
                </select>
              </div>

              {/* Vector/SVG Sales Graph */}
              <div className="h-72 flex items-end justify-between relative pt-6 px-2">
                {/* Horizontal gridlines */}
                <div className="absolute inset-x-0 top-12 border-t border-dashed border-slate-200" />
                <div className="absolute inset-x-0 top-32 border-t border-dashed border-slate-200" />
                <div className="absolute inset-x-0 top-52 border-t border-dashed border-slate-200" />

                {/* SVG Curve Line overlay */}
                <svg className="absolute inset-0 h-full w-full pointer-events-none px-8 pt-6" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Gradient Area under curve */}
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ea580c" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 5,90 Q 20,40 35,70 T 65,30 T 95,15 L 95,95 L 5,95 Z"
                    fill="url(#chartGrad)"
                  />
                  <path
                    d="M 5,90 Q 20,40 35,70 T 65,30 T 95,15"
                    fill="none"
                    stroke="#ea580c"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                {/* Chart Columns/data labels */}
                {[
                  { day: "Sen", amt: "2.4M", height: "45%" },
                  { day: "Sel", amt: "3.8M", height: "60%" },
                  { day: "Rab", amt: "3.1M", height: "50%" },
                  { day: "Kam", amt: "5.2M", height: "75%" },
                  { day: "Jum", amt: "6.8M", height: "85%" },
                  { day: "Sab", amt: "8.5M", height: "100%" },
                  { day: "Min", amt: "9.2M", height: "95%" }
                ].map((item) => (
                  <div key={item.day} className="flex flex-col items-center gap-3 h-full justify-end z-10 w-12 group">
                    <span className="text-xs font-semibold text-slate-700 bg-white border border-slate-100 shadow-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.amt}
                    </span>
                    <div
                      style={{ height: item.height }}
                      className="w-12 rounded-t-xl bg-orange-100 group-hover:bg-orange-500 transition-colors cursor-pointer relative overflow-hidden"
                    >
                        <div className="absolute bottom-0 w-full bg-orange-500 opacity-20" style={{height: '100%'}}></div>
                    </div>
                    <span className="text-sm font-medium text-slate-500">{item.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Low stock alerts */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900">Stok Menipis</h3>
                <span className="text-xs font-medium bg-red-50 text-red-600 px-2.5 py-1 rounded-full">
                  {lowStock.filter((i) => i.stock <= i.minStock).length} Kritis
                </span>
              </div>

              <div className="space-y-4">
                {lowStock.map((item) => {
                  const isCritical = item.stock <= item.minStock;
                  return (
                    <div
                      key={item.id}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-colors ${
                        isCritical
                          ? "border-red-100 bg-red-50/30"
                          : "border-slate-100 bg-slate-50"
                      }`}
                    >
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold text-slate-900">{item.name}</h4>
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="text-slate-500">{item.sku}</span>
                          <span className="text-slate-300">•</span>
                          <span className={`font-semibold ${isCritical ? "text-red-600" : "text-slate-700"}`}>
                            Sisa: {item.stock}
                          </span>
                          <span className="text-slate-400">(Min: {item.minStock})</span>
                        </div>
                      </div>
                      {isCritical && (
                        <button
                          onClick={() => handleRestock(item.id)}
                          className="mt-3 sm:mt-0 px-4 py-2 rounded-lg bg-white border border-red-200 text-red-600 hover:bg-red-50 font-medium text-xs transition-colors shadow-sm whitespace-nowrap"
                        >
                          Restok
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent transactions table */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">Transaksi Terbaru</h3>
              <button
                onClick={() => alert("Membuka seluruh riwayat transaksi...")}
                className="text-sm text-orange-600 font-medium hover:text-orange-700"
              >
                Lihat Semua
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                    <th className="pb-4 px-2">ID Transaksi</th>
                    <th className="pb-4 px-2">Pelanggan</th>
                    <th className="pb-4 px-2">Waktu</th>
                    <th className="pb-4 px-2">Total Tagihan</th>
                    <th className="pb-4 px-2">Metode</th>
                    <th className="pb-4 px-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {mockTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50 transition duration-150">
                      <td className="py-4 px-2 font-medium text-slate-900">{tx.id}</td>
                      <td className="py-4 px-2 text-slate-600">{tx.customer}</td>
                      <td className="py-4 px-2 text-slate-500">{tx.date}</td>
                      <td className="py-4 px-2 font-semibold text-slate-900">
                        Rp {tx.total.toLocaleString("id-ID")}
                      </td>
                      <td className="py-4 px-2">
                        <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-xs font-medium">
                          {tx.method}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-right">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                            tx.status === "Sukses"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50"
                              : tx.status === "Pending"
                              ? "bg-amber-50 text-amber-700 border border-amber-200/50"
                              : "bg-red-50 text-red-700 border border-red-200/50"
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
