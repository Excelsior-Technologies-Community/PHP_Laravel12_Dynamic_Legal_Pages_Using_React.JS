import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Cart() {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("/api/cart")
            .then((res) => {
                setCart(res.data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, []);

    const removeFromCart = async (id) => {
        await axios.delete(`/api/cart/${id}`);
        setCart(cart.filter(item => item.product_id !== id));
    };

    const total = cart.reduce((sum, item) => sum + parseFloat(item.total_price), 0);
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

    if (loading) {
        return (
            <div className="container mt-5">
                <div className="text-center py-5">
                    <div className="spinner-border text-primary"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-light min-vh-100">
            <div className="container py-5">
                <h2 className="fw-bold mb-4">Shopping Cart ({totalItems} items)</h2>

                {cart.length === 0 ? (
                    <div className="text-center py-5">
                        <span style={{ fontSize: "80px" }}>🛒</span>
                        <h4 className="text-muted mt-3">Your cart is empty</h4>
                        <p className="text-muted">Looks like you haven't added any items yet.</p>
                        <Link to="/shop" className="btn btn-primary btn-lg mt-3">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="row g-4">
                        {/* Cart Items */}
                        <div className="col-lg-8">
                            <div className="card shadow-sm border-0">
                                <div className="card-body p-0">
                                    {cart.map((item, index) => (
                                        <div key={item.id} className={`p-4 ${index !== cart.length - 1 ? 'border-bottom' : ''}`}>
                                            <div className="row align-items-center">
                                                <div className="col-md-2">
                                                    <img
                                                        src={`/images/${item.image}`}
                                                        alt={item.name}
                                                        className="img-fluid rounded"
                                                        style={{ width: "80px", height: "80px", objectFit: "contain", background: "#f8f9fa", padding: "5px" }}
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <h6 className="fw-semibold mb-1">{item.name}</h6>
                                                    <p className="text-muted small mb-0">
                                                        {item.category} | {item.size} | {item.color}
                                                    </p>
                                                </div>
                                                <div className="col-md-2 text-center">
                                                    <span className="badge bg-light text-dark border">Qty: {item.qty}</span>
                                                </div>
                                                <div className="col-md-2 text-end">
                                                    <h6 className="fw-bold text-success mb-0">₹ {item.total_price}</h6>
                                                    <small className="text-muted">₹ {item.price} each</small>
                                                </div>
                                                <div className="col-md-2 text-end">
                                                    <button
                                                        className="btn btn-outline-danger btn-sm"
                                                        onClick={() => removeFromCart(item.product_id)}
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

                        {/* Order Summary */}
                        <div className="col-lg-4">
                            <div className="card shadow-sm border-0 sticky-top" style={{ top: "20px" }}>
                                <div className="card-body">
                                    <h5 className="fw-bold mb-4">Order Summary</h5>

                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">Total Items</span>
                                        <span className="fw-semibold">{totalItems}</span>
                                    </div>

                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">Subtotal</span>
                                        <span className="fw-semibold">₹ {total.toFixed(2)}</span>
                                    </div>

                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">Shipping</span>
                                        <span className="text-success fw-semibold">FREE</span>
                                    </div>

                                    <hr />

                                    <div className="d-flex justify-content-between mb-4">
                                        <span className="fw-bold fs-5">Total</span>
                                        <span className="fw-bold fs-5 text-success">₹ {total.toFixed(2)}</span>
                                    </div>

                                    <button className="btn btn-success btn-lg w-100 mb-2">
                                        Proceed to Checkout
                                    </button>
                                    <Link to="/shop" className="btn btn-outline-secondary w-100">
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
