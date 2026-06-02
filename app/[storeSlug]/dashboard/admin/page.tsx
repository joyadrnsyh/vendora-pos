/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import "../../../globals.css";
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
  PlusIcon,
  UserGroupIcon,
  ChartPieIcon,
  CogIcon,
  LockClosedIcon
} from "@heroicons/react/24/outline";

// Supabase imports
import { supabase } from "../../../../lib/supabase";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  minStock: number;
}

interface Transaction {
  id: string;
  customer: string;
  date: string;
  total: number;
  method: string;
  status: "Sukses" | "Pending" | "Gagal";
}

interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Kasir";
  status: "Aktif" | "Nonaktif";
}

export default function AdminDashboard({ params }: { params: Promise<{ storeSlug: string }> }) {
  const { storeSlug } = use(params);
  const router = useRouter();

  const [storeName, setStoreName] = useState("Memuat...");
  const [userName, setUserName] = useState("Memuat...");
  const [activeTab, setActiveTab] = useState("Overview");

  // Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [storePlan, setStorePlan] = useState("Uji Coba 14 Hari");
  const [lowStockCount, setLowStockCount] = useState(0);

  // Computed State for Reports & Customers
  const customersMap = new Map<string, { totalSpend: number, visitCount: number, lastVisit: string }>();
  transactions.forEach(t => {
    if (t.status !== "Sukses") return;
    const name = t.customer || "Pelanggan Umum";
    const existing = customersMap.get(name) || { totalSpend: 0, visitCount: 0, lastVisit: "" };
    customersMap.set(name, {
      totalSpend: existing.totalSpend + t.total,
      visitCount: existing.visitCount + 1,
      lastVisit: t.date > existing.lastVisit ? t.date : existing.lastVisit
    });
  });
  const topCustomers = Array.from(customersMap.entries())
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.totalSpend - a.totalSpend);

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    // adjust for local timezone roughly (for demo)
    return new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
  }).reverse();

  const dailyRevenue = last7Days.map(dateStr => {
    const total = transactions.filter(t => t.date.startsWith(dateStr) && t.status === "Sukses")
      .reduce((sum, t) => sum + t.total, 0);
    return { date: dateStr, total };
  });
  const maxRevenue = Math.max(...dailyRevenue.map(d => d.total), 1);

  const methodMap = new Map<string, number>();
  transactions.filter(t => t.status === "Sukses").forEach(t => {
    methodMap.set(t.method, (methodMap.get(t.method) || 0) + 1);
  });
  const totalSuccessTrans = transactions.filter(t => t.status === "Sukses").length || 1;
  const methodsChart = Array.from(methodMap.entries()).map(([method, count]) => ({
    method,
    count,
    percentage: (count / totalSuccessTrans) * 100
  })).sort((a, b) => b.count - a.count);

  // Settings State
  const [settingStoreName, setSettingStoreName] = useState("");
  const [storeLogo, setStoreLogo] = useState("");
  const [settingStoreLogo, setSettingStoreLogo] = useState("");

  // Form State untuk Tambah/Edit Produk
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [prodForm, setProdForm] = useState({ name: "", category: "", price: 0, stock: 0, minStock: 5 });

  // Form State untuk Tambah/Edit Pengguna
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  const [userForm, setUserForm] = useState({ name: "", email: "", password: "", role: "Kasir" as "Admin" | "Kasir", status: "Aktif" as "Aktif" | "Nonaktif" });

  useEffect(() => {
    // Ambil detail sesi
    const storedStore = sessionStorage.getItem("storeName") || storeSlug.replace(/-/g, " ").toUpperCase();
    const storedUser = sessionStorage.getItem("userName") || "Admin Vendora";
    const storedLogo = sessionStorage.getItem("storeLogo") || "";
    setStoreName(storedStore);
    setSettingStoreName(storedStore);
    setUserName(storedUser);
    setStoreLogo(storedLogo);
    setSettingStoreLogo(storedLogo);

    const fetchAllData = async () => {
      try {
        const [
          { data: pData },
          { data: uData },
          { data: tData },
          { data: sData }
        ] = await Promise.all([
          supabase.from('products').select('*').eq('store_slug', storeSlug),
          supabase.from('users').select('*').eq('store_slug', storeSlug),
          supabase.from('transactions').select('*').eq('store_slug', storeSlug).order('created_at', { ascending: false }),
          supabase.from('stores').select('*').eq('slug', storeSlug).single()
        ]);

        if (pData) {
          const prods = pData.map(d => ({
            id: d.id, name: d.name, category: d.category, price: d.price, stock: d.stock, minStock: d.min_stock
          }));
          setProducts(prods);
          setLowStockCount(prods.filter(p => p.stock <= p.minStock).length);
        }
        if (uData) {
          setUsers(uData.map(d => ({
            id: d.id, name: d.name, email: d.email, role: d.role as any, status: d.status as any
          })));
        }
        if (tData) {
          setTransactions(tData.map(d => ({
            id: d.id, customer: d.customer_name || "", date: d.created_at, total: d.total, method: d.method, status: d.status as any
          })));
        }
        if (sData) {
          setStorePlan(sData.plan || "Uji Coba 14 Hari");
          if (sData.logo_base64) {
            setStoreLogo(sData.logo_base64);
            sessionStorage.setItem("storeLogo", sData.logo_base64);
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchAllData();

    // Supabase Realtime Subscriptions
    const channel = supabase.channel('admin-dashboard-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products', filter: `store_slug=eq.${storeSlug}` }, fetchAllData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users', filter: `store_slug=eq.${storeSlug}` }, fetchAllData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions', filter: `store_slug=eq.${storeSlug}` }, fetchAllData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'stores', filter: `slug=eq.${storeSlug}` }, fetchAllData)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [storeSlug]);

  const handleLogout = () => {
    sessionStorage.clear();
    router.push(storeSlug ? `/${storeSlug}/login` : "/Auth");
  };

  // --- CRUD Products ---
  const handleOpenProductModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProdForm({ name: product.name, category: product.category, price: product.price, stock: product.stock, minStock: product.minStock });
    } else {
      setEditingProduct(null);
      setProdForm({ name: "", category: "", price: 0, stock: 0, minStock: 5 });
    }
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await supabase.from("products").update({
          name: prodForm.name,
          category: prodForm.category,
          price: prodForm.price,
          stock: prodForm.stock,
          min_stock: prodForm.minStock
        }).eq("id", editingProduct.id);
      } else {
        await supabase.from("products").insert({
          store_slug: storeSlug,
          name: prodForm.name,
          category: prodForm.category,
          price: prodForm.price,
          stock: prodForm.stock,
          min_stock: prodForm.minStock
        });
      }
      setIsProductModalOpen(false);
    } catch (error) {
      console.error("Gagal menyimpan produk:", error);
      alert("Terjadi kesalahan saat menyimpan produk.");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      try {
        await supabase.from("products").delete().eq("id", id);
      } catch (error) {
        console.error("Gagal menghapus produk:", error);
      }
    }
  };

  // --- CRUD Users ---
  const handleOpenUserModal = (user?: SystemUser) => {
    if (user) {
      setEditingUser(user);
      setUserForm({ name: user.name, email: user.email, password: "", role: user.role, status: user.status });
    } else {
      setEditingUser(null);
      setUserForm({ name: "", email: "", password: "", role: "Kasir", status: "Aktif" });
    }
    setIsUserModalOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await supabase.from("users").update({
          name: userForm.name,
          email: userForm.email,
          role: userForm.role,
          status: userForm.status
        }).eq("id", editingUser.id);
      } else {
        const dummyEmail = `${userForm.email.toLowerCase().replace(/[^a-z0-9]/g, '')}@vendora.local`;
        await supabase.auth.signUp({ email: dummyEmail, password: userForm.password });

        await supabase.from("users").insert({
          store_slug: storeSlug,
          name: userForm.name,
          email: userForm.email, // We store the actual username here (reusing the 'email' field in state)
          role: userForm.role,
          status: userForm.status
        });
      }
      setIsUserModalOpen(false);
    } catch (error: any) {
      console.error("Gagal menyimpan pengguna:", error);
      alert("Terjadi kesalahan: " + error.message);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) {
      try {
        await supabase.from("users").delete().eq("id", id);
      } catch (error) {
        console.error("Gagal menghapus pengguna:", error);
      }
    }
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await supabase.from("stores").update({
        name: settingStoreName,
        logoBase64: settingStoreLogo
      }).eq("slug", storeSlug);
      sessionStorage.setItem("storeName", settingStoreName);
      sessionStorage.setItem("storeLogo", settingStoreLogo);
      setStoreName(settingStoreName);
      setStoreLogo(settingStoreLogo);
      alert("Pengaturan toko berhasil diperbarui!");
    } catch (err: any) {
      alert("Gagal memperbarui toko: " + err.message);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 500000) {
      alert("Ukuran logo maksimal 500KB!");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Str = event.target?.result as string;
      setSettingStoreLogo(base64Str);
    };
    reader.readAsDataURL(file);
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
    <main className="min-h-screen bg-white flex font-sans text-slate-800">
      {/* 1. Left Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-100 min-h-screen p-6 justify-between shrink-0">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-600/20">
              <BuildingStorefrontIcon className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold text-slate-900 tracking-tight truncate">
              {storeName.split(' ')[0]} <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full ml-1 align-top">ADMIN</span>
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
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 ${isActive
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
            <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm uppercase">
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
            <div className="lg:hidden flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-orange-600 flex items-center justify-center text-white text-sm">
                <BuildingStorefrontIcon className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold text-slate-900">Vendora Admin</span>
            </div>
            <h2 className="hidden lg:block text-xl font-semibold text-slate-900 tracking-tight">
              {activeTab === "Overview" && "Ringkasan Dashboard"}
              {activeTab === "Products" && "Manajemen Produk & Stok"}
              {activeTab === "Users" && "Manajemen Pengguna Sistem"}
              {activeTab !== "Overview" && activeTab !== "Products" && activeTab !== "Users" && itemLabel(activeTab, navigation)}
            </h2>
          </div>
          <div className="flex items-center gap-5">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
              <BellIcon className="h-6 w-6" />
              {lowStockCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white" />
              )}
            </button>
          </div>
        </header>

        {/* Dashboard Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">

          {activeTab === "Overview" && (
            <>
              {/* Main Metric Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-slate-500">Total Pendapatan</span>
                    <div className="h-10 w-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                      <BanknotesIcon className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    Rp {transactions.reduce((acc, t) => acc + t.total, 0).toLocaleString("id-ID")}
                  </h3>
                  <div className="flex items-center text-sm">
                    <span className="text-emerald-500 font-medium">Data Real-time</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-slate-500">Total Transaksi</span>
                    <div className="h-10 w-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                      <DocumentTextIcon className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{transactions.length}</h3>
                  <div className="flex items-center text-sm">
                    <span className="text-slate-400">Struk tercatat</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-slate-500">Produk Aktif</span>
                    <div className="h-10 w-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                      <ShoppingBagIcon className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{products.length}</h3>
                  <div className="flex items-center text-sm">
                    <span className="font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                      Item di database
                    </span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-slate-500">Peringatan Stok</span>
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${lowStockCount > 0 ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}>
                      <ExclamationTriangleIcon className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className={`text-2xl font-bold mb-2 ${lowStockCount > 0 ? "text-red-600" : "text-slate-900"}`}>
                    {lowStockCount}
                  </h3>
                  <div className="flex items-center text-sm">
                    {lowStockCount > 0 ? (
                      <span className="font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                        Butuh Restok Segera
                      </span>
                    ) : (
                      <span className="font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        Semua Stok Aman
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "Products" && (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900">Katalog Produk</h3>
                <button
                  onClick={() => {
                    if (storePlan === "Starter" && products.length >= 200) {
                      alert("Paket Starter dibatasi maksimal 200 produk. Upgrade ke Business Pro untuk produk tanpa batas!");
                      return;
                    }
                    handleOpenProductModal();
                  }}
                  className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm shadow-orange-600/20 hover:shadow-md"
                >
                  <PlusIcon className="h-5 w-5" />
                  Tambah Produk
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 text-xs font-semibold uppercase tracking-wider bg-slate-50/50">
                      <th className="py-4 px-4 rounded-tl-lg">Nama Produk</th>
                      <th className="py-4 px-4">Kategori</th>
                      <th className="py-4 px-4">Harga</th>
                      <th className="py-4 px-4">Stok</th>
                      <th className="py-4 px-4 text-right rounded-tr-lg">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-400">
                          <ArchiveBoxIcon className="h-12 w-12 mx-auto mb-3 text-slate-200" />
                          <p>Belum ada produk. Silakan tambah produk pertama Anda.</p>
                        </td>
                      </tr>
                    ) : (
                      products.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50 transition duration-150">
                          <td className="py-4 px-4 font-semibold text-slate-900">{p.name}</td>
                          <td className="py-4 px-4 text-slate-500">
                            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-xs">{p.category}</span>
                          </td>
                          <td className="py-4 px-4 text-slate-700 font-medium">Rp {p.price.toLocaleString("id-ID")}</td>
                          <td className="py-4 px-4">
                            <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${p.stock <= p.minStock ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                              {p.stock}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button onClick={() => handleOpenProductModal(p)} className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                                <PencilSquareIcon className="h-5 w-5" />
                              </button>
                              <button onClick={() => handleDeleteProduct(p.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "Users" && (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900">Daftar Pengguna Sistem</h3>
                <button
                  onClick={() => {
                    // Cek batasan Kasir
                    const cashiers = users.filter(u => u.role === "Kasir").length;
                    if (storePlan === "Starter" && cashiers >= 1) {
                      alert("Paket Starter hanya mengizinkan 1 Akun Kasir. Upgrade ke Business Pro untuk jumlah kasir tanpa batas!");
                      return;
                    }
                    handleOpenUserModal();
                  }}
                  className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
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
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-400">
                          <p>Belum ada karyawan yang terdaftar.</p>
                        </td>
                      </tr>
                    ) : (
                      users.map((u) => (
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
                              <button onClick={() => handleOpenUserModal(u)} className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                                <PencilSquareIcon className="h-5 w-5" />
                              </button>
                              <button onClick={() => handleDeleteUser(u.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "Transactions" && (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900">Riwayat Transaksi Kasir</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 text-xs font-semibold uppercase tracking-wider bg-slate-50/50">
                      <th className="py-4 px-4 rounded-tl-lg">ID / Waktu</th>
                      <th className="py-4 px-4">Pelanggan</th>
                      <th className="py-4 px-4">Metode</th>
                      <th className="py-4 px-4">Total Pendapatan</th>
                      <th className="py-4 px-4 rounded-tr-lg">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {transactions.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-400">
                          <DocumentTextIcon className="h-12 w-12 mx-auto mb-3 text-slate-200" />
                          <p>Belum ada riwayat transaksi dari kasir.</p>
                        </td>
                      </tr>
                    ) : (
                      transactions.map((t) => (
                        <tr key={t.id} className="hover:bg-slate-50 transition duration-150">
                          <td className="py-4 px-4">
                            <div className="font-semibold text-slate-900 truncate max-w-[120px]" title={t.id}>{t.id}</div>
                            <div className="text-xs text-slate-500">{new Date(t.date).toLocaleString('id-ID')}</div>
                          </td>
                          <td className="py-4 px-4 text-slate-700 font-medium">{t.customer}</td>
                          <td className="py-4 px-4">
                            <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-xs font-semibold">{t.method}</span>
                          </td>
                          <td className="py-4 px-4 text-orange-600 font-bold">Rp {t.total.toLocaleString("id-ID")}</td>
                          <td className="py-4 px-4">
                            <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                              {t.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "Customers" && storePlan === "Starter" && (
            <div className="bg-white p-12 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-slate-50/50 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-6">
                <LockClosedIcon className="h-16 w-16 text-orange-600 mb-4" />
                <h3 className="text-2xl font-black text-slate-900 mb-2">Fitur Terkunci</h3>
                <p className="text-slate-600 max-w-md mx-auto mb-6">Paket <strong>Starter</strong> tidak memiliki akses ke Manajemen Pelanggan (CRM). Dapatkan wawasan berharga tentang pelanggan loyal Anda dengan Business Pro.</p>
                <a href="/pricing" className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-orange-600/30 transition-transform hover:scale-105">
                  Upgrade ke Business Pro
                </a>
              </div>
              <div className="opacity-20 pointer-events-none">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Pelanggan Loyal</h3>
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 text-xs font-semibold uppercase tracking-wider bg-slate-50/50">
                      <th className="py-4 px-4 rounded-tl-lg">Peringkat</th>
                      <th className="py-4 px-4">Nama Pelanggan</th>
                      <th className="py-4 px-4">Total Kunjungan</th>
                      <th className="py-4 px-4">Total Dibelanjakan</th>
                      <th className="py-4 px-4 rounded-tr-lg">Terakhir Belanja</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td colSpan={5} className="py-12"></td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "Customers" && storePlan !== "Starter" && (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900">Pelanggan Loyal</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 text-xs font-semibold uppercase tracking-wider bg-slate-50/50">
                      <th className="py-4 px-4 rounded-tl-lg">Peringkat</th>
                      <th className="py-4 px-4">Nama Pelanggan</th>
                      <th className="py-4 px-4">Total Kunjungan</th>
                      <th className="py-4 px-4">Total Dibelanjakan</th>
                      <th className="py-4 px-4 rounded-tr-lg">Terakhir Belanja</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {topCustomers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-400">
                          <UserGroupIcon className="h-12 w-12 mx-auto mb-3 text-slate-200" />
                          <p>Belum ada data pelanggan tercatat.</p>
                        </td>
                      </tr>
                    ) : (
                      topCustomers.map((c, idx) => (
                        <tr key={c.name} className="hover:bg-slate-50 transition duration-150">
                          <td className="py-4 px-4 font-bold text-slate-400">#{idx + 1}</td>
                          <td className="py-4 px-4">
                            <div className="font-semibold text-slate-900">{c.name}</div>
                          </td>
                          <td className="py-4 px-4 text-slate-600 font-medium">{c.visitCount} kali</td>
                          <td className="py-4 px-4 text-orange-600 font-bold">Rp {c.totalSpend.toLocaleString("id-ID")}</td>
                          <td className="py-4 px-4 text-slate-500 text-xs">
                            {new Date(c.lastVisit).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "Reports" && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-900">Tren Pendapatan Harian (7 Hari Terakhir)</h3>
                </div>
                <div className="h-64 flex items-end gap-2 pt-10">
                  {dailyRevenue.map((d) => (
                    <div key={d.date} className="flex-1 flex flex-col items-center gap-2 group">
                      <div className="text-xs font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        Rp {(d.total / 1000).toFixed(0)}k
                      </div>
                      <div
                        className="w-full bg-orange-200 group-hover:bg-orange-500 transition-colors rounded-t-lg relative"
                        style={{ height: `${(d.total / maxRevenue) * 100}%`, minHeight: '4px' }}
                      ></div>
                      <div className="text-xs font-medium text-slate-500 truncate w-full text-center">
                        {d.date.split('-').slice(1, 3).join('/')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-900">Metode Pembayaran Populer</h3>
                </div>
                <div className="space-y-4">
                  {methodsChart.length === 0 ? (
                    <div className="py-10 text-center text-slate-400">
                      <ChartPieIcon className="h-12 w-12 mx-auto mb-3 text-slate-200" />
                      <p>Belum ada data pembayaran tercatat.</p>
                    </div>
                  ) : (
                    methodsChart.map(m => (
                      <div key={m.method} className="space-y-2">
                        <div className="flex justify-between text-sm font-semibold">
                          <span className="text-slate-700">{m.method} <span className="text-slate-400 font-normal">({m.count} trx)</span></span>
                          <span className="text-slate-900">{m.percentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5">
                          <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: `${m.percentage}%` }}></div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "Settings" && (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6 max-w-2xl">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="h-10 w-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                  <CogIcon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Pengaturan Toko Umum</h3>
              </div>
              <form onSubmit={handleUpdateSettings} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-slate-700">Nama Toko</label>
                  <input
                    type="text"
                    value={settingStoreName}
                    onChange={e => setSettingStoreName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 text-sm"
                    required
                  />
                  <p className="text-xs text-slate-500">Nama toko ini akan tampil di Nota, Dashboard Kasir, dan halaman Login.</p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <label className="block text-sm font-semibold text-slate-700">Logo Toko (Opsional)</label>
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-50 overflow-hidden shrink-0">
                      {settingStoreLogo ? (
                        <img src={settingStoreLogo} alt="Logo" className="h-full w-full object-contain" />
                      ) : (
                        <span className="text-xs text-slate-400 text-center px-1">Tanpa Logo</span>
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        accept="image/png, image/jpeg"
                        onChange={handleLogoUpload}
                        className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">Maksimal 500KB. Format: JPG/PNG.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-sm transition-colors text-sm"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </section>

      {/* Modal Tambah/Edit Produk */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900">
                {editingProduct ? "Edit Produk" : "Tambah Produk Baru"}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                Tutup
              </button>
            </div>
            <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Nama Produk</label>
                <input
                  type="text"
                  value={prodForm.name}
                  onChange={e => setProdForm({ ...prodForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 text-sm"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Kategori</label>
                <input
                  type="text"
                  value={prodForm.category}
                  onChange={e => setProdForm({ ...prodForm, category: e.target.value })}
                  placeholder="Misal: Minuman, Snack"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 text-sm"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Harga (Rp)</label>
                  <input
                    type="number"
                    value={prodForm.price}
                    onChange={e => setProdForm({ ...prodForm, price: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 text-sm"
                    min="0"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Stok Saat Ini</label>
                  <input
                    type="number"
                    value={prodForm.stock}
                    onChange={e => setProdForm({ ...prodForm, stock: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 text-sm"
                    min="0"
                    required
                  />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-600/20 transition-all"
                >
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tambah/Edit Pengguna */}
      {isUserModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900">
                {editingUser ? "Edit Pengguna" : "Tambah Pengguna Baru"}
              </h3>
              <button
                onClick={() => setIsUserModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                Tutup
              </button>
            </div>
            <form onSubmit={handleSaveUser} className="p-6 space-y-4">
              <div className="bg-blue-50 border border-blue-200 text-blue-700 text-xs px-4 py-3 rounded-xl mb-2">
                <strong>Info:</strong> Karyawan yang dibuat di sini akan <strong>otomatis dibuatkan akun</strong> dan bisa langsung *login* menggunakan username dan kata sandi yang Anda tentukan!
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Nama Lengkap</label>
                <input
                  type="text"
                  value={userForm.name}
                  onChange={e => setUserForm({ ...userForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 text-sm"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Username</label>
                <input
                  type="text"
                  value={userForm.email}
                  onChange={e => setUserForm({ ...userForm, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 text-sm"
                  required
                  disabled={!!editingUser}
                />
              </div>
              {!editingUser && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Kata Sandi (Password)</label>
                  <input
                    type="password"
                    value={userForm.password}
                    onChange={e => setUserForm({ ...userForm, password: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 text-sm"
                    required
                    minLength={6}
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Peran (Role)</label>
                  <select
                    value={userForm.role}
                    onChange={e => setUserForm({ ...userForm, role: e.target.value as "Admin" | "Kasir" })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 text-sm bg-white"
                  >
                    <option value="Kasir">Kasir</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Status Akun</label>
                  <select
                    value={userForm.status}
                    onChange={e => setUserForm({ ...userForm, status: e.target.value as "Aktif" | "Nonaktif" })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 text-sm bg-white"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-600/20 transition-all"
                >
                  Simpan Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

function itemLabel(name: string, nav: any[]) {
  const f = nav.find(n => n.name === name);
  return f ? f.label : name;
}
function updateDoc(arg0: any, arg1: { name: string; logoBase64: string; }) {
  throw new Error("Function not implemented.");
}

function doc(db: any, arg1: string, storeSlug: string): any {
  throw new Error("Function not implemented.");
}

