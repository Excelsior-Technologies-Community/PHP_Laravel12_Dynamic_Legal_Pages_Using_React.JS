import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [qty, setQty] = useState({});
    const [added, setAdded] = useState({}); // 🔹 track added products

    useEffect(() => {
        axios.get("/products").then(res => {
            setProducts(res.data);

            const defaultQty = {};
            res.data.forEach(p => {
                defaultQty[p.id] = 1;
            });
            setQty(defaultQty);
        });
    }, []);

    const changeQty = (productId, value) => {
        setQty({
            ...qty,
            [productId]: value
        });
    };

    const addToCart = async (product) => {
        await axios.post("/add-to-cart", {
            id: product.id,
            qty: qty[product.id]
        });

        // 🔹 mark product as added
        setAdded({
            ...added,
            [product.id]: true
        });
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Our Products</h2>

            <div className="row">
                {products.map(product => (
                    <div className="col-md-4 mb-4" key={product.id}>
                        <div className="card h-100 shadow-sm product-card">

                            {/* IMAGE */}
                            <img
                                src={`/images/${product.image}`}
                                className="card-img-top product-image"
                                alt={product.name}
                            />

                            <div className="card-body">
                                <h5 className="card-title">{product.name}</h5>

                                <h6 className="text-success fw-bold">
                                    ₹ {product.price}
                                </h6>

                                <p className="text-muted small">
                                    {product.details}
                                </p>

                                <ul className="list-group list-group-flush mb-3">
                                    <li className="list-group-item p-1">
                                        <strong>Category:</strong> {product.category}
                                    </li>
                                    <li className="list-group-item p-1">
                                        <strong>Size:</strong> {product.size}
                                    </li>
                                    <li className="list-group-item p-1">
                                        <strong>Color:</strong> {product.color}
                                    </li>
                                </ul>

                                {/* QUANTITY */}
                                <div className="mb-2">
                                    <label className="form-label fw-semibold">
                                        Quantity
                                    </label>
                                    <select
                                        className="form-select"
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

                                {/* ADD / VIEW CART */}
                                {added[product.id] ? (
                                    <button
                                        className="btn btn-success w-100"
                                        onClick={() => navigate("/cart")}
                                    >
                                        View Cart
                                    </button>
                                ) : (
                                    <button
                                        className="btn btn-primary w-100"
                                        onClick={() => addToCart(product)}
                                    >
                                        Add to Cart
                                    </button>
                                )}
                            </div>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
