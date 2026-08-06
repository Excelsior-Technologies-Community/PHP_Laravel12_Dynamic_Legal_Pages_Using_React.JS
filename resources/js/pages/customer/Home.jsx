import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [qty, setQty] = useState({});
    const [added, setAdded] = useState({});
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        axios.get("/api/products")
            .then(res => {
                setProducts(res.data);
                const defaultQty = {};
                res.data.forEach(p => {
                    defaultQty[p.id] = 1;
                });
                setQty(defaultQty);
            })
            .catch(() => {
                console.error("Failed to load products");
            });
    }, []);

    const categories = ["All", ...new Set(products.map(p => p.category))];

    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              product.details.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const changeQty = (productId, value) => {
        setQty({
            ...qty,
            [productId]: value
        });
    };

    const addToCart = async (product) => {
        await axios.post("/api/add-to-cart", {
            id: product.id,
            qty: qty[product.id]
        });

        setAdded({
            ...added,
            [product.id]: true
        });
    };

    return (
        <div className="bg-light min-vh-100">
            {/* Hero Section */}
            <div className="bg-primary text-white py-5 mb-5">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <h1 className="display-4 fw-bold mb-3">Discover Premium Products</h1>
                            <p className="lead mb-4">Shop the latest trends with unbeatable quality and prices. Free shipping on orders over ₹999.</p>
                            <div className="input-group mb-3" style={{ maxWidth: "500px" }}>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button className="btn btn-light" type="button">
                                    🔍
                                </button>
                            </div>
                        </div>
                        <div className="col-lg-6 d-none d-lg-block">
                            <div className="text-center">
                                <span style={{ fontSize: "150px" }}>🛍️</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container pb-5">
                {/* Categories */}
                <div className="mb-5">
                    <h4 className="fw-bold mb-3">Categories</h4>
                    <div className="d-flex flex-wrap gap-2">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`btn ${selectedCategory === cat ? "btn-primary" : "btn-outline-primary"}`}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Products Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="fw-bold">Our Products</h3>
                    <span className="text-muted">{filteredProducts.length} products found</span>
                </div>

                {/* Products Grid */}
                {filteredProducts.length === 0 ? (
                    <div className="text-center py-5">
                        <span style={{ fontSize: "60px" }}>📦</span>
                        <h4 className="text-muted mt-3">No products found</h4>
                        <p className="text-muted">Try adjusting your search or category filter</p>
                    </div>
                ) : (
                    <div className="row g-4">
                        {filteredProducts.map(product => (
                            <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={product.id}>
                                <div className="card h-100 shadow-sm border-0 product-card-hover">
                                    <div className="position-relative">
                                        <img
                                            src={`/images/${product.image}`}
                                            className="card-img-top product-image"
                                            alt={product.name}
                                            style={{ height: "220px", objectFit: "contain", background: "#f8f9fa", padding: "15px" }}
                                        />
                                        <span className="position-absolute top-0 start-0 m-2 badge bg-primary">
                                            {product.category}
                                        </span>
                                    </div>

                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title fw-semibold text-truncate" title={product.name}>
                                            {product.name}
                                        </h5>
                                        <p className="text-muted small mb-2" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                            {product.details}
                                        </p>

                                        <div className="mb-2">
                                            <span className="badge bg-light text-dark border me-1">Size: {product.size}</span>
                                            <span className="badge bg-light text-dark border">Color: {product.color}</span>
                                        </div>

                                        <div className="mt-auto">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <h5 className="text-success fw-bold mb-0">₹ {product.price}</h5>
                                            </div>

                                            <div className="mb-2">
                                                <label className="form-label small fw-semibold">Qty:</label>
                                                <select
                                                    className="form-select form-select-sm"
                                                    style={{ maxWidth: "80px" }}
                                                    value={qty[product.id] || 1}
                                                    onChange={(e) =>
                                                        changeQty(product.id, parseInt(e.target.value))
                                                    }
                                                >
                                                    {[1, 2, 3, 4, 5].map(num => (
                                                        <option key={num} value={num}>
                                                            {num}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="d-grid gap-2">
                                                <button
                                                    className="btn btn-outline-primary btn-sm"
                                                    onClick={() => navigate(`/product/${product.id}`)}
                                                >
                                                    View Details
                                                </button>

                                                {added[product.id] ? (
                                                    <button
                                                        className="btn btn-success btn-sm"
                                                        onClick={() => navigate("/cart")}
                                                    >
                                                        ✓ Added - View Cart
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="btn btn-primary btn-sm"
                                                        onClick={() => addToCart(product)}
                                                    >
                                                        Add to Cart
                                                    </button>
                                                )}
                                            </div>
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
