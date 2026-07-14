import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "./style/Category_product_style.css";
import axios from "axios";

// ============================================
// Cart Logic — isi file ke andar (localStorage based)
// ============================================

const addToCart = (data, model, onMessage) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Maximum 3 items
    if (cart.length >= 3) {
        onMessage && onMessage("Maximum 3 items allowed.");
        return false;
    }

    cart.push({
        product_id: data._id,
        model: model, // Product | Tester

        product_img: data.img,
        product_name: data.name,
        product_category: data.category?.category_name || "",
        product_price: data.price,
    });

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));

    onMessage && onMessage("Added to cart");
    return true;
};

const isCartFull = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    return cart.length >= 3;
};


// ============================================
// Category Products Component
// ============================================

const Category_product = () => {

    const { category_name } = useParams();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [cartFull, setCartFull] = useState(false);
    const [toast, setToast] = useState("");

    const server = "http://localhost:2000/";

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(false);

            try {
                const res = await axios.get(
                    `${server}product_read_by_category/${category_name}`
                );
                setProducts(res.data.data);
            } catch (err) {
                console.log(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [category_name]);

    useEffect(() => {
        const checkCartFull = () => setCartFull(isCartFull());
        checkCartFull();
        window.addEventListener("cartUpdated", checkCartFull);
        return () => window.removeEventListener("cartUpdated", checkCartFull);
    }, []);

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(""), 2200);
    };

    const handleAddToCart = (e, p) => {
        e.preventDefault();
        e.stopPropagation();

        addToCart(p, "Product", showToast);
    };

    const handleBuyNow = (e, p) => {
        e.preventDefault();
        e.stopPropagation();

        addToCart(p, "Product", showToast);
    };

    return (
        <section className="cat-section">
            <div className="cat-section__inner">

                <h2 className="cat-heading">{category_name}</h2>

                {loading && (
                    <div className="cat-grid">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="cat-card cat-card--skeleton" />
                        ))}
                    </div>
                )}

                {!loading && error && (
                    <p className="cat-message">Couldn't load products right now. Please try again later.</p>
                )}

                {!loading && !error && products.length === 0 && (
                    <p className="cat-message">No products available in this category yet.</p>
                )}

                {!loading && !error && products.length > 0 && (
                    <div className="cat-grid">
                        {products.map((p) => (
                            <Link key={p._id} to={`/product_detials/${p._id}`} className="cat-card">
                                <div className="cat-card__img-wrap">
                                    <img src={p.img} alt={p.name} className="cat-card__img" />
                                </div>

                                <div className="cat-card__body">
                                    <h3 className="cat-card__title">{p.name}</h3>
                                    <span className="cat-card__price">Rs. {p.price}</span>
                                    {/* <p className="cat-card__desc">{p.description}</p> */}

                                    <div className="cat-card__footer">
                                        <span className="cat-card__category">
                                            {p.category?.category_name}
                                        </span>

                                        <div className="cat-card__actions">
                                            <button
                                                className="cat-card__btn cat-card__btn--outline"
                                                disabled={cartFull}
                                                onClick={(e) => handleAddToCart(e, p)}
                                            >
                                                <svg viewBox="0 0 20 20" fill="none" className="cat-cart-icon">
                                                    <path d="M2 3h2l1.4 9.2a1.5 1.5 0 001.5 1.3h6.6a1.5 1.5 0 001.5-1.2L16 6H4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <circle cx="7" cy="17" r="1.2" fill="currentColor" />
                                                    <circle cx="14" cy="17" r="1.2" fill="currentColor" />
                                                </svg>
                                                {cartFull ? "Cart Full" : "Add to Cart"}
                                            </button>
                                            {/* <button
                                                className="cat-card__btn cat-card__btn--solid"
                                                disabled={cartFull}
                                                onClick={(e) => handleBuyNow(e, p)}
                                            >
                                                Buy Now
                                            </button> */}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

            </div>

            {toast && <div className="cat-toast">{toast}</div>}
        </section>
    );
};

export default Category_product;
