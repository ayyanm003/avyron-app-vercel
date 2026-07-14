import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style/Product_style.css";
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
// Product Component
// ============================================

export default function Product() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [cartFull, setCartFull] = useState(false);
    const [toast, setToast] = useState("");

    const navigate = useNavigate();
    const server = "http://localhost:2000/";

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get(`${server}product_read_client`);
                setProducts(res.data.data.slice(0, 6));
            } catch (error) {
                console.log(error);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Cart full hai ya nahi — mount pe aur cart change hone pe check karo
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

    // *************** Add to Cart ***************
    const handleAddToCart = (e, p) => {
        e.preventDefault();
        e.stopPropagation();

        addToCart(p, "Product", showToast);
    };

    // *************** Buy Now ***************
    const handleBuyNow = (e, p) => {
        e.preventDefault();
        e.stopPropagation();

        addToCart(p, "Product", showToast);
    };

    return (
        <section className="prod-section">
            <div className="prod-section__inner">
                <h2 className="prod-heading">Products</h2>

                {loading && (
                    <div className="prod-grid">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="prod-card prod-card--skeleton" />
                        ))}
                    </div>
                )}

                {!loading && error && (
                    <p className="prod-message">Couldn't load products right now. Please try again later.</p>
                )}

                {!loading && !error && products.length === 0 && (
                    <p className="prod-message">No products available yet.</p>
                )}

                {!loading && !error && products.length > 0 && (
                    <div className="prod-grid">
                        {products.map((p) => (
                            <Link key={p._id} to={`/product_detials/${p._id}`} className="prod-card">
                                <div className="prod-card__img-wrap">
                                    <img src={p.img} alt={p.name} className="prod-card__img" />
                                </div>

                                <div className="prod-card__body">
                                    <h3 className="prod-card__title">{p.name}</h3>
                                    <span className="prod-card__price">Rs. {p.price}</span>
                                    {/* <p className="prod-card__desc">{p.description}</p> */}

                                    <div className="prod-card__footer">
                                        <span className="prod-card__category">
                                            {p.category?.category_name}
                                        </span>

                                        <div className="prod-card__actions">
                                            <button
                                                className="prod-card__btn prod-card__btn--outline"
                                                disabled={cartFull}
                                                onClick={(e) => handleAddToCart(e, p)}
                                            >
                                                <svg viewBox="0 0 20 20" fill="none" className="prod-cart-icon">
                                                    <path d="M2 3h2l1.4 9.2a1.5 1.5 0 001.5 1.3h6.6a1.5 1.5 0 001.5-1.2L16 6H4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <circle cx="7" cy="17" r="1.2" fill="currentColor" />
                                                    <circle cx="14" cy="17" r="1.2" fill="currentColor" />
                                                </svg>
                                                {cartFull ? "Cart Full" : "Add to Cart"}
                                            </button>
                                            {/* <button
                                                className="prod-card__btn prod-card__btn--solid"
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

                <div className="prod-viewall-wrap">
                    <Link to="/product_page" className="prod-viewall">
                        View All
                    </Link>
                </div>
            </div>

            {toast && <div className="prod-toast">{toast}</div>}
        </section>
    );
}
