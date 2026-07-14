import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./style/Product_details_style.css";

const server = "http://localhost:2000/";

const addToCart = (data, model, onMessage) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length >= 3) {
        onMessage && onMessage("Maximum 3 items allowed.");
        return false;
    }

    cart.push({
        product_id: data._id,
        model: model,

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

export default function Product_details() {
    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [cartFull, setCartFull] = useState(false);
    const [toast, setToast] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setError(false);

            try {
                const res = await axios.get(`${server}product_read_single/${id}`);
                setProduct(res.data.data);
            } catch (err) {
                console.log(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

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

    const handleAddToCart = () => {
        addToCart(product, "Product", showToast);
    };

    if (loading) {
        return (
            <section className="pd-section">
                <div className="pd-section__inner pd-loading">
                    <div className="pd-loading__img" />
                    <div className="pd-loading__info">
                        <div className="pd-loading__line pd-loading__line--title" />
                        <div className="pd-loading__line pd-loading__line--price" />
                        <div className="pd-loading__line" />
                        <div className="pd-loading__line" />
                    </div>
                </div>
            </section>
        );
    }

    if (error || !product) {
        return (
            <section className="pd-section">
                <div className="pd-section__inner">
                    <p className="pd-message">
                        Couldn't find this product. It may have been removed.
                    </p>
                    <Link to="/products" className="pd-back-link">
                        ← Back to Products
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="pd-section">
            <div className="pd-section__inner">

                <div className="pd-image-wrap">
                    <img src={product.img} alt={product.name} className="pd-image" />
                </div>

                <div className="pd-info">
                    <span className="pd-category">
                        {product.category?.category_name}
                    </span>

                    <h1 className="pd-title">{product.name}</h1>

                    <span className="pd-price">Rs. {product.price}</span>

                    <p className="pd-desc">{product.description}</p>

                    <button
                        className="pd-add-btn"
                        disabled={cartFull}
                        onClick={handleAddToCart}
                    >
                        <svg viewBox="0 0 20 20" fill="none" className="pd-cart-icon">
                            <path d="M2 3h2l1.4 9.2a1.5 1.5 0 001.5 1.3h6.6a1.5 1.5 0 001.5-1.2L16 6H4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="7" cy="17" r="1.2" fill="currentColor" />
                            <circle cx="14" cy="17" r="1.2" fill="currentColor" />
                        </svg>
                        {cartFull ? "Cart Full" : "Add to Cart"}
                    </button>
                </div>

            </div>

            {toast && <div className="pd-toast">{toast}</div>}
        </section>
    );
}
