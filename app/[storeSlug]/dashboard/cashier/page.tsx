/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import "../../../globals.css";
import {
  BuildingStorefrontIcon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  TrashIcon,
  PlusIcon,
  MinusIcon,
  ArrowLeftOnRectangleIcon,
  CheckCircleIcon,
  XMarkIcon,
  PrinterIcon
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

interface CartItem extends Product {
  quantity: number;
}

export default function CashierDashboard({ params }: { params: Promise<{ storeSlug: string }> }) {
  const { storeSlug } = use(params);
  const router = useRouter();

  const [storeName, setStoreName] = useState("");
  const [userName, setUserName] = useState("");
  const [storeLogo, setStoreLogo] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Checkout Modal State
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Tunai");

  // Notifikasi
  const [toastMsg, setToastMsg] = useState("");
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 4000);
  };

  useEffect(() => {
    const storedStore = sessionStorage.getItem("storeName") || storeSlug.replace(/-/g, " ").toUpperCase();
    const storedUser = sessionStorage.getItem("userName") || "Kasir Vendora";
    const storedLogo = sessionStorage.getItem("storeLogo") || "";
    setStoreName(storedStore);
    setUserName(storedUser);
    setStoreLogo(storedLogo);
    setCurrentDate(new Date().toLocaleString('id-ID'));

    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('store_slug', storeSlug);

      if (data) {
        setProducts(data.map(d => ({
          id: d.id,
          name: d.name,
          category: d.category,
          price: d.price,
          stock: d.stock,
          minStock: d.min_stock
        })));
      } else if (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();

    const channel = supabase.channel('cashier-products')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products', filter: `store_slug=eq.${storeSlug}` }, fetchProducts)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [storeSlug]);

  const handleLogout = () => {
    sessionStorage.clear();
    router.push(storeSlug ? `/${storeSlug}/login` : "/Auth");
  };

  const handlePrint = () => {
    window.print();
  };

  // Extract unique categories from actual products or use defaults
  const dynamicCategories = ["Semua", ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter((p) => {
    const matchCategory = selectedCategory === "Semua" || p.category === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      alert("Stok produk ini habis!");
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          alert(`Maksimal stok untuk ${product.name} adalah ${product.stock}`);
          return prev;
        }
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          if (newQty > item.stock) {
            alert(`Maksimal stok adalah ${item.stock}`);
            return item;
          }
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      })
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.11; // 11% PPN
  const total = subtotal + tax;

  const handleOpenCheckoutModal = () => {
    if (cart.length === 0) return;
    setIsCheckoutModalOpen(true);
    setCustomerName("Pelanggan Umum");
    setPaymentMethod("Tunai");
  };

  const executeCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    try {
      // 1. Catat Transaksi
      const { data: transaction, error: tError } = await supabase.from("transactions").insert({
        store_slug: storeSlug,
        customer_name: customerName,
        total: total,
        method: paymentMethod,
        status: "Sukses",
        cashier_name: userName
      }).select().single();

      if (tError) throw tError;

      // 1b. Catat Transaction Items
      const tItems = cart.map(item => ({
        transaction_id: transaction.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }));
      
      const { error: iError } = await supabase.from("transaction_items").insert(tItems);
      if (iError) throw iError;

      // 2. Potong Stok (Secara berurutan, dalam produksi nyata disarankan pakai RPC di postgres)
      for (const item of cart) {
        const newStock = item.stock - item.quantity;
        const { error: sError } = await supabase.from("products").update({ stock: newStock }).eq("id", item.id);
        if (sError) console.error("Error updating stock for", item.name, sError);
      }

      // Sukses
      setIsCheckoutModalOpen(false);
      setCheckoutSuccess(true);
      showToast("Penjualan berhasil dicatat!");
    } catch (error) {
      console.error("Gagal melakukan checkout:", error);
      alert("Terjadi kesalahan saat memproses pembayaran.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 h-screen overflow-hidden">
      {/* Global Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl z-50 flex items-center gap-3">
          <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-semibold">{toastMsg}</span>
        </div>
      )}
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          {storeLogo ? (
            <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden border border-slate-200">
              <img src={storeLogo} alt="Logo" className="h-full w-full object-contain" />
            </div>
          ) : (
            <div className="h-10 w-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-600/20">
              <BuildingStorefrontIcon className="h-6 w-6" />
            </div>
          )}
          <span className="text-2xl font-bold text-slate-900 tracking-tight truncate">
            {storeName} <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full ml-1 align-top">KASIR</span>
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 bg-slate-50 pl-3 pr-4 py-1.5 rounded-full border border-slate-200">
            <div className="h-8 w-8 rounded-full bg-orange-200 flex items-center justify-center text-orange-700 font-bold text-xs uppercase">
              {userName.charAt(0)}
            </div>
            <div className="text-sm font-semibold text-slate-700">{userName}</div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-500 hover:text-red-600 font-medium text-sm transition-colors"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left Side: Products */}
        <section className="flex-1 flex flex-col bg-slate-50 p-6 overflow-hidden">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari produk..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-sm"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
              {dynamicCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedCategory === cat
                    ? "bg-orange-600 text-white shadow-md shadow-orange-600/20"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1 overflow-y-auto pr-2 pb-10">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  disabled={product.stock <= 0}
                  className={`bg-white p-4 rounded-2xl border ${product.stock <= 0 ? 'border-red-200 opacity-60 cursor-not-allowed' : 'border-slate-200 hover:shadow-md hover:border-orange-200'} shadow-sm transition-all text-left flex flex-col h-full group`}
                >
                  <div className="h-24 w-full bg-orange-50 rounded-xl mb-4 flex items-center justify-center text-4xl group-hover:scale-105 transition-transform text-orange-400 font-black uppercase">
                    {product.name.charAt(0)}
                  </div>
                  <div className="mt-auto w-full">
                    <p className="text-xs text-slate-400 mb-1 truncate">{product.category}</p>
                    <h3 className="text-sm font-bold text-slate-900 mb-1 line-clamp-2">{product.name}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-orange-600 font-bold text-sm">Rp {product.price.toLocaleString("id-ID")}</p>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${product.stock <= 0 ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
                        Stok: {product.stock}
                      </span>
                    </div>
                  </div>
                </button>
              ))}

              {filteredProducts.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-500">
                  <div className="text-4xl mb-3">🔍</div>
                  <p>Produk tidak ditemukan.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Right Side: Cart */}
        <aside className="w-96 bg-white border-l border-slate-200 flex flex-col shrink-0 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] z-20">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShoppingCartIcon className="h-5 w-5 text-orange-600" />
              Pesanan Saat Ini
            </h2>
            <span className="bg-orange-100 text-orange-700 px-2.5 py-0.5 rounded-full text-xs font-bold">
              {cart.reduce((acc, item) => acc + item.quantity, 0)} Item
            </span>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
                <ShoppingCartIcon className="h-16 w-16 mb-4 text-slate-300" />
                <p className="text-sm font-medium">Keranjang masih kosong</p>
                <p className="text-xs text-slate-400 mt-1">Pilih produk untuk ditambahkan</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm relative group">
                  <div className="h-14 w-14 bg-orange-50 rounded-lg flex items-center justify-center text-2xl shrink-0 text-orange-400 font-bold uppercase">
                    {item.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <h4 className="text-sm font-bold text-slate-900 truncate pr-6">{item.name}</h4>
                    <p className="text-xs font-medium text-orange-600">Rp {(item.price * item.quantity).toLocaleString("id-ID")}</p>

                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1 bg-slate-50 rounded-lg border border-slate-200 p-0.5">
                        <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-white rounded shadow-sm text-slate-600 transition-colors">
                          <MinusIcon className="h-3 w-3" />
                        </button>
                        <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-white rounded shadow-sm text-slate-600 transition-colors">
                          <PlusIcon className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="absolute top-2 right-2 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Checkout Panel */}
          <div className="p-5 border-t border-slate-100 bg-slate-50/80 space-y-3">
            <div className="flex justify-between text-sm text-slate-600">
              <span>Subtotal</span>
              <span className="font-medium">Rp {subtotal.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-600">
              <span>Pajak (PPN 11%)</span>
              <span className="font-medium">Rp {tax.toLocaleString("id-ID")}</span>
            </div>
            <div className="border-t border-slate-200/60 pt-3 flex justify-between items-end">
              <span className="text-sm font-bold text-slate-900">Total</span>
              <span className="text-2xl font-black text-orange-600">Rp {total.toLocaleString("id-ID")}</span>
            </div>

            <button
              onClick={handleOpenCheckoutModal}
              disabled={cart.length === 0}
              className="w-full py-4 rounded-xl font-bold text-white bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-600/20 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0"
            >
              Lanjutkan Pembayaran
            </button>
          </div>
        </aside>
      </div>

      {/* Checkout Success Modal */}
      {checkoutSuccess && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 relative shadow-2xl border border-slate-100 text-center animate-fade-in-up">
            <div className="h-20 w-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircleIcon className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Transaksi Sukses!</h2>
            <p className="text-slate-500 mb-8">Pembayaran berhasil dicatat ke sistem.</p>
            
            <div className="space-y-3">
              <button
                onClick={handlePrint}
                className="w-full py-4 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2"
              >
                <PrinterIcon className="h-5 w-5" /> Cetak Struk
              </button>
              <button
                onClick={() => { setCheckoutSuccess(false); setCart([]); }}
                className="w-full py-4 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Transaksi Baru
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {isCheckoutModalOpen && !checkoutSuccess && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900">Detail Pembayaran</h3>
              <button
                onClick={() => setIsCheckoutModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={executeCheckout} className="p-6 space-y-4">
              <div className="bg-orange-50 text-orange-800 px-4 py-3 rounded-xl flex justify-between items-center mb-2">
                <span className="text-sm font-semibold">Total Tagihan:</span>
                <span className="text-xl font-black">Rp {total.toLocaleString("id-ID")}</span>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Nama Pelanggan</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="Misal: Budi / Pelanggan Umum"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 text-sm"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Metode Pembayaran</label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 text-sm bg-white"
                >
                  <option value="Tunai">Tunai</option>
                  <option value="QRIS">QRIS</option>
                  <option value="Kartu Debit">Kartu Debit</option>
                  <option value="Kartu Kredit">Kartu Kredit</option>
                </select>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all flex justify-center items-center gap-2"
                >
                  <CheckCircleIcon className="h-5 w-5" />
                  Konfirmasi Pembayaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hidden Print Layout */}
      <div className="print-receipt hidden">
        <div className="text-center border-b border-black border-dashed pb-2 mb-2">
          {storeLogo ? (
             <img src={storeLogo} alt="Logo" className="max-w-[100px] max-h-[100px] mx-auto mb-2 object-contain" />
          ) : (
            <div className="font-bold text-lg mb-1">{storeName}</div>
          )}
          <div className="text-xs">Kasir: {userName}</div>
          <div className="text-xs">{currentDate}</div>
        </div>
        
        <div className="text-xs mb-2 pb-2 border-b border-black border-dashed">
          {cart.map((item, i) => (
            <div key={i} className="mb-1">
              <div>{item.name}</div>
              <div className="flex justify-between">
                <span>{item.quantity} x {item.price}</span>
                <span>{item.quantity * item.price}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-xs border-b border-black border-dashed pb-2 mb-2">
          <div className="flex justify-between font-bold">
            <span>TOTAL</span>
            <span>Rp {cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toLocaleString("id-ID")}</span>
          </div>
        </div>

        <div className="text-center text-xs mt-4 font-bold">
          TERIMA KASIH
        </div>
      </div>

    </main>
  );
}
