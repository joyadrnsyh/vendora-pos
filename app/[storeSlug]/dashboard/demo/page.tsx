"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "../../globals.css";
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
  ShoppingBagIcon,
  UserPlusIcon,
  TrashIcon,
  PencilSquareIcon,
  InformationCircleIcon
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

interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Kasir";
  status: "Aktif" | "Nonaktif";
}

const mockTransactions: Transaction[] = [
  { id: "INV-883011", customer: "Budi Santoso", date: "Hari Ini, 14:20", total: 85000, method: "QRIS", status: "Sukses" },
  { id: "INV-883010", customer: "Siti Rahma", date: "Hari Ini, 13:45", total: 128000, method: "Tunai", status: "Sukses" },
  { id: "INV-883009", customer: "Agus Pratama", date: "Hari Ini, 11:15", total: 45000, method: "Tunai", status: "Sukses" },
  { id: "INV-883008", customer: "Dewi Lestari", date: "Kemarin, 19:30", total: 210000, method: "Kartu Debit", status: "Sukses" }
];

const initialLowStockItems: LowStockItem[] = [
  { id: "ls1", name: "Paper Cup 8oz", sku: "SKU-CUP8", stock: 12, minStock: 50 },
  { id: "ls2", name: "Sirup Vanila 1L", sku: "SKU-VAN1", stock: 2, minStock: 10 }
];

const mockUsers: SystemUser[] = [
  { id: "u1", name: "Alex Mercer", email: "alex@vendora.com", role: "Admin", status: "Aktif" },
  { id: "u2", name: "Siti Nurhaliza", email: "siti@vendora.com", role: "Kasir", status: "Aktif" },
  { id: "u3", name: "Budi Gunawan", email: "budi@vendora.com", role: "Kasir", status: "Nonaktif" }
];

export default function DemoDashboard() {
  const router = useRouter();
  const [storeName, setStoreName] = useState("Toko Vendora (DEMO)");
  const [userName, setUserName] = useState("Demo User");
  const [activeTab, setActiveTab] = useState("Overview");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [lowStock, setLowStock] = useState<LowStockItem[]>(initialLowStockItems);
  const [users, setUsers] = useState<SystemUser[]>(mockUsers);

  useEffect(() => {
    // Demo Mode bypasses everything
  }, []);

  const handleLogout = () => {
    router.push("/Auth"); // Keluar ke halaman Auth
  };

  const showDemoAlert = () => {
    alert("Maaf, fitur ini dibatasi pada versi Demo.");
  };

  const handleRestock = (id: string) => {
    showDemoAlert();
  };

  const handleDeleteUser = (id: string) => {
    showDemoAlert();
  };

  const handleAddUser = () => {
    showDemoAlert();
  };

  const navigation = [
    { name: "Overview", label: "Ringkasan", icon: Squares2X2Icon },
    { name: "Transactions", label: "Transaksi", icon: DocumentTextIcon },
    { name: "Products", label: "Produk & Stok", icon: ArchiveBoxIcon },
    { name: "Customers", label: "Pelanggan", icon: UsersIcon },
    { name: "Users", label: "Kelola Pengguna", icon: UserPlusIcon },
    { name: "Reports", label: "Laporan", icon: ChartBarIcon },
    { name: "Settings", label: "Pengaturan", icon: Cog6ToothIcon }
  ];

  return (
    <main className="min-h-screen bg-white flex flex-col font-sans text-slate-800">
      
      {/* Demo Banner */}
      <div className="bg-amber-500 text-white px-4 py-2 text-center text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-sm z-50">
        <InformationCircleIcon className="h-4 w-4" />
        Anda sedang mengakses Mode Demo. Beberapa fitur dinonaktifkan.
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* 1. Left Sidebar */}
        <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-100 min-h-full p-6 justify-between shrink-0">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-600/20">
                <BuildingStorefrontIcon className="h-6 w-6" />
              </div>
              <span className="text-2xl font-bold text-slate-900 tracking-tight">
                Vendora <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full ml-1 align-top">DEMO</span>
              </span>
            </div>

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

          <div className="pt-6 border-t border-slate-100 space-y-4">
            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm">
                {userName.charAt(0)}
              </div>
              <div className="space-y-0.5 flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-slate-900 truncate">{userName}</h4>
                <p className="text-xs text-slate-500 truncate">Pengunjung Demo</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5" />
              <span>Keluar Mode Demo</span>
            </button>
          </div>
        </aside>

        {/* 2. Main content container */}
        <section className="flex-1 flex flex-col min-w-0 bg-slate-50/50 overflow-y-auto">
          {/* Top Navbar */}
          <header className="bg-white border-b border-slate-100 px-8 py-5 flex justify-between items-center z-10 sticky top-0">
            <div className="flex items-center gap-4">
              <div className="lg:hidden flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-orange-600 flex items-center justify-center text-white text-sm">
                  <BuildingStorefrontIcon className="h-5 w-5" />
                </div>
                <span className="text-lg font-bold text-slate-900">Vendora</span>
              </div>
              <h2 className="hidden lg:block text-xl font-semibold text-slate-900 tracking-tight">
                {activeTab === "Overview" && "Ringkasan Dashboard"}
                {activeTab === "Users" && "Manajemen Pengguna Sistem"}
                {activeTab !== "Overview" && activeTab !== "Users" && itemLabel(activeTab, navigation)}
              </h2>
            </div>
            <div className="flex items-center gap-5">
              <button onClick={showDemoAlert} className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                <BellIcon className="h-6 w-6" />
                <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-orange-500 border-2 border-white" />
              </button>
            </div>
          </header>

          {/* Dashboard Body */}
          <div className="flex-1 p-8 space-y-8">
            
            {activeTab === "Overview" && (
              <>
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
              </>
            )}

            {activeTab === "Users" && (
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-900">Daftar Pengguna Sistem</h3>
                  <button onClick={handleAddUser} className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    <UserPlusIcon className="h-5 w-5" />
                    Tambah Pengguna
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                        <th className="pb-4 px-2">Nama</th>
                        <th className="pb-4 px-2">Email</th>
                        <th className="pb-4 px-2">Role</th>
                        <th className="pb-4 px-2">Status</th>
                        <th className="pb-4 px-2 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50 transition duration-150">
                          <td className="py-4 px-2 font-medium text-slate-900">{u.name}</td>
                          <td className="py-4 px-2 text-slate-500">{u.email}</td>
                          <td className="py-4 px-2">
                            <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${u.role === 'Admin' ? 'bg-purple-50 text-purple-700 border border-purple-200/50' : 'bg-blue-50 text-blue-700 border border-blue-200/50'}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="py-4 px-2">
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${u.status === 'Aktif' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50' : 'bg-red-50 text-red-700 border border-red-200/50'}`}>
                              {u.status}
                            </span>
                          </td>
                          <td className="py-4 px-2 text-right">
                            <div className="flex justify-end gap-2">
                              <button onClick={showDemoAlert} className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                                <PencilSquareIcon className="h-5 w-5" />
                              </button>
                              <button onClick={() => handleDeleteUser(u.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab !== "Overview" && activeTab !== "Users" && (
              <div className="bg-white p-12 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                <Squares2X2Icon className="h-16 w-16 text-slate-200 mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">Halaman {itemLabel(activeTab, navigation)}</h3>
                <p className="text-slate-500 text-sm max-w-sm">Tampilan ini bersifat simulasi untuk versi Demo.</p>
              </div>
            )}

          </div>
        </section>
      </div>
    </main>
  );
}

function itemLabel(name: string, nav: any[]) {
  const f = nav.find(n => n.name === name);
  return f ? f.label : name;
}
