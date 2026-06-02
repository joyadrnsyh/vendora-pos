"use client";

import React, { useState, useEffect } from "react";
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
  XMarkIcon
} from "@heroicons/react/24/outline";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

const mockProducts: Product[] = [
  { id: "p1", name: "Espresso", category: "Kopi", price: 15000, stock: 50, image: "☕" },
  { id: "p2", name: "Americano", category: "Kopi", price: 18000, stock: 45, image: "☕" },
  { id: "p3", name: "Cappuccino", category: "Kopi", price: 22000, stock: 30, image: "☕" },
  { id: "p4", name: "Cafe Latte", category: "Kopi", price: 24000, stock: 35, image: "☕" },
  { id: "p5", name: "Matcha Latte", category: "Non-Kopi", price: 25000, stock: 20, image: "🍵" },
  { id: "p6", name: "Taro Latte", category: "Non-Kopi", price: 24000, stock: 15, image: "🍠" },
  { id: "p7", name: "Lemon Tea", category: "Teh", price: 15000, stock: 40, image: "🍋" },
  { id: "p8", name: "Croissant", category: "Makanan", price: 20000, stock: 10, image: "🥐" },
  { id: "p9", name: "Brownies", category: "Makanan", price: 18000, stock: 12, image: "🍫" },
];

const categories = ["Semua", "Kopi", "Non-Kopi", "Teh", "Makanan"];

export default function CashierDashboard() {
  const router = useRouter();
  const [storeName, setStoreName] = useState("Toko Vendora");
  const [userName, setUserName] = useState("Siti Nurhaliza");

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  useEffect(() => {
    // Simulasi bypass login untuk sementara
    const storedStore = localStorage.getItem("storeName") || "Vendora Store #01";
    setTimeout(() => {
      setStoreName(storedStore);
      setUserName("Siti Kasir");
    }, 0);
  }, []);

  const handleLogout = () => {
    const slug = localStorage.getItem("storeSlug");
    localStorage.clear();
    router.push(slug ? `/${slug}/login` : "/Auth");
  };

  const filteredProducts = mockProducts.filter((p) => {
    const matchCategory = selectedCategory === "Semua" || p.category === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
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

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setCheckoutSuccess(true);
    setTimeout(() => {
      setCart([]);
      setCheckoutSuccess(false);
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 h-screen overflow-hidden">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-600/20">
            <BuildingStorefrontIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
              Vendora POS
            </h1>
            <span className="text-xs font-medium text-slate-500">{storeName}</span>
          </div>
          <span className="ml-4 bg-orange-100 text-orange-600 px-2.5 py-1 rounded-full text-xs font-bold">
            KASIR
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 bg-slate-50 pl-3 pr-4 py-1.5 rounded-full border border-slate-200">
            <div className="h-8 w-8 rounded-full bg-orange-200 flex items-center justify-center text-orange-700 font-bold text-xs">
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
              {categories.map((cat) => (
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
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-orange-200 transition-all text-left flex flex-col h-full group"
                >
                  <div className="h-24 w-full bg-slate-50 rounded-xl mb-4 flex items-center justify-center text-4xl group-hover:scale-105 transition-transform">
                    {product.image}
                  </div>
                  <div className="mt-auto">
                    <p className="text-xs text-slate-400 mb-1">{product.category}</p>
                    <h3 className="text-sm font-bold text-slate-900 mb-1 line-clamp-2">{product.name}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-orange-600 font-bold text-sm">Rp {product.price.toLocaleString("id-ID")}</p>
                      <span className="text-[10px] font-medium bg-slate-100 px-2 py-0.5 rounded text-slate-500">
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
                  <div className="h-14 w-14 bg-slate-50 rounded-lg flex items-center justify-center text-2xl shrink-0">
                    {item.image}
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
              onClick={handleCheckout}
              disabled={cart.length === 0 || checkoutSuccess}
              className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 mt-4 ${cart.length === 0
                  ? "bg-slate-300 cursor-not-allowed shadow-none"
                  : checkoutSuccess
                    ? "bg-emerald-500 shadow-emerald-500/20"
                    : "bg-orange-600 hover:bg-orange-700 shadow-orange-600/20 hover:shadow-xl hover:-translate-y-0.5"
                }`}
            >
              {checkoutSuccess ? (
                <>
                  <CheckCircleIcon className="h-6 w-6" />
                  Pembayaran Berhasil!
                </>
              ) : (
                <>
                  Bayar Sekarang
                </>
              )}
            </button>
          </div>
        </aside>

      </div>
    </main>
  );
}
