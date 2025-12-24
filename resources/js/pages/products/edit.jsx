import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";

export default function Edit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        details: "",
        price: "",
        size: "",
        color: "",
        category: "",
        image: ""
    });

    const [newImage, setNewImage] = useState(null);
    const [preview, setPreview] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Fetch product (edit data)
    useEffect(() => {
        const loadProduct = async () => {
            try {
                const res = await axios.get(`/products/${id}/edit`);
                setForm(res.data);
                setPreview(`/images/${res.data.image}`);
            } catch (err) {
                console.error("Error loading product:", err);
                alert("Failed to load product!");
            } finally {
                setLoading(false);
            }
        };

        loadProduct();
    }, [id]);


    // Image change handler
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setNewImage(file);

        if (file) {
            setPreview(URL.createObjectURL(file)); // live preview
        }
    };


    // Update product
    const update = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);

            const data = new FormData();
            data.append("name", form.name);
            data.append("details", form.details);
            data.append("price", form.price);
            data.append("size", form.size);
            data.append("color", form.color);
            data.append("category", form.category);

            if (newImage) {
                data.append("image", newImage); // only if updated
            }

            await axios.post(`/products/${id}`, data);

            navigate("/"); // redirect to product list
        } catch (error) {
            console.error("Update failed:", error);
            alert("Something went wrong while updating!");
        } finally {
            setSaving(false);
        }
    };



    return (
        <div className="container mt-4">

            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="fw-bold">Edit Product</h3>
                <Link to="/" className="btn btn-secondary">Back</Link>
            </div>

            <div className="card shadow-sm">
                <div className="card-body">

                    {loading ? (
                        <div className="text-center py-4">
                            <div className="spinner-border text-primary"></div>
                            <p className="mt-2">Loading product...</p>
                        </div>
                    ) : (
                        <form onSubmit={update}>

                            {/* NAME & PRICE */}
                            <div className="row mb-3">
                                <div className="col">
                                    <input
                                        className="form-control"
                                        placeholder="Name"
                                        value={form.name}
                                        onChange={(e) =>
                                            setForm({ ...form, name: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                                <div className="col">
                                    <input
                                        className="form-control"
                                        placeholder="Price"
                                        type="number"
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

                            {/* DETAILS */}
                            <textarea
                                className="form-control mb-3"
                                placeholder="Details"
                                value={form.details}
                                onChange={(e) =>
                                    setForm({ ...form, details: e.target.value })
                                }
                                required
                            ></textarea>

                            {/* SIZE / COLOR / CATEGORY */}
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

                            {/* IMAGE PREVIEW */}
                            <div className="mb-3">
                                <label className="form-label">Product Image</label><br />

                                {preview && (
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        style={{
                                            width: "120px",
                                            height: "120px",
                                            objectFit: "cover",
                                            borderRadius: "8px",
                                            border: "1px solid #ccc",
                                            marginBottom: "10px"
                                        }}
                                    />
                                )}

                                <input
                                    type="file"
                                    className="form-control"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </div>

                            {/* SAVE BUTTON */}
                            <button
                                className="btn btn-success"
                                disabled={saving}
                            >
                                {saving ? "Updating..." : "Update Product"}
                            </button>

                        </form>
                    )}

                </div>
            </div>
        </div>
    );
}
