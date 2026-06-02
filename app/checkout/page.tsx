"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import "../globals.css";
import { CheckCircleIcon, ArrowLeftIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

const PLAN_DETAILS: Record<string, { name: string, price: number, text: string }> = {
  starter: { name: "Starter", price: 149000, text: "Rp 149.000 / bulan" },
  pro: { name: "Business Pro", price: 299000, text: "Rp 299.000 / bulan" },
  enterprise: { name: "Enterprise Custom", price: 999000, text: "Hubungi Sales" }
};

function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planKey = searchParams.get("plan") || "starter";
  const selectedPlan = PLAN_DETAILS[planKey] || PLAN_DETAILS["starter"];

  const [paymentMethod, setPaymentMethod] = useState("qris");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulasi proses payment gateway API call
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Simpan session sukses (mock)
      sessionStorage.setItem("hasPaid", "true");
      sessionStorage.setItem("planSubscribed", selectedPlan.name);

      setTimeout(() => {
        router.push("/Auth?paid=true");
      }, 2000);
    }, 2500);
  };

  if (isSuccess) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-xl text-center max-w-md mx-auto animate-fade-in-up">
        <div className="h-20 w-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircleIcon className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Pembayaran Berhasil!</h2>
        <p className="text-slate-500 mb-8">Terima kasih telah berlangganan paket {selectedPlan.name}. Anda akan dialihkan ke halaman pendaftaran...</p>
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Kiri: Ringkasan Pesanan */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Ringkasan Pesanan</h2>
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Paket {selectedPlan.name}</h3>
                <p className="text-sm text-slate-500">Langganan 1 Bulan</p>
              </div>
              <span className="font-black text-orange-600 text-lg">Rp {(selectedPlan.price).toLocaleString("id-ID")}</span>
            </div>
            <div className="border-t border-slate-200 my-4"></div>
            <div className="flex justify-between items-center text-sm mb-2 text-slate-600">
              <span>Subtotal</span>
              <span>Rp {(selectedPlan.price).toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between items-center text-sm mb-4 text-slate-600">
              <span>Pajak (PPN 11%)</span>
              <span>Rp {(selectedPlan.price * 0.11).toLocaleString("id-ID")}</span>
            </div>
            <div className="border-t border-slate-200 my-4"></div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-900">Total Pembayaran</span>
              <span className="font-black text-2xl text-slate-900">Rp {(selectedPlan.price * 1.11).toLocaleString("id-ID")}</span>
            </div>
          </div>
          
          <div className="flex items-start gap-3 text-sm text-slate-500 bg-orange-50 p-4 rounded-xl text-orange-800 border border-orange-100">
            <ShieldCheckIcon className="h-6 w-6 text-orange-600 shrink-0" />
            <p><strong>Simulasi Checkout:</strong> Ini adalah halaman simulasi. Anda tidak akan dikenakan biaya sungguhan.</p>
          </div>
        </div>
      </div>

      {/* Kanan: Metode Pembayaran */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Pilih Metode Pembayaran</h2>
        <form onSubmit={handlePayment} className="space-y-6">
          <div className="space-y-3">
            <label className={`block border-2 rounded-xl p-4 cursor-pointer transition-all ${paymentMethod === 'qris' ? 'border-orange-500 bg-orange-50' : 'border-slate-200 hover:border-orange-200'}`}>
              <div className="flex items-center gap-3">
                <input type="radio" name="payment" value="qris" checked={paymentMethod === 'qris'} onChange={() => setPaymentMethod('qris')} className="h-5 w-5 text-orange-600 focus:ring-orange-500" />
                <span className="font-bold text-slate-900">QRIS (GoPay, OVO, Dana, LinkAja)</span>
              </div>
            </label>
            <label className={`block border-2 rounded-xl p-4 cursor-pointer transition-all ${paymentMethod === 'va' ? 'border-orange-500 bg-orange-50' : 'border-slate-200 hover:border-orange-200'}`}>
              <div className="flex items-center gap-3">
                <input type="radio" name="payment" value="va" checked={paymentMethod === 'va'} onChange={() => setPaymentMethod('va')} className="h-5 w-5 text-orange-600 focus:ring-orange-500" />
                <span className="font-bold text-slate-900">BCA Virtual Account</span>
              </div>
            </label>
            <label className={`block border-2 rounded-xl p-4 cursor-pointer transition-all ${paymentMethod === 'cc' ? 'border-orange-500 bg-orange-50' : 'border-slate-200 hover:border-orange-200'}`}>
              <div className="flex items-center gap-3">
                <input type="radio" name="payment" value="cc" checked={paymentMethod === 'cc'} onChange={() => setPaymentMethod('cc')} className="h-5 w-5 text-orange-600 focus:ring-orange-500" />
                <span className="font-bold text-slate-900">Kartu Kredit / Debit</span>
              </div>
            </label>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={isProcessing}
              className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                isProcessing ? "bg-slate-400 cursor-not-allowed" : "bg-orange-600 hover:bg-orange-700 shadow-orange-600/30"
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Memproses Pembayaran...
                </>
              ) : (
                `Bayar Rp ${(selectedPlan.price * 1.11).toLocaleString("id-ID")}`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-900 py-12 px-6">
      <div className="max-w-7xl mx-auto mb-8">
        <Link href="/pricing" className="flex items-center gap-2 text-slate-500 hover:text-orange-600 transition-colors font-medium w-fit">
          <ArrowLeftIcon className="h-5 w-5" />
          Kembali ke Pilihan Paket
        </Link>
      </div>
      
      <Suspense fallback={<div className="text-center py-20">Memuat Gerbang Pembayaran...</div>}>
        <CheckoutForm />
      </Suspense>
    </main>
  );
}
