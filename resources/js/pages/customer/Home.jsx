import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [qty, setQty] = useState({});
    const [added, setAdded] = useState({});

    const [searchQuery, setSearchQuery] = useState("");

    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);

    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    const [sortBy, setSortBy] = useState("created_at");
    const [sortOrder, setSortOrder] = useState("desc");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Wishlist
    const [wishlistIds, setWishlistIds] = useState([]);
    const [wishlistLoading, setWishlistLoading] = useState(null);

    /*
    |--------------------------------------------------------------------------
    | Load Products
    |--------------------------------------------------------------------------
    */

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError("");

            const params = {};

            if (searchQuery.trim()) {
                params.search = searchQuery.trim();
            }

            if (selectedCategories.length > 0) {
                params.categories = selectedCategories;
            }

            if (selectedColors.length > 0) {
                params.colors = selectedColors;
            }

            if (selectedSizes.length > 0) {
                params.sizes = selectedSizes;
            }

            if (minPrice !== "") {
                params.min_price = minPrice;
            }

            if (maxPrice !== "") {
                params.max_price = maxPrice;
            }

            params.sort_by = sortBy;
            params.sort_order = sortOrder;

           const response = await axios.get("/products-data", {
    params: params,
});

const productsData = Array.isArray(response.data)
    ? response.data
    : response.data.data || [];
            setProducts(productsData);

            const defaultQty = {};

            productsData.forEach((product) => {
                defaultQty[product.id] = 1;
            });

            setQty(defaultQty);

        } catch (err) {
            console.error(
                "Failed to load products:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to load products. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Load Wishlist
    |--------------------------------------------------------------------------
    */

    const fetchWishlistIds = async () => {
        try {
            const response = await axios.get("/api/wishlist");

            /*
            |--------------------------------------------------------------------------
            | Wishlist API may return:
            |
            | []
            |
            | OR
            |
            | { data: [] }
            |--------------------------------------------------------------------------
            */

            const wishlistData = Array.isArray(response.data)
                ? response.data
                : response.data.data || response.data.items || [];

            const ids = wishlistData.map((product) => {
                return Number(
                    product.id ||
                    product.product_id
                );
            });

            setWishlistIds(ids);

        } catch (err) {
            console.error(
                "Failed to load wishlist:",
                err
            );
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Product Filter Effect
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchProducts();
        }, 300);

        return () => clearTimeout(timer);
    }, [
        searchQuery,
        selectedCategories,
        selectedColors,
        selectedSizes,
        minPrice,
        maxPrice,
        sortBy,
        sortOrder,
    ]);

    /*
    |--------------------------------------------------------------------------
    | Load Wishlist Once
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        fetchWishlistIds();
    }, []);

    /*
    |--------------------------------------------------------------------------
    | Toggle Wishlist
    |--------------------------------------------------------------------------
    */

    const toggleWishlist = async (productId) => {
        try {
            setWishlistLoading(productId);

            const response = await axios.post(
                `/api/wishlist/${productId}/toggle`
            );

            if (response.data.wishlisted) {
                setWishlistIds((previous) => {
                    if (previous.includes(productId)) {
                        return previous;
                    }

                    return [
                        ...previous,
                        productId,
                    ];
                });
            } else {
                setWishlistIds((previous) =>
                    previous.filter(
                        (id) => id !== productId
                    )
                );
            }

            // Notify MainLayout
            window.dispatchEvent(
                new Event("wishlistUpdated")
            );

        } catch (err) {
            console.error(
                "Wishlist update failed:",
                err
            );

            alert(
                err.response?.data?.message ||
                "Unable to update wishlist."
            );
        } finally {
            setWishlistLoading(null);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Filter Options
    |--------------------------------------------------------------------------
    */

    const categories = useMemo(() => {
        return [
            ...new Set(
                products.map(
                    (product) => product.category
                )
            ),
        ]
            .filter(Boolean)
            .sort();
    }, [products]);

    const colors = useMemo(() => {
        return [
            ...new Set(
                products.map(
                    (product) => product.color
                )
            ),
        ]
            .filter(Boolean)
            .sort();
    }, [products]);

    const sizes = useMemo(() => {
        return [
            ...new Set(
                products.map(
                    (product) => product.size
                )
            ),
        ]
            .filter(Boolean)
            .sort();
    }, [products]);

    /*
    |--------------------------------------------------------------------------
    | Toggle Filter
    |--------------------------------------------------------------------------
    */

    const toggleFilter = (
        value,
        selected,
        setter
    ) => {
        if (selected.includes(value)) {
            setter(
                selected.filter(
                    (item) => item !== value
                )
            );
        } else {
            setter([
                ...selected,
                value,
            ]);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Quantity
    |--------------------------------------------------------------------------
    */

    const changeQty = (
        productId,
        value
    ) => {
        let newQty = parseInt(value);

        if (isNaN(newQty)) {
            newQty = 1;
        }

        newQty = Math.max(
            1,
            Math.min(5, newQty)
        );

        setQty((previous) => ({
            ...previous,
            [productId]: newQty,
        }));
    };

    /*
    |--------------------------------------------------------------------------
    | Add To Cart
    |--------------------------------------------------------------------------
    */

    const addToCart = async (product) => {
        try {
            const selectedQty =
                qty[product.id] || 1;

            /*
            |--------------------------------------------------------------------------
            | Stock check on frontend
            |--------------------------------------------------------------------------
            */

            if (
                product.stock !== undefined &&
                Number(product.stock) <= 0
            ) {
                alert("Product is out of stock.");
                return;
            }

            if (
                product.stock !== undefined &&
                selectedQty > Number(product.stock)
            ) {
                alert(
                    `Only ${product.stock} item(s) available in stock.`
                );
                return;
            }

            await axios.post(
                "/api/add-to-cart",
                {
                    id: product.id,
                    qty: selectedQty,
                }
            );

            setAdded((previous) => ({
                ...previous,
                [product.id]: true,
            }));

        } catch (err) {
            console.error(
                "Add to cart failed:",
                err
            );

            alert(
                err.response?.data?.message ||
                "Unable to add product to cart."
            );
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Clear Filters
    |--------------------------------------------------------------------------
    */

    const clearFilters = () => {
        setSearchQuery("");
        setSelectedCategories([]);
        setSelectedColors([]);
        setSelectedSizes([]);
        setMinPrice("");
        setMaxPrice("");
        setSortBy("created_at");
        setSortOrder("desc");
    };

    /*
    |--------------------------------------------------------------------------
    | Active Filters
    |--------------------------------------------------------------------------
    */

    const hasFilters =
        searchQuery.trim() !== "" ||
        selectedCategories.length > 0 ||
        selectedColors.length > 0 ||
        selectedSizes.length > 0 ||
        minPrice !== "" ||
        maxPrice !== "" ||
        sortBy !== "created_at" ||
        sortOrder !== "desc";

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <div className="bg-light min-vh-100">

            {/* =========================================================
                HERO
            ========================================================== */}

            <div className="bg-primary text-white py-5 mb-4">
                <div className="container">

                    <h1 className="display-5 fw-bold mb-3">
                        Discover Premium Products
                    </h1>

                    <p className="lead mb-4">
                        Find exactly what you're looking for
                        with advanced filters and sorting.
                    </p>

                    <div className="input-group input-group-lg">

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by product name, description, category..."
                            value={searchQuery}
                            onChange={(e) =>
                                setSearchQuery(
                                    e.target.value
                                )
                            }
                        />

                        {searchQuery && (
                            <button
                                className="btn btn-light"
                                onClick={() =>
                                    setSearchQuery("")
                                }
                            >
                                ✕
                            </button>
                        )}

                    </div>

                </div>
            </div>


            <div className="container pb-5">

                {/* =====================================================
                    FILTER PANEL
                ====================================================== */}

                <div className="card border-0 shadow-sm mb-4">

                    <div className="card-body">

                        <div className="d-flex justify-content-between align-items-center mb-4">

                            <div>
                                <h4 className="fw-bold mb-1">
                                    Advanced Filters
                                </h4>

                                <small className="text-muted">
                                    Filter products by category,
                                    color, size and price.
                                </small>
                            </div>

                            {hasFilters && (
                                <button
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={clearFilters}
                                >
                                    Clear All Filters
                                </button>
                            )}

                        </div>


                        <div className="row g-4">

                            {/* Categories */}

                            <div className="col-lg-4">

                                <h6 className="fw-bold">
                                    Categories
                                </h6>

                                <div className="d-flex flex-wrap gap-2">

                                    {categories.length === 0 ? (
                                        <small className="text-muted">
                                            No categories available
                                        </small>
                                    ) : (
                                        categories.map(
                                            (category) => (
                                                <button
                                                    key={category}
                                                    type="button"
                                                    className={`btn btn-sm ${
                                                        selectedCategories.includes(
                                                            category
                                                        )
                                                            ? "btn-primary"
                                                            : "btn-outline-primary"
                                                    }`}
                                                    onClick={() =>
                                                        toggleFilter(
                                                            category,
                                                            selectedCategories,
                                                            setSelectedCategories
                                                        )
                                                    }
                                                >
                                                    {category}
                                                </button>
                                            )
                                        )
                                    )}

                                </div>

                            </div>


                            {/* Colors */}

                            <div className="col-lg-4">

                                <h6 className="fw-bold">
                                    Colors
                                </h6>

                                <div className="d-flex flex-wrap gap-2">

                                    {colors.length === 0 ? (
                                        <small className="text-muted">
                                            No colors available
                                        </small>
                                    ) : (
                                        colors.map(
                                            (color) => (
                                                <button
                                                    key={color}
                                                    type="button"
                                                    className={`btn btn-sm ${
                                                        selectedColors.includes(
                                                            color
                                                        )
                                                            ? "btn-dark"
                                                            : "btn-outline-dark"
                                                    }`}
                                                    onClick={() =>
                                                        toggleFilter(
                                                            color,
                                                            selectedColors,
                                                            setSelectedColors
                                                        )
                                                    }
                                                >
                                                    {color}
                                                </button>
                                            )
                                        )
                                    )}

                                </div>

                            </div>


                            {/* Sizes */}

                            <div className="col-lg-4">

                                <h6 className="fw-bold">
                                    Sizes
                                </h6>

                                <div className="d-flex flex-wrap gap-2">

                                    {sizes.length === 0 ? (
                                        <small className="text-muted">
                                            No sizes available
                                        </small>
                                    ) : (
                                        sizes.map(
                                            (size) => (
                                                <button
                                                    key={size}
                                                    type="button"
                                                    className={`btn btn-sm ${
                                                        selectedSizes.includes(
                                                            size
                                                        )
                                                            ? "btn-success"
                                                            : "btn-outline-success"
                                                    }`}
                                                    onClick={() =>
                                                        toggleFilter(
                                                            size,
                                                            selectedSizes,
                                                            setSelectedSizes
                                                        )
                                                    }
                                                >
                                                    {size}
                                                </button>
                                            )
                                        )
                                    )}

                                </div>

                            </div>


                            {/* Price */}

                            <div className="col-md-6">

                                <h6 className="fw-bold">
                                    Price Range
                                </h6>

                                <div className="row g-2">

                                    <div className="col">

                                        <input
                                            type="number"
                                            min="0"
                                            className="form-control"
                                            placeholder="Minimum ₹"
                                            value={minPrice}
                                            onChange={(e) =>
                                                setMinPrice(
                                                    e.target.value
                                                )
                                            }
                                        />

                                    </div>

                                    <div className="col">

                                        <input
                                            type="number"
                                            min="0"
                                            className="form-control"
                                            placeholder="Maximum ₹"
                                            value={maxPrice}
                                            onChange={(e) =>
                                                setMaxPrice(
                                                    e.target.value
                                                )
                                            }
                                        />

                                    </div>

                                </div>

                            </div>


                            {/* Sorting */}

                            <div className="col-md-6">

                                <h6 className="fw-bold">
                                    Sort Products
                                </h6>

                                <div className="row g-2">

                                    <div className="col">

                                        <select
                                            className="form-select"
                                            value={sortBy}
                                            onChange={(e) =>
                                                setSortBy(
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="created_at">
                                                Date
                                            </option>

                                            <option value="name">
                                                Name
                                            </option>

                                            <option value="price">
                                                Price
                                            </option>

                                            <option value="id">
                                                Product ID
                                            </option>

                                            <option value="stock">
                                                Stock
                                            </option>

                                        </select>

                                    </div>


                                    <div className="col">

                                        <select
                                            className="form-select"
                                            value={sortOrder}
                                            onChange={(e) =>
                                                setSortOrder(
                                                    e.target.value
                                                )
                                            }
                                        >

                                            <option value="desc">
                                                Descending
                                            </option>

                                            <option value="asc">
                                                Ascending
                                            </option>

                                        </select>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* =====================================================
                    RESULTS HEADER
                ====================================================== */}

                <div className="d-flex justify-content-between align-items-center mb-4">

                    <div>

                        <h3 className="fw-bold mb-1">
                            Our Products
                        </h3>

                        <span className="text-muted">
                            {products.length} products found
                        </span>

                    </div>

                    {hasFilters && (
                        <span className="badge bg-primary fs-6">
                            Filters Active
                        </span>
                    )}

                </div>


                {/* =====================================================
                    LOADING
                ====================================================== */}

                {loading && (
                    <div className="text-center py-5">

                        <div className="spinner-border text-primary"></div>

                        <p className="text-muted mt-3">
                            Loading products...
                        </p>

                    </div>
                )}


                {/* =====================================================
                    ERROR
                ====================================================== */}

                {!loading && error && (
                    <div className="alert alert-danger">

                        {error}

                        <button
                            className="btn btn-sm btn-outline-danger ms-3"
                            onClick={fetchProducts}
                        >
                            Retry
                        </button>

                    </div>
                )}


                {/* =====================================================
                    NO PRODUCTS
                ====================================================== */}

                {!loading &&
                    !error &&
                    products.length === 0 && (
                        <div className="text-center py-5">

                            <div
                                style={{
                                    fontSize: "70px",
                                }}
                            >
                                📦
                            </div>

                            <h4 className="text-muted mt-3">
                                No products found
                            </h4>

                            <p className="text-muted">
                                Try changing your filters or
                                search term.
                            </p>

                            <button
                                className="btn btn-primary"
                                onClick={clearFilters}
                            >
                                Clear Filters
                            </button>

                        </div>
                    )}


                {/* =====================================================
                    PRODUCT GRID
                ====================================================== */}

                {!loading &&
                    !error &&
                    products.length > 0 && (

                        <div className="row g-4">

                            {products.map((product) => {

                                const productStock =
                                    Number(product.stock ?? 0);

                                const isOutOfStock =
                                    productStock <= 0;

                                const selectedQty =
                                    qty[product.id] || 1;

                                return (
                                    <div
                                        className="col-12 col-sm-6 col-md-4 col-lg-3"
                                        key={product.id}
                                    >

                                        <div className="card h-100 shadow-sm border-0">

                                            {/* IMAGE */}

                                            <div className="position-relative">

                                                <img
                                                    src={`/images/${product.image}`}
                                                    className="card-img-top product-image"
                                                    alt={product.name}
                                                    style={{
                                                        height: "220px",
                                                        objectFit: "contain",
                                                        background: "#f8f9fa",
                                                        padding: "15px",
                                                    }}
                                                />

                                                {/* Wishlist */}

                                                <button
                                                    type="button"
                                                    className={`btn position-absolute top-0 end-0 m-2 rounded-circle shadow-sm ${
                                                        wishlistIds.includes(
                                                            product.id
                                                        )
                                                            ? "btn-danger"
                                                            : "btn-light"
                                                    }`}
                                                    onClick={() =>
                                                        toggleWishlist(
                                                            product.id
                                                        )
                                                    }
                                                    disabled={
                                                        wishlistLoading ===
                                                        product.id
                                                    }
                                                    title={
                                                        wishlistIds.includes(
                                                            product.id
                                                        )
                                                            ? "Remove from wishlist"
                                                            : "Add to wishlist"
                                                    }
                                                    style={{
                                                        width: "42px",
                                                        height: "42px",
                                                        fontSize: "20px",
                                                        padding: 0,
                                                    }}
                                                >

                                                    {wishlistLoading ===
                                                    product.id
                                                        ? "..."
                                                        : wishlistIds.includes(
                                                            product.id
                                                        )
                                                            ? "❤️"
                                                            : "🤍"}

                                                </button>


                                                {/* Category */}

                                                {product.category && (
                                                    <span className="position-absolute top-0 start-0 m-2 badge bg-primary">
                                                        {product.category}
                                                    </span>
                                                )}

                                            </div>


                                            {/* DETAILS */}

                                            <div className="card-body d-flex flex-column">

                                                <h5
                                                    className="card-title fw-semibold text-truncate"
                                                    title={product.name}
                                                >
                                                    {product.name}
                                                </h5>


                                                <p
                                                    className="text-muted small mb-2"
                                                    style={{
                                                        display:
                                                            "-webkit-box",
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient:
                                                            "vertical",
                                                        overflow:
                                                            "hidden",
                                                    }}
                                                >
                                                    {product.details}
                                                </p>


                                                <div className="mb-2">

                                                    {product.size && (
                                                        <span className="badge bg-light text-dark border me-1">
                                                            Size:{" "}
                                                            {product.size}
                                                        </span>
                                                    )}

                                                    {product.color && (
                                                        <span className="badge bg-light text-dark border">
                                                            Color:{" "}
                                                            {product.color}
                                                        </span>
                                                    )}

                                                </div>


                                                {/* PRICE */}

                                                <div className="mt-auto">

                                                    <div className="d-flex justify-content-between align-items-center mb-2">

                                                        <h5 className="text-success fw-bold mb-0">
                                                            ₹{" "}
                                                            {parseFloat(
                                                                product.price ||
                                                                0
                                                            ).toFixed(2)}
                                                        </h5>

                                                    </div>


                                                    {/* STOCK */}

                                                    <div className="mb-2">

                                                        {isOutOfStock ? (
                                                            <span className="badge bg-danger">
                                                                Out of Stock
                                                            </span>
                                                        ) : (
                                                            <span className="badge bg-success">
                                                                {productStock}{" "}
                                                                in stock
                                                            </span>
                                                        )}

                                                    </div>


                                                    {/* QUANTITY */}

                                                    {!isOutOfStock && (
                                                        <div className="mb-2">

                                                            <label className="form-label small fw-semibold">
                                                                Quantity
                                                            </label>

                                                            <select
                                                                className="form-select form-select-sm"
                                                                value={
                                                                    selectedQty
                                                                }
                                                                onChange={(e) =>
                                                                    changeQty(
                                                                        product.id,
                                                                        e.target.value
                                                                    )
                                                                }
                                                            >

                                                                {[1, 2, 3, 4, 5]
                                                                    .filter(
                                                                        (number) =>
                                                                            number <=
                                                                            productStock
                                                                    )
                                                                    .map(
                                                                        (
                                                                            number
                                                                        ) => (
                                                                            <option
                                                                                key={
                                                                                    number
                                                                                }
                                                                                value={
                                                                                    number
                                                                                }
                                                                            >
                                                                                {
                                                                                    number
                                                                                }
                                                                            </option>
                                                                        )
                                                                    )}

                                                            </select>

                                                        </div>
                                                    )}


                                                    {/* BUTTONS */}

                                                    <div className="d-grid gap-2">

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


                                                        {added[
                                                            product.id
                                                        ] ? (

                                                            <button
                                                                className="btn btn-success btn-sm"
                                                                onClick={() =>
                                                                    navigate(
                                                                        "/cart"
                                                                    )
                                                                }
                                                            >
                                                                ✓ Added - View Cart
                                                            </button>

                                                        ) : (

                                                            <button
                                                                className="btn btn-primary btn-sm"
                                                                disabled={
                                                                    isOutOfStock
                                                                }
                                                                onClick={() =>
                                                                    addToCart(
                                                                        product
                                                                    )
                                                                }
                                                            >
                                                                {isOutOfStock
                                                                    ? "Out of Stock"
                                                                    : "Add to Cart"}
                                                            </button>

                                                        )}

                                                    </div>

                                                </div>

                                            </div>

                                        </div>

                                    </div>
                                );
                            })}

                        </div>
                    )}

            </div>

        </div>
    );
}