import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Create() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        details: "",
        price: "",
        size: "",
        color: "",
        category: ""
    });

    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    // Submit form
    const submit = async (e) => {
        e.preventDefault();

        if (!image) {
            alert("Please select product image!");
            return;
        }

        try {
            setLoading(true);
            const data = new FormData();

            Object.keys(form).forEach((key) => data.append(key, form[key]));
            data.append("image", image);

            await axios.post("/products", data);

            navigate("/"); // redirect to home/index
        } catch (error) {
            console.error("Create error:", error);
            alert("Something went wrong! Check console.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="fw-bold">Add Product</h3>
                <Link to="/" className="btn btn-secondary">Back</Link>
            </div>

            <div className="card shadow-sm">
                <div className="card-body">
                    <form onSubmit={submit}>

                        {/* Row 1: Name + Price */}
                        <div className="row mb-3">
                            <div className="col">
                                <input
                                    className="form-control"
                                    placeholder="Product Name"
                                    value={form.name}
                                    onChange={(e) =>
                                        setForm({ ...form, name: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            <div className="col">
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Price"
                                    value={form.price}
                                    min="1"
                                    step="0.01"
                                    onChange={(e) =>
                                        setForm({ ...form, price: e.target.value })
                                    }
                                    required
                                />
                            </div>
                        </div>

                        {/* Details */}
                        <div className="mb-3">
                            <textarea
                                className="form-control"
                                placeholder="Details"
                                value={form.details}
                                onChange={(e) =>
                                    setForm({ ...form, details: e.target.value })
                                }
                                required
                            ></textarea>
                        </div>

                        {/* Row 2: Size - Color - Category */}
                        <div className="row mb-3">
                            <div className="col">
                                <input
                                    className="form-control"
                                    placeholder="Size"
                                    value={form.size}
                                    onChange={(e) =>
                                        setForm({ ...form, size: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            <div className="col">
                                <input
                                    className="form-control"
                                    placeholder="Color"
                                    value={form.color}
                                    onChange={(e) =>
                                        setForm({ ...form, color: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            <div className="col">
                                <input
                                    className="form-control"
                                    placeholder="Category"
                                    value={form.category}
                                    onChange={(e) =>
                                        setForm({ ...form, category: e.target.value })
                                    }
                                    required
                                />
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div className="mb-3">
                            <input
                                type="file"
                                className="form-control"
                                accept="image/*"
                                onChange={(e) => setImage(e.target.files[0])}
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            className="btn btn-success"
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Save Product"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
