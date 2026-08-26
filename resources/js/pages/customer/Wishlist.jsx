import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Wishlist() {

    const navigate = useNavigate();

    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(null);
    const [removingId, setRemovingId] = useState(null);

    /*
    |--------------------------------------------------------------------------
    | Load Wishlist
    |--------------------------------------------------------------------------
    */
    const fetchWishlist = async () => {

        try {

            setLoading(true);

            const response = await axios.get("/api/wishlist");

            setWishlist(response.data);

        } catch (error) {

            console.error(
                "Failed to load wishlist:",
                error
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    /*
    |--------------------------------------------------------------------------
    | Remove From Wishlist
    |--------------------------------------------------------------------------
    */
    const removeFromWishlist = async (productId) => {

        try {

            setRemovingId(productId);

            await axios.delete(
                `/api/wishlist/${productId}`
            );

            setWishlist((previous) =>
                previous.filter(
                    (product) => product.id !== productId
                )
            );

        } catch (error) {

            console.error(
                "Remove wishlist failed:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to remove product."
            );

        } finally {

            setRemovingId(null);

        }
    };

    /*
    |--------------------------------------------------------------------------
    | Add Wishlist Product To Cart
    |--------------------------------------------------------------------------
    */
    const addToCart = async (product) => {

        try {

            setAddingToCart(product.id);

            await axios.post(
                "/api/add-to-cart",
                {
                    id: product.id,
                    qty: 1
                }
            );

            alert(
                `${product.name} added to cart.`
            );

        } catch (error) {

            console.error(
                "Add to cart failed:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to add product to cart."
            );

        } finally {

            setAddingToCart(null);

        }
    };

    /*
    |--------------------------------------------------------------------------
    | Clear Wishlist
    |--------------------------------------------------------------------------
    */
    const clearWishlist = async () => {

        if (wishlist.length === 0) {
            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to clear your entire wishlist?"
        );

        if (!confirmed) {
            return;
        }

        try {

            await axios.delete("/api/wishlist");

            setWishlist([]);

        } catch (error) {

            console.error(
                "Clear wishlist failed:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to clear wishlist."
            );

        }
    };

    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */
    if (loading) {

        return (
            <div className="container py-5">

                <div className="text-center">

                    <div className="spinner-border text-primary"></div>

                    <p className="text-muted mt-3">
                        Loading your wishlist...
                    </p>

                </div>

            </div>
        );
    }

    return (

        <div className="bg-light min-vh-100">

            <div className="container py-5">

                {/* =====================================================
                    HEADER
                ====================================================== */}

                <div className="d-flex justify-content-between align-items-center mb-4">

                    <div>

                        <h2 className="fw-bold mb-1">
                            ❤️ My Wishlist
                        </h2>

                        <p className="text-muted mb-0">
                            {wishlist.length} saved product
                            {wishlist.length !== 1 ? "s" : ""}
                        </p>

                    </div>

                    <div className="d-flex gap-2">

                        {wishlist.length > 0 && (
                            <button
                                className="btn btn-outline-danger"
                                onClick={clearWishlist}
                            >
                                Clear Wishlist
                            </button>
                        )}

                        <Link
                            to="/shop"
                            className="btn btn-outline-primary"
                        >
                            ← Continue Shopping
                        </Link>

                    </div>

                </div>


                {/* =====================================================
                    EMPTY WISHLIST
                ====================================================== */}

                {wishlist.length === 0 ? (

                    <div className="card border-0 shadow-sm">

                        <div className="card-body text-center py-5">

                            <div
                                style={{
                                    fontSize: "80px"
                                }}
                            >
                                🤍
                            </div>

                            <h4 className="text-muted mt-3">
                                Your wishlist is empty
                            </h4>

                            <p className="text-muted">
                                Save your favorite products here
                                and come back to them later.
                            </p>

                            <button
                                className="btn btn-primary btn-lg mt-3"
                                onClick={() => navigate("/shop")}
                            >
                                Browse Products
                            </button>

                        </div>

                    </div>

                ) : (

                    /* =================================================
                       WISHLIST PRODUCTS
                    ================================================== */

                    <div className="row g-4">

                        {wishlist.map((product) => (

                            <div
                                className="col-12 col-sm-6 col-md-4 col-lg-3"
                                key={product.id}
                            >

                                <div className="card h-100 border-0 shadow-sm">

                                    {/* IMAGE */}

                                    <div
                                        className="position-relative"
                                        style={{
                                            background: "#f8f9fa"
                                        }}
                                    >

                                        <img
                                            src={`/images/${product.image}`}
                                            alt={product.name}
                                            className="card-img-top"
                                            style={{
                                                height: "220px",
                                                objectFit: "contain",
                                                padding: "15px"
                                            }}
                                        />

                                        <button
                                            type="button"
                                            className="btn btn-light position-absolute top-0 end-0 m-2 rounded-circle shadow-sm"
                                            onClick={() =>
                                                removeFromWishlist(
                                                    product.id
                                                )
                                            }
                                            disabled={
                                                removingId === product.id
                                            }
                                            title="Remove from wishlist"
                                        >
                                            {removingId === product.id
                                                ? "..."
                                                : "❤️"}
                                        </button>

                                        <span className="position-absolute top-0 start-0 m-2 badge bg-primary">
                                            {product.category}
                                        </span>

                                    </div>


                                    {/* BODY */}

                                    <div className="card-body d-flex flex-column">

                                        <h5
                                            className="fw-semibold text-truncate"
                                            title={product.name}
                                        >
                                            {product.name}
                                        </h5>

                                        <p
                                            className="text-muted small"
                                            style={{
                                                display: "-webkit-box",
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden"
                                            }}
                                        >
                                            {product.details}
                                        </p>

                                        <div className="mb-2">

                                            <span className="badge bg-light text-dark border me-1">
                                                Size: {product.size}
                                            </span>

                                            <span className="badge bg-light text-dark border">
                                                Color: {product.color}
                                            </span>

                                        </div>

                                        <h5 className="text-success fw-bold">
                                            ₹{" "}
                                            {parseFloat(
                                                product.price
                                            ).toFixed(2)}
                                        </h5>


                                        <div className="mt-auto d-grid gap-2">

                                            <button
                                                className="btn btn-outline-primary btn-sm"
                                                onClick={() =>
                                                    navigate(
                                                        `/product/${product.id}`
                                                    )
                                                }
                                            >
                                                View Details
                                            </button>

                                            <button
                                                className="btn btn-primary btn-sm"
                                                disabled={
                                                    addingToCart ===
                                                    product.id
                                                }
                                                onClick={() =>
                                                    addToCart(product)
                                                }
                                            >
                                                {addingToCart ===
                                                product.id
                                                    ? "Adding..."
                                                    : "🛒 Add to Cart"}
                                            </button>

                                            <button
                                                className="btn btn-outline-danger btn-sm"
                                                disabled={
                                                    removingId ===
                                                    product.id
                                                }
                                                onClick={() =>
                                                    removeFromWishlist(
                                                        product.id
                                                    )
                                                }
                                            >
                                                Remove
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}