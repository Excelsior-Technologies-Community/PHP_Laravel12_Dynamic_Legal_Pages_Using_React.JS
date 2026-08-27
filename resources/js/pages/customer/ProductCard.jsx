import React from "react";

export default function ProductCard({
    product,
    selectedQty,
    isOutOfStock,
    wishlistIds,
    wishlistLoading,
    added,
    onWishlist,
    onQuantityChange,
    onAddToCart,
    onViewDetails,
}) {
    const productId = Number(product.id);

    const isWishlisted = wishlistIds.includes(productId);

    const stock = Number(product.stock ?? 0);

    return (
        <div className="col-12 col-sm-6 col-md-4 col-lg-3">

            <div className="card h-100 shadow-sm border-0">

                {/* =====================================================
                    PRODUCT IMAGE
                ====================================================== */}

                <div className="position-relative">

                    <img
                        src={
                            product.image
                                ? `/images/${product.image}`
                                : "/images/no-image.png"
                        }
                        className="card-img-top"
                        alt={product.name || "Product"}
                        style={{
                            height: "220px",
                            objectFit: "contain",
                            background: "#f8f9fa",
                            padding: "15px",
                        }}
                        onError={(event) => {
                            event.currentTarget.src =
                                "/images/no-image.png";
                        }}
                    />

                    {/* =================================================
                        WISHLIST BUTTON
                    ================================================== */}

                    <button
                        type="button"
                        className={`btn position-absolute top-0 end-0 m-2 rounded-circle shadow-sm ${
                            isWishlisted
                                ? "btn-danger"
                                : "btn-light"
                        }`}
                        onClick={() => onWishlist(productId)}
                        disabled={
                            wishlistLoading === productId
                        }
                        title={
                            isWishlisted
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
                        {wishlistLoading === productId
                            ? "..."
                            : isWishlisted
                            ? "❤️"
                            : "🤍"}
                    </button>

                    {/* =================================================
                        CATEGORY
                    ================================================== */}

                    {product.category && (
                        <span className="position-absolute top-0 start-0 m-2 badge bg-primary">
                            {product.category}
                        </span>
                    )}

                </div>


                {/* =====================================================
                    PRODUCT DETAILS
                ====================================================== */}

                <div className="card-body d-flex flex-column">

                    {/* PRODUCT NAME */}

                    <h5
                        className="card-title fw-semibold text-truncate"
                        title={product.name}
                    >
                        {product.name}
                    </h5>


                    {/* DETAILS */}

                    <p
                        className="text-muted small mb-2"
                        style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                        }}
                    >
                        {product.details || "No description available."}
                    </p>


                    {/* =================================================
                        SIZE / COLOR
                    ================================================== */}

                    <div className="mb-2">

                        {product.size && (
                            <span className="badge bg-light text-dark border me-1">
                                Size: {product.size}
                            </span>
                        )}

                        {product.color && (
                            <span className="badge bg-light text-dark border">
                                Color: {product.color}
                            </span>
                        )}

                    </div>


                    {/* =================================================
                        PRICE
                    ================================================== */}

                    <h5 className="text-success fw-bold mb-2">
                        ₹{" "}
                        {parseFloat(
                            product.price || 0
                        ).toFixed(2)}
                    </h5>


                    {/* =================================================
                        STOCK
                    ================================================== */}

                    <div className="mb-2">

                        {isOutOfStock ? (
                            <span className="badge bg-danger">
                                Out of Stock
                            </span>
                        ) : (
                            <span className="badge bg-success">
                                {stock} in stock
                            </span>
                        )}

                    </div>


                    {/* =================================================
                        QUANTITY
                    ================================================== */}

                    {!isOutOfStock && (
                        <div className="mb-3">

                            <label className="form-label small fw-semibold">
                                Quantity
                            </label>

                            <select
                                className="form-select form-select-sm"
                                value={selectedQty}
                                onChange={(event) =>
                                    onQuantityChange(
                                        productId,
                                        event.target.value
                                    )
                                }
                            >

                                {[1, 2, 3, 4, 5]
                                    .filter(
                                        (number) =>
                                            number <= stock
                                    )
                                    .map((number) => (
                                        <option
                                            key={number}
                                            value={number}
                                        >
                                            {number}
                                        </option>
                                    ))}

                            </select>

                        </div>
                    )}


                    {/* =================================================
                        BUTTONS
                    ================================================== */}

                    <div className="d-grid gap-2 mt-auto">

                        {/* VIEW DETAILS */}

                        <button
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                            onClick={() =>
                                onViewDetails(productId)
                            }
                        >
                            View Details
                        </button>


                        {/* ADD TO CART */}

                        {added[productId] ? (

                            <button
                                type="button"
                                className="btn btn-success btn-sm"
                                onClick={() =>
                                    window.location.href =
                                        "/cart"
                                }
                            >
                                ✓ Added - View Cart
                            </button>

                        ) : (

                            <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                disabled={isOutOfStock}
                                onClick={() =>
                                    onAddToCart(product)
                                }
                            >
                                {isOutOfStock
                                    ? "Out of Stock"
                                    : "🛒 Add to Cart"}
                            </button>

                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}