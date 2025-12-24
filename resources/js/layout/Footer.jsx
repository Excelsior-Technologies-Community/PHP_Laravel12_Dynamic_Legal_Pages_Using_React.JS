import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer
            style={{
                marginTop: "40px",
                padding: "50px 25px",     // 🔥 footer height increased
                background: "#00000006",
                textAlign: "center",
                borderTop: "1px solid #ddd",
                fontSize: "18px", 
                height: "400px",         // 🔥 bigger text
            }}
        >
            <p style={{ marginBottom: "20px", fontSize: "20px" }}>
                © {new Date().getFullYear()} MyStore. All Rights Reserved.
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: "30px", fontSize: "18px" }}>
                <Link to="/about-us">About Us</Link>
                <Link to="/privacy-policy">Privacy Policy</Link>
                <Link to="/terms-and-condition">Terms & Conditions</Link>
            </div>
        </footer>
    );
}
