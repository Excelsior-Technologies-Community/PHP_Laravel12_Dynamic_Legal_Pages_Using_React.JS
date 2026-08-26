import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Header() {

    const [wishlistCount, setWishlistCount] = useState(0);

    /*
    |--------------------------------------------------------------------------
    | Load Wishlist Count
    |--------------------------------------------------------------------------
    */

    const fetchWishlistCount = async () => {

        try {

            const response = await axios.get(
                "/api/wishlist"
            );

            setWishlistCount(
                response.data.length
            );

        } catch (error) {

            console.error(
                "Failed to load wishlist count:",
                error
            );

        }
    };


    /*
    |--------------------------------------------------------------------------
    | Load Wishlist When Header Mounts
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        fetchWishlistCount();

    }, []);


    /*
    |--------------------------------------------------------------------------
    | Refresh Wishlist Count
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        const handleWishlistUpdated = () => {
            fetchWishlistCount();
        };

        window.addEventListener(
            "wishlistUpdated",
            handleWishlistUpdated
        );

        return () => {

            window.removeEventListener(
                "wishlistUpdated",
                handleWishlistUpdated
            );

        };

    }, []);


    return (

        <header
            style={{
                position: "fixed",
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

            {/* =========================================================
                LEFT LOGO
            ========================================================== */}

            <h2 style={{ margin: 0 }}>
                MyStore
            </h2>


            {/* =========================================================
                NAVIGATION
            ========================================================== */}

            <nav
                style={{
                    display: "flex",
                    gap: "25px",
                    alignItems: "center"
                }}
            >

                <Link
                    to="/shop"
                    style={{
                        color: "white",
                        textDecoration: "none"
                    }}
                >
                    Shop
                </Link>


                <Link
                    to="/cart"
                    style={{
                        color: "white",
                        textDecoration: "none"
                    }}
                >
                    🛒 Cart
                </Link>


                {/* =====================================================
                    WISHLIST
                ====================================================== */}

                <Link
                    to="/wishlist"
                    style={{
                        color: "white",
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px"
                    }}
                >

                    ❤️ Wishlist

                    {wishlistCount > 0 && (

                        <span
                            style={{
                                background: "#dc3545",
                                color: "white",
                                borderRadius: "50%",
                                minWidth: "22px",
                                height: "22px",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "12px",
                                fontWeight: "bold",
                                padding: "0 5px"
                            }}
                        >
                            {wishlistCount}
                        </span>

                    )}

                </Link>


                <Link
                    to="/about-us"
                    style={{
                        color: "white",
                        textDecoration: "none"
                    }}
                >
                    About Us
                </Link>


                <Link
                    to="/privacy-policy"
                    style={{
                        color: "white",
                        textDecoration: "none"
                    }}
                >
                    Privacy Policy
                </Link>


                <Link
                    to="/terms-and-condition"
                    style={{
                        color: "white",
                        textDecoration: "none"
                    }}
                >
                    Terms
                </Link>

            </nav>

        </header>
    );
}