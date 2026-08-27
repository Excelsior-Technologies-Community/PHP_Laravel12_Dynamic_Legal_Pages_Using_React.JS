import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Index() {
    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Search
    const [search, setSearch] = useState("");

    // Filters
    const [category, setCategory] = useState("");
    const [size, setSize] = useState("");
    const [color, setColor] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [featured, setFeatured] = useState("");

    // Sorting
    const [sort, setSort] = useState("latest");

    // Pagination
    const [page, setPage] = useState(1);
    const [perPage] = useState(5);
    const [totalPages, setTotalPages] = useState(1);

    // =========================================================
    // FETCH PRODUCTS
    // =========================================================

    const fetchProducts = async (selectedPage = page) => {
        try {
            setLoading(true);
            setError("");

            const params = {
                search: search || undefined,
                category: category || undefined,
                size: size || undefined,
                color: color || undefined,
                min_price: minPrice || undefined,
                max_price: maxPrice || undefined,
                featured: featured || undefined,
                sort: sort,
                page: selectedPage,
                per_page: perPage,
            };

            const res = await axios.get("/products-data", {
                params,
            });

            console.log("Products API Response:", res.data);

            let productData = [];

            if (Array.isArray(res.data)) {
                productData = res.data;

                setTotalPages(1);
            } else if (Array.isArray(res.data.data)) {
                productData = res.data.data;

                if (res.data.last_page) {
                    setTotalPages(res.data.last_page);
                } else if (res.data.meta?.last_page) {
                    setTotalPages(res.data.meta.last_page);
                } else {
                    setTotalPages(1);
                }
            } else if (Array.isArray(res.data.products)) {
                productData = res.data.products;

                if (res.data.last_page) {
                    setTotalPages(res.data.last_page);
                } else {
                    setTotalPages(1);
                }
            }

            setProducts(productData);
            setPage(selectedPage);

        } catch (err) {
            console.error("Error fetching products:", err);

            setProducts([]);

            setError(
                err.response?.data?.message ||
                "Failed to load products. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {
        fetchProducts(1);
    }, []);

    // =========================================================
    // SEARCH / FILTER
    // =========================================================

    const handleFilter = () => {
        fetchProducts(1);
    };

    // =========================================================
    // RESET FILTERS
    // =========================================================

    const resetFilters = () => {
        setSearch("");
        setCategory("");
        setSize("");
        setColor("");
        setMinPrice("");
        setMaxPrice("");
        setFeatured("");
        setSort("latest");

        setTimeout(() => {
            fetchProducts(1);
        }, 0);
    };

    // =========================================================
    // DELETE PRODUCT
    // =========================================================

    const deleteProduct = async (id) => {
        if (
            !window.confirm(
                "Are you sure you want to delete this product?"
            )
        ) {
            return;
        }

        try {
            await axios.delete(`/api/products/${id}`);

            alert("Product deleted successfully.");

            fetchProducts(page);

        } catch (err) {
            console.error("Delete failed:", err);

            alert(
                err.response?.data?.message ||
                "Something went wrong!"
            );
        }
    };

    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {
        return (
            <div className="container mt-4">
                <div className="card shadow-sm">
                    <div className="card-body text-center py-5">

                        <div className="spinner-border text-primary"></div>

                        <p className="mt-3 mb-0">
                            Loading products...
                        </p>

                    </div>
                </div>
            </div>
        );
    }

    // =========================================================
    // PAGE
    // =========================================================

    return (
        <div className="container mt-4">

            {/* =====================================================
                HEADER
            ====================================================== */}

            <div className="d-flex justify-content-between align-items-center mb-3">

                <h3 className="fw-bold">
                    Products
                </h3>

                <Link
                    to="/create"
                    className="btn btn-success shadow-sm"
                >
                    + Add Product
                </Link>

            </div>

            {/* =====================================================
                ERROR
            ====================================================== */}

            {error && (
                <div className="alert alert-danger">

                    <strong>Error:</strong>{" "}
                    {error}

                    <button
                        className="btn btn-outline-danger btn-sm ms-3"
                        onClick={() => fetchProducts(1)}
                    >
                        Retry
                    </button>

                </div>
            )}

            {/* =====================================================
                SEARCH + FILTERS
            ====================================================== */}

            {!error && (
                <div className="card shadow-sm mb-4">

                    <div className="card-body">

                        <h5 className="fw-bold mb-3">
                            Search & Filters
                        </h5>

                        <div className="row g-3">

                            {/* SEARCH */}

                            <div className="col-md-6">

                                <label className="form-label">
                                    Search
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search product name..."
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleFilter();
                                        }
                                    }}
                                />

                            </div>

                            {/* CATEGORY */}

                            <div className="col-md-3">

                                <label className="form-label">
                                    Category
                                </label>

                                <select
                                    className="form-select"
                                    value={category}
                                    onChange={(e) =>
                                        setCategory(e.target.value)
                                    }
                                >
                                    <option value="">
                                        All Categories
                                    </option>

                                    <option value="Clothing">
                                        Clothing
                                    </option>

                                    <option value="Accessories">
                                        Accessories
                                    </option>

                                    <option value="Footwear">
                                        Footwear
                                    </option>

                                </select>

                            </div>

                            {/* SIZE */}

                            <div className="col-md-3">

                                <label className="form-label">
                                    Size
                                </label>

                                <select
                                    className="form-select"
                                    value={size}
                                    onChange={(e) =>
                                        setSize(e.target.value)
                                    }
                                >

                                    <option value="">
                                        All Sizes
                                    </option>

                                    <option value="Free">
                                        Free
                                    </option>

                                    <option value="S">
                                        S
                                    </option>

                                    <option value="M">
                                        M
                                    </option>

                                    <option value="L">
                                        L
                                    </option>

                                    <option value="XL">
                                        XL
                                    </option>

                                    <option value="9">
                                        9
                                    </option>

                                </select>

                            </div>

                            {/* COLOR */}

                            <div className="col-md-3">

                                <label className="form-label">
                                    Color
                                </label>

                                <select
                                    className="form-select"
                                    value={color}
                                    onChange={(e) =>
                                        setColor(e.target.value)
                                    }
                                >

                                    <option value="">
                                        All Colors
                                    </option>

                                    <option value="Black">
                                        Black
                                    </option>

                                    <option value="White">
                                        White
                                    </option>

                                    <option value="Brown">
                                        Brown
                                    </option>

                                    <option value="Blue">
                                        Blue
                                    </option>

                                </select>

                            </div>

                            {/* MIN PRICE */}

                            <div className="col-md-3">

                                <label className="form-label">
                                    Min Price
                                </label>

                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="₹ Min"
                                    value={minPrice}
                                    onChange={(e) =>
                                        setMinPrice(e.target.value)
                                    }
                                />

                            </div>

                            {/* MAX PRICE */}

                            <div className="col-md-3">

                                <label className="form-label">
                                    Max Price
                                </label>

                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="₹ Max"
                                    value={maxPrice}
                                    onChange={(e) =>
                                        setMaxPrice(e.target.value)
                                    }
                                />

                            </div>

                            {/* FEATURED */}

                            <div className="col-md-3">

                                <label className="form-label">
                                    Featured
                                </label>

                                <select
                                    className="form-select"
                                    value={featured}
                                    onChange={(e) =>
                                        setFeatured(e.target.value)
                                    }
                                >

                                    <option value="">
                                        All Products
                                    </option>

                                    <option value="1">
                                        Featured Only
                                    </option>

                                    <option value="0">
                                        Non Featured
                                    </option>

                                </select>

                            </div>

                            {/* SORT */}

                            <div className="col-md-3">

                                <label className="form-label">
                                    Sort By
                                </label>

                                <select
                                    className="form-select"
                                    value={sort}
                                    onChange={(e) =>
                                        setSort(e.target.value)
                                    }
                                >

                                    <option value="latest">
                                        Latest
                                    </option>

                                    <option value="oldest">
                                        Oldest
                                    </option>

                                    <option value="price_low">
                                        Price Low → High
                                    </option>

                                    <option value="price_high">
                                        Price High → Low
                                    </option>

                                    <option value="name_asc">
                                        Name A → Z
                                    </option>

                                    <option value="name_desc">
                                        Name Z → A
                                    </option>

                                </select>

                            </div>

                            {/* BUTTONS */}

                            <div className="col-12">

                                <button
                                    type="button"
                                    className="btn btn-primary me-2"
                                    onClick={handleFilter}
                                >
                                    🔍 Search / Filter
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={resetFilters}
                                >
                                    Reset
                                </button>

                            </div>

                        </div>

                    </div>

                </div>
            )}

            {/* =====================================================
                PRODUCTS TABLE
            ====================================================== */}

            {!error && (
                <div className="card shadow-sm">

                    <div className="card-body">

                        <div className="table-responsive">

                            <table className="table table-bordered table-hover align-middle">

                                <thead className="table-dark">

                                    <tr>

                                        <th>
                                            Image
                                        </th>

                                        <th>
                                            Name
                                        </th>

                                        <th>
                                            Price
                                        </th>

                                        <th>
                                            Size
                                        </th>

                                        <th>
                                            Color
                                        </th>

                                        <th>
                                            Category
                                        </th>

                                        <th>
                                            Featured
                                        </th>

                                        <th width="180">
                                            Action
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {products.length === 0 ? (

                                        <tr>

                                            <td
                                                colSpan="8"
                                                className="text-center py-4"
                                            >
                                                No products found
                                            </td>

                                        </tr>

                                    ) : (

                                        products.map((p) => (

                                            <tr key={p.id}>

                                                {/* IMAGE */}

                                                <td>

                                                    {p.image ? (

                                                        <img
                                                            src={`/images/${p.image}`}
                                                            width="60"
                                                            height="60"
                                                            className="rounded"
                                                            alt={p.name}
                                                            style={{
                                                                objectFit:
                                                                    "cover",
                                                            }}
                                                        />

                                                    ) : (

                                                        <span className="text-muted">
                                                            No Image
                                                        </span>

                                                    )}

                                                </td>

                                                {/* NAME */}

                                                <td>
                                                    {p.name}
                                                </td>

                                                {/* PRICE */}

                                                <td>
                                                    ₹ {p.price}
                                                </td>

                                                {/* SIZE */}

                                                <td>
                                                    {p.size}
                                                </td>

                                                {/* COLOR */}

                                                <td>
                                                    {p.color}
                                                </td>

                                                {/* CATEGORY */}

                                                <td>
                                                    {p.category}
                                                </td>

                                                {/* FEATURED */}

                                                <td>

                                                    {p.featured == 1 ? (

                                                        <span className="badge bg-success">
                                                            Featured
                                                        </span>

                                                    ) : (

                                                        <span className="badge bg-secondary">
                                                            No
                                                        </span>

                                                    )}

                                                </td>

                                                {/* ACTION */}

                                                <td>

                                                    <Link
                                                        to={`/edit/${p.id}`}
                                                        className="btn btn-sm btn-primary me-2"
                                                    >
                                                        Edit
                                                    </Link>

                                                    <button
                                                        onClick={() =>
                                                            deleteProduct(
                                                                p.id
                                                            )
                                                        }
                                                        className="btn btn-sm btn-danger"
                                                    >
                                                        Delete
                                                    </button>

                                                </td>

                                            </tr>

                                        ))

                                    )}

                                </tbody>

                            </table>

                        </div>

                        {/* =================================================
                            PAGINATION
                        ================================================== */}

                        {totalPages > 1 && (

                            <div className="d-flex justify-content-center mt-4">

                                <nav>

                                    <ul className="pagination">

                                        <li
                                            className={`page-item ${
                                                page === 1
                                                    ? "disabled"
                                                    : ""
                                            }`}
                                        >

                                            <button
                                                className="page-link"
                                                onClick={() =>
                                                    fetchProducts(
                                                        page - 1
                                                    )
                                                }
                                                disabled={page === 1}
                                            >
                                                Previous
                                            </button>

                                        </li>

                                        {Array.from(
                                            {
                                                length: totalPages,
                                            },
                                            (_, index) => index + 1
                                        ).map((pageNumber) => (

                                            <li
                                                key={pageNumber}
                                                className={`page-item ${
                                                    page === pageNumber
                                                        ? "active"
                                                        : ""
                                                }`}
                                            >

                                                <button
                                                    className="page-link"
                                                    onClick={() =>
                                                        fetchProducts(
                                                            pageNumber
                                                        )
                                                    }
                                                >
                                                    {pageNumber}
                                                </button>

                                            </li>

                                        ))}

                                        <li
                                            className={`page-item ${
                                                page === totalPages
                                                    ? "disabled"
                                                    : ""
                                            }`}
                                        >

                                            <button
                                                className="page-link"
                                                onClick={() =>
                                                    fetchProducts(
                                                        page + 1
                                                    )
                                                }
                                                disabled={
                                                    page === totalPages
                                                }
                                            >
                                                Next
                                            </button>

                                        </li>

                                    </ul>

                                </nav>

                            </div>

                        )}

                    </div>

                </div>
            )}

        </div>
    );
}