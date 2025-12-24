import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layout/MainLayout";
import AdminLayout from "./layout/AdminLayout";

import ProductIndex from "./pages/products/index";
import ProductCreate from "./pages/products/create";
import ProductEdit from "./pages/products/edit";

import LegalPageIndex from "./pages/legalpage/index";
import LegalPageCreate from "./pages/legalpage/create";
import LegalPageEdit from "./pages/legalpage/edit";

import AboutUs from "./pages/legalpage/AboutUs";
import PrivacyPolicy from "./pages/legalpage/PrivacyPolicy";
import TermsAndCondition from "./pages/legalpage/TermsAndCondition";

import CustomerHome from "./pages/customer/Home";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* ---------------- ADMIN (NO HEADER/FOOTER) ---------------- */}
                <Route path="/" element={<AdminLayout><ProductIndex /></AdminLayout>} />
                <Route path="/create" element={<AdminLayout><ProductCreate /></AdminLayout>} />
                <Route path="/edit/:id" element={<AdminLayout><ProductEdit /></AdminLayout>} />

                {/* ---------------- LEGAL CRUD (NO HEADER/FOOTER) ---------------- */}
                <Route path="/legal-pages" element={<AdminLayout><LegalPageIndex /></AdminLayout>} />
                <Route path="/legal-pages/create" element={<AdminLayout><LegalPageCreate /></AdminLayout>} />
                <Route path="/legal-pages/edit/:id" element={<AdminLayout><LegalPageEdit /></AdminLayout>} />

                {/* ---------------- CUSTOMER PAGES (WITH HEADER/FOOTER) ---------------- */}
                <Route path="/shop" element={<MainLayout><CustomerHome /></MainLayout>} />

                <Route path="/about-us" element={<MainLayout><AboutUs /></MainLayout>} />
                <Route path="/privacy-policy" element={<MainLayout><PrivacyPolicy /></MainLayout>} />
                <Route path="/terms-and-condition" element={<MainLayout><TermsAndCondition /></MainLayout>} />

                {/* ---------------- FALLBACK ---------------- */}
                <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
        </BrowserRouter>
    );
}

createRoot(document.getElementById("app")).render(<App />);
