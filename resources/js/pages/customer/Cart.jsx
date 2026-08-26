import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Cart() {

    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [error, setError] = useState("");

    /*
    |--------------------------------------------------------------------------
    | Load Cart
    |--------------------------------------------------------------------------
    */
    const fetchCart = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await axios.get("/api/cart");

            setCart(response.data);

        } catch (err) {

            console.error("Failed to load cart:", err);

            setError(
                err.response?.data?.message ||
                "Failed to load cart."
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    /*
    |--------------------------------------------------------------------------
    | Update Quantity
    |--------------------------------------------------------------------------
    */
    const updateQuantity = async (productId, newQuantity) => {

        if (newQuantity < 1 || newQuantity > 5) {
            return;
        }

        try {

            setUpdatingId(productId);

            const response = await axios.put(
                `/api/cart/${productId}`,
                {
                    qty: newQuantity
                }
            );

            /*
            |--------------------------------------------------------------------------
            | Update item locally
            |--------------------------------------------------------------------------
            */
            setCart((previousCart) =>
                previousCart.map((item) =>
                    item.product_id === productId
                        ? {
                            ...item,
                            qty: response.data.item.qty,
                            total_price: response.data.item.total_price
                        }
                        : item
                )
            );

        } catch (err) {

            console.error("Quantity update failed:", err);

            alert(
                err.response?.data?.message ||
                "Unable to update quantity."
            );

        } finally {

            setUpdatingId(null);

        }
    };

    /*
    |--------------------------------------------------------------------------
    | Increase Quantity
    |--------------------------------------------------------------------------
    */
    const increaseQuantity = (item) => {

        if (item.qty >= 5) {
            return;
        }

        updateQuantity(
            item.product_id,
            item.qty + 1
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Decrease Quantity
    |--------------------------------------------------------------------------
    */
    const decreaseQuantity = (item) => {

        if (item.qty <= 1) {
            return;
        }

        updateQuantity(
            item.product_id,
            item.qty - 1
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Remove Item
    |--------------------------------------------------------------------------
    */
    const removeFromCart = async (productId) => {

        try {

            await axios.delete(
                `/api/cart/${productId}`
            );

            setCart((previousCart) =>
                previousCart.filter(
                    (item) => item.product_id !== productId
                )
            );

        } catch (err) {

            console.error("Remove failed:", err);

            alert(
                err.response?.data?.message ||
                "Unable to remove item."
            );

        }
    };

    /*
    |--------------------------------------------------------------------------
    | Totals
    |--------------------------------------------------------------------------
    */
    const total = cart.reduce(
        (sum, item) =>
            sum + parseFloat(item.total_price || 0),
        0
    );

    const totalItems = cart.reduce(
        (sum, item) =>
            sum + parseInt(item.qty || 0),
        0
    );

    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */
    if (loading) {

        return (
            <div className="container mt-5">

                <div className="text-center py-5">

                    <div className="spinner-border text-primary"></div>

                    <p className="text-muted mt-3">
                        Loading your cart...
                    </p>

                </div>

            </div>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Error
    |--------------------------------------------------------------------------
    */
    if (error) {

        return (
            <div className="container mt-5">

                <div className="alert alert-danger">
                    {error}

                    <button
                        className="btn btn-outline-danger btn-sm ms-3"
                        onClick={fetchCart}
                    >
                        Retry
                    </button>
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
                            Shopping Cart
                        </h2>

                        <p className="text-muted mb-0">
                            {totalItems} item
                            {totalItems !== 1 ? "s" : ""} in your cart
                        </p>

                    </div>

                    <Link
                        to="/shop"
                        className="btn btn-outline-primary"
                    >
                        ← Continue Shopping
                    </Link>

                </div>


                {/* =====================================================
                    EMPTY CART
                ====================================================== */}

                {cart.length === 0 ? (

                    <div className="card border-0 shadow-sm">

                        <div className="card-body text-center py-5">

                            <div style={{ fontSize: "80px" }}>
                                🛒
                            </div>

                            <h4 className="text-muted mt-3">
                                Your cart is empty
                            </h4>

                            <p className="text-muted">
                                Looks like you haven't added any items yet.
                            </p>

                            <Link
                                to="/shop"
                                className="btn btn-primary btn-lg mt-3"
                            >
                                Start Shopping
                            </Link>

                        </div>

                    </div>

                ) : (

                    <div className="row g-4">

                        {/* =================================================
                            CART ITEMS
                        ================================================== */}

                        <div className="col-lg-8">

                            <div className="card border-0 shadow-sm">

                                <div className="card-body p-0">

                                    {cart.map((item, index) => (

                                        <div
                                            key={item.id}
                                            className={`p-4 ${
                                                index !== cart.length - 1
                                                    ? "border-bottom"
                                                    : ""
                                            }`}
                                        >

                                            <div className="row align-items-center g-3">

                                                {/* IMAGE */}

                                                <div className="col-md-2 text-center">

                                                    <img
                                                        src={`/images/${item.image}`}
                                                        alt={item.name}
                                                        className="img-fluid rounded"
                                                        style={{
                                                            width: "90px",
                                                            height: "90px",
                                                            objectFit: "contain",
                                                            background: "#f8f9fa",
                                                            padding: "5px"
                                                        }}
                                                    />

                                                </div>


                                                {/* PRODUCT */}

                                                <div className="col-md-4">

                                                    <h6 className="fw-semibold mb-1">
                                                        {item.name}
                                                    </h6>

                                                    <p className="text-muted small mb-1">
                                                        {item.category}
                                                    </p>

                                                    <p className="text-muted small mb-0">
                                                        Size: {item.size}
                                                        {" | "}
                                                        Color: {item.color}
                                                    </p>

                                                    <div className="mt-2">

                                                        <span className="text-success fw-semibold">
                                                            ₹ {parseFloat(item.price).toFixed(2)}
                                                        </span>

                                                        <span className="text-muted small">
                                                            {" "}per item
                                                        </span>

                                                    </div>

                                                </div>


                                                {/* QUANTITY */}

                                                <div className="col-md-3">

                                                    <label className="small text-muted d-block mb-2">
                                                        Quantity
                                                    </label>

                                                    <div
                                                        className="input-group"
                                                        style={{
                                                            maxWidth: "145px"
                                                        }}
                                                    >

                                                        <button
                                                            className="btn btn-outline-secondary"
                                                            disabled={
                                                                item.qty <= 1 ||
                                                                updatingId === item.product_id
                                                            }
                                                            onClick={() =>
                                                                decreaseQuantity(item)
                                                            }
                                                        >
                                                            −
                                                        </button>

                                                        <input
                                                            type="text"
                                                            className="form-control text-center fw-bold"
                                                            value={item.qty}
                                                            readOnly
                                                        />

                                                        <button
                                                            className="btn btn-outline-secondary"
                                                            disabled={
                                                                item.qty >= 5 ||
                                                                updatingId === item.product_id
                                                            }
                                                            onClick={() =>
                                                                increaseQuantity(item)
                                                            }
                                                        >
                                                            +
                                                        </button>

                                                    </div>

                                                    <small className="text-muted">
                                                        Maximum 5
                                                    </small>

                                                </div>


                                                {/* PRICE */}

                                                <div className="col-md-2 text-end">

                                                    <h6 className="fw-bold text-success mb-2">

                                                        ₹{" "}
                                                        {parseFloat(
                                                            item.total_price
                                                        ).toFixed(2)}

                                                    </h6>

                                                    {updatingId === item.product_id && (
                                                        <div className="spinner-border spinner-border-sm text-primary mb-2"></div>
                                                    )}

                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        disabled={
                                                            updatingId === item.product_id
                                                        }
                                                        onClick={() =>
                                                            removeFromCart(
                                                                item.product_id
                                                            )
                                                        }
                                                    >
                                                        Remove
                                                    </button>

                                                </div>

                                            </div>

                                        </div>

                                    ))}

                                </div>

                            </div>

                        </div>


                        {/* =================================================
                            SUMMARY
                        ================================================== */}

                        <div className="col-lg-4">

                            <div
                                className="card border-0 shadow-sm"
                                style={{
                                    position: "sticky",
                                    top: "110px"
                                }}
                            >

                                <div className="card-body p-4">

                                    <h5 className="fw-bold mb-4">
                                        Order Summary
                                    </h5>

                                    <div className="d-flex justify-content-between mb-3">

                                        <span className="text-muted">
                                            Total Items
                                        </span>

                                        <span className="fw-semibold">
                                            {totalItems}
                                        </span>

                                    </div>

                                    <div className="d-flex justify-content-between mb-3">

                                        <span className="text-muted">
                                            Subtotal
                                        </span>

                                        <span className="fw-semibold">
                                            ₹ {total.toFixed(2)}
                                        </span>

                                    </div>

                                    <div className="d-flex justify-content-between mb-3">

                                        <span className="text-muted">
                                            Shipping
                                        </span>

                                        <span className="text-success fw-semibold">
                                            FREE
                                        </span>

                                    </div>

                                    <hr />

                                    <div className="d-flex justify-content-between mb-4">

                                        <span className="fw-bold fs-5">
                                            Total
                                        </span>

                                        <span className="fw-bold fs-5 text-success">
                                            ₹ {total.toFixed(2)}
                                        </span>

                                    </div>

                                    <button
                                        className="btn btn-success btn-lg w-100 mb-2"
                                    >
                                        Proceed to Checkout
                                    </button>

                                    <Link
                                        to="/shop"
                                        className="btn btn-outline-secondary w-100"
                                    >
                                        Continue Shopping
                                    </Link>

                                </div>

                            </div>

                        </div>

                    </div>

                )}

            </div>

        </div>
    );
}