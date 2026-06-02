"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import "../../globals.css";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    if (pathname !== "/") {
        return null;
    }

    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        setIsOpen(false); // Close mobile menu if open

        if (pathname !== "/") {
            router.push("/");
            if (id === "top") {
                window.scrollTo({ top: 0, behavior: "smooth" });
                return;
            }
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) {
                    const offset = 90;
                    const bodyRect = document.body.getBoundingClientRect().top;
                    const elementRect = element.getBoundingClientRect().top;
                    const elementPosition = elementRect - bodyRect;
                    const offsetPosition = elementPosition - offset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth",
                    });
                }
            }, 100);
            return;
        }

        if (id === "top") {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        const element = document.getElementById(id);
        if (element) {
            const offset = 90; // offset to compensate for the fixed floating navbar
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            });
        }
    };

    return (
        <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
            <div className="flex items-center justify-between px-6 py-4 rounded-2xl border border-slate-200/50 bg-white/80 backdrop-blur-xl shadow-md transition-all duration-300">

                {/* Logo */}
                <button
                    onClick={() => router.push("/")}
                    className="flex items-center cursor-pointer focus:outline-none"
                    aria-label="Kembali ke Beranda"
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/logo-vendora.png"
                        alt="Vendora POS Logo"
                        className="w-36 h-auto object-contain transition duration-300 hover:scale-[1.02]"
                    />
                </button>


                <ul className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
                    <li>
                        <a
                            href="#"
                            onClick={(e) => handleScroll(e, "top")}
                            className="relative py-1 group transition hover:text-orange-600"
                        >
                            Beranda
                            <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-orange-600 transition-all duration-300 group-hover:w-full"></span>
                        </a>
                    </li>

                    <li>
                        <a
                            href="#services"
                            onClick={(e) => handleScroll(e, "services")}
                            className="relative py-1 group transition hover:text-orange-600"
                        >
                            Fitur
                            <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-orange-600 transition-all duration-300 group-hover:w-full"></span>
                        </a>
                    </li>

                    <li>
                        <a
                            href="#portfolio"
                            onClick={(e) => handleScroll(e, "portfolio")}
                            className="relative py-1 group transition hover:text-orange-600"
                        >
                            Bisnis
                            <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-orange-600 transition-all duration-300 group-hover:w-full"></span>
                        </a>
                    </li>

                    <li>
                        <a
                            href="#pricing"
                            onClick={(e) => handleScroll(e, "pricing")}
                            className="relative py-1 group transition hover:text-orange-600"
                        >
                            Harga
                            <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-orange-600 transition-all duration-300 group-hover:w-full"></span>
                        </a>
                    </li>

                    <li>
                        <a
                            href="#faq"
                            onClick={(e) => handleScroll(e, "faq")}
                            className="relative py-1 group transition hover:text-orange-600"
                        >
                            FAQ
                            <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-orange-600 transition-all duration-300 group-hover:w-full"></span>
                        </a>
                    </li>
                </ul>

                {/* CTA Button & Hamburger */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/pricing"
                        className="hidden sm:inline-block px-5 py-2.5 rounded-full bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold shadow-md shadow-orange-600/10 hover:shadow-lg hover:shadow-orange-600/20 hover:scale-[1.03] transition duration-300"
                    >
                        Get Started
                    </Link>

                    {/* Hamburger Toggle */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 text-slate-600 hover:text-orange-600 focus:outline-none transition"
                        aria-label="Toggle Menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

            </div>

            {/* Mobile Menu Drawer */}
            {isOpen && (
                <div className="md:hidden mt-3 rounded-2xl border border-slate-200/50 bg-white/95 backdrop-blur-xl shadow-lg p-5 animate-in fade-in slide-in-from-top-3 duration-200">
                    <ul className="flex flex-col gap-4 text-sm font-semibold text-slate-600">
                        <li>
                            <a
                                href="#"
                                onClick={(e) => handleScroll(e, "top")}
                                className="block py-2 hover:text-orange-600 transition"
                            >
                                Beranda
                            </a>
                        </li>
                        <li>
                            <a
                                href="#services"
                                onClick={(e) => handleScroll(e, "services")}
                                className="block py-2 hover:text-orange-600 transition"
                            >
                                Fitur
                            </a>
                        </li>
                        <li>
                            <a
                                href="#portfolio"
                                onClick={(e) => handleScroll(e, "portfolio")}
                                className="block py-2 hover:text-orange-600 transition"
                            >
                                Bisnis
                            </a>
                        </li>
                        <li>
                            <a
                                href="#pricing"
                                onClick={(e) => handleScroll(e, "pricing")}
                                className="block py-2 hover:text-orange-600 transition"
                            >
                                Harga
                            </a>
                        </li>
                        <li>
                            <a
                                href="#faq"
                                onClick={(e) => handleScroll(e, "faq")}
                                className="block py-2 hover:text-orange-600 transition"
                            >
                                FAQ
                            </a>
                        </li>
                        <li className="pt-2 border-t border-slate-100 sm:hidden">
                            <Link
                                href="/pricing"
                                className="block w-full text-center px-5 py-3 rounded-full bg-orange-600 text-white font-semibold text-sm hover:bg-orange-700 transition"
                                onClick={() => setIsOpen(false)}
                            >
                                Mulai Sekarang
                            </Link>
                        </li>
                    </ul>
                </div>
            )}
        </nav>
    );
}
