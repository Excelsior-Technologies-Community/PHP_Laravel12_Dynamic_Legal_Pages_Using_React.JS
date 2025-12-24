import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
    return (
        <header
            style={{
                position: "fixed",            // 🔥 ALWAYS FIXED
                top: 0,
                left: 0,
                width: "100%",
                zIndex: 999,
                padding: "15px 25px",
                background: "#0d6efd",
                color: "white",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
            }}
        >
            {/* Left Logo */}
            <h2 style={{ margin: 0 }}>MyStore</h2>

            {/* Navigation */}
            <nav style={{ display: "flex", gap: "25px" }}>
                <Link to="/shop" style={{ color: "white", textDecoration: "none" }}>Shop</Link>
                <Link to="/about-us" style={{ color: "white", textDecoration: "none" }}>About Us</Link>
                <Link to="/privacy-policy" style={{ color: "white", textDecoration: "none" }}>Privacy Policy</Link>
                <Link to="/terms-and-condition" style={{ color: "white", textDecoration: "none" }}>Terms</Link>
            </nav>
        </header>
    );
}
