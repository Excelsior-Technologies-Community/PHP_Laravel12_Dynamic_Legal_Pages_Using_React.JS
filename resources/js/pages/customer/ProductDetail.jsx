import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        axios.get("/api/products")
            .then((res) => {
                const found = res.data.find(p => p.id == id);
                setProduct(found);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, [id]);

    const addToCart = async () => {
        await axios.post("/api/add-to-cart", {
            id: product.id,
            qty: qty
        });
        setAdded(true);
    };

    if (loading) {
        return (
            <div className="container mt-5">
                <div className="text-center py-5">
                    <div className="spinner-border text-primary"></div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mt-5">
                <div className="text-center py-5">
                    <h3 className="text-muted">Product not found</h3>
                    <button className="btn btn-primary mt-3" onClick={() => navigate("/shop")}>
                        Back to Shop
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <button className="btn btn-outline-secondary mb-4" onClick={() => navigate("/shop")}>
                ← Back to Shop
            </button>

            <div className="card shadow-lg border-0">
                <div className="row g-0">
                    <div className="col-md-6">
                        <img
                            src={`/images/${product.image}`}
                            alt={product.name}
                            className="img-fluid rounded-start h-100"
                            style={{ objectFit: "cover", minHeight: "400px" }}
                        />
                    </div>

                    <div className="col-md-6">
                        <div className="card-body p-5">
                            <span className="badge bg-primary mb-3">{product.category}</span>
                            <h2 className="card-title fw-bold mb-3">{product.name}</h2>
                            <h3 className="text-success fw-bold mb-4">₹ {product.price}</h3>

                            <div className="mb-4">
                                <h6 className="fw-semibold">Description</h6>
                                <p className="text-muted">{product.details}</p>
                            </div>

                            <div className="row mb-4">
                                <div className="col-md-6 mb-3">
                                    <h6 className="fw-semibold">Size</h6>
                                    <span className="badge bg-light text-dark border">{product.size}</span>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <h6 className="fw-semibold">Color</h6>
                                    <span className="badge bg-light text-dark border">{product.color}</span>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h6 className="fw-semibold mb-2">Quantity</h6>
                                <select
                                    className="form-select w-25"
                                    value={qty}
                                    onChange={(e) => setQty(parseInt(e.target.value))}
                                >
                                    {[1, 2, 3, 4, 5].map(num => (
                                        <option key={num} value={num}>{num}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="d-grid gap-2 d-md-flex">
                                {added ? (
                                    <button className="btn btn-success btn-lg flex-grow-1" onClick={() => navigate("/cart")}>
                                        View Cart ✓
                                    </button>
                                ) : (
                                    <button className="btn btn-primary btn-lg flex-grow-1" onClick={addToCart}>
                                        Add to Cart
                                    </button>
                                )}
                                <button className="btn btn-outline-secondary btn-lg" onClick={() => navigate("/shop")}>
                                    Continue Shopping
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
