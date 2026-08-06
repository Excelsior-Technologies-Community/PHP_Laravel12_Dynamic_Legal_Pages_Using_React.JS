import React, { Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";

const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
if (csrfToken) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
}

import MainLayout from "./layout/MainLayout";
import AdminLayout from "./layout/AdminLayout";

const ProductIndex = lazy(() => import("./pages/products/index"));
const ProductCreate = lazy(() => import("./pages/products/create"));
const ProductEdit = lazy(() => import("./pages/products/edit"));

const LegalPageIndex = lazy(() => import("./pages/legalpage/index"));
const LegalPageCreate = lazy(() => import("./pages/legalpage/create"));
const LegalPageEdit = lazy(() => import("./pages/legalpage/edit"));

const AboutUs = lazy(() => import("./pages/legalpage/AboutUs"));
const PrivacyPolicy = lazy(() => import("./pages/legalpage/PrivacyPolicy"));
const TermsAndCondition = lazy(() => import("./pages/legalpage/TermsAndCondition"));

const CustomerHome = lazy(() => import("./pages/customer/Home"));
const CartPage = lazy(() => import("./pages/customer/Cart"));
const ProductDetail = lazy(() => import("./pages/customer/ProductDetail"));

function LoadingFallback() {
    return (
        <div className="container mt-5">
            <div className="text-center py-5">
                <div className="spinner-border text-primary mb-3"></div>
                <p>Loading...</p>
            </div>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Suspense fallback={<LoadingFallback />}>
                <Routes>

                    {/* ---------------- ADMIN (NO HEADER/FOOTER) ---------------- */}
                    <Route path="/" element={<AdminLayout><ProductIndex /></AdminLayout>} />
                    <Route path="/products" element={<AdminLayout><ProductIndex /></AdminLayout>} />
                    <Route path="/create" element={<AdminLayout><ProductCreate /></AdminLayout>} />
                    <Route path="/edit/:id" element={<AdminLayout><ProductEdit /></AdminLayout>} />

                    {/* ---------------- LEGAL CRUD (NO HEADER/FOOTER) ---------------- */}
                    <Route path="/legal-pages" element={<AdminLayout><LegalPageIndex /></AdminLayout>} />
                    <Route path="/legal-pages/create" element={<AdminLayout><LegalPageCreate /></AdminLayout>} />
                    <Route path="/legal-pages/edit/:id" element={<AdminLayout><LegalPageEdit /></AdminLayout>} />

                    {/* ---------------- CUSTOMER PAGES (WITH HEADER/FOOTER) ---------------- */}
                    <Route path="/shop" element={<MainLayout><CustomerHome /></MainLayout>} />
                    <Route path="/product/:id" element={<MainLayout><ProductDetail /></MainLayout>} />
                    <Route path="/cart" element={<MainLayout><CartPage /></MainLayout>} />

                    <Route path="/about-us" element={<MainLayout><AboutUs /></MainLayout>} />
                    <Route path="/privacy-policy" element={<MainLayout><PrivacyPolicy /></MainLayout>} />
                    <Route path="/terms-and-condition" element={<MainLayout><TermsAndCondition /></MainLayout>} />

                    {/* ---------------- FALLBACK ---------------- */}
                    <Route path="*" element={<Navigate to="/" replace />} />

                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}

createRoot(document.getElementById("app")).render(<App />);
