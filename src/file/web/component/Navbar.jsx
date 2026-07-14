import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./style/Navbar_style.css";
import { useNavigate } from "react-router-dom";

const server = "http://localhost:2000/";
const DELIVERY_CHARGE = 200;

// ---------------- ICONS ----------------
const CartIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M3 4h2l1.2 12.2A2 2 0 0 0 8.2 18h9.1a2 2 0 0 0 2-1.7L20.5 8H6.2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9.5" cy="21" r="1.1" />
        <circle cx="17" cy="21" r="1.1" />
    </svg>
);

const ChevronIcon = ({ open }) => (
    <svg
        className={`avy-chevron ${open ? "avy-chevron--open" : ""}`}
        viewBox="0 0 24 24"
        width="12"
        height="12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const CloseIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
);

const EMPTY_FORM = {
    client_name: "",
    client_email: "",
    client_whatsapp: "",
    client_phone: "",
    client_address: "",
    client_city: "",
    client_notes: "",
};

export default function Navbar() {

    const navigate = useNavigate()

    // ---------------- STATES ----------------
    const [scrolled, setScrolled] = useState(false); // navbar transparent se solid
    const [collectionOpen, setCollectionOpen] = useState(false); // dropdown
    const [cartOpen, setCartOpen] = useState(false); // cart modal
    const [mobileOpen, setMobileOpen] = useState(false); // mobile slide-in menu
    const [CATEGORIES, setCATEGORIES] = useState([]); // backend se categories

    const [cart, setCart] = useState([]); // localStorage se cart

    const [orderOpen, setOrderOpen] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const collectionRef = useRef(null);

    // ---------------- LOAD CART FROM LOCALSTORAGE ----------------
    // useEffect(() => {
    //     const getCart = () => {
    //         const stored = JSON.parse(localStorage.getItem("cart")) || [];
    //         // console.log("data", stored)
    //         return stored;

    //     };
    //     setCart(getCart());

    // }, []);

    // ---------------- LOAD CART FROM LOCALSTORAGE ----------------
    useEffect(() => {
        const getCart = () => {
            const stored = JSON.parse(localStorage.getItem("cart")) || [];
            return stored;
        };

        setCart(getCart());

        // Naya add kiya — jab bhi kahin se "cartUpdated" event fire ho,
        // dobara localStorage se latest cart utha lo
        const handleCartUpdate = () => setCart(getCart());
        window.addEventListener("cartUpdated", handleCartUpdate);
        return () => window.removeEventListener("cartUpdated", handleCartUpdate);

    }, []);

    // ---------------- FETCH CATEGORIES FROM BACKEND ----------------
    useEffect(() => {
        const readCategory = async () => {
            try {
                const res = await axios.get(`${server}category_read`);
                setCATEGORIES(res.data.data);
            } catch (error) {
                console.log(error);
            }
        };

        readCategory();
    }, []);

    // ---------------- SCROLL LISTENER ----------------
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // ---------------- CLICK OUTSIDE (collection dropdown) ----------------
    useEffect(() => {
        const onClickOutside = (e) => {
            if (collectionRef.current && !collectionRef.current.contains(e.target)) {
                setCollectionOpen(false);
            }
        };
        document.addEventListener("mousedown", onClickOutside);
        return () => document.removeEventListener("mousedown", onClickOutside);
    }, []);

    // ---------------- CART HELPERS ----------------
    const handleRemoveFromCart = (product_id, model) => {
        const stored = JSON.parse(localStorage.getItem("cart")) || [];
        const updated = stored.filter(
            (item) => !(item.product_id === product_id && item.model === model)
        );
        localStorage.setItem("cart", JSON.stringify(updated));
        setCart(updated);
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem("cart");
    };

    // ---------------- CART TOTALS ----------------
    const subtotal = cart.reduce((sum, item) => sum + (item.product_price || 0), 0);
    const totalAmount = cart.length > 0 ? subtotal + DELIVERY_CHARGE : 0;

    // ---------------- ORDER FORM HANDLERS ----------------
    const handleFormChange = (e) => {
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    };

    const handleOrderSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setSubmitError("");

        // Read straight from localStorage so the order always reflects the latest saved cart.
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];

        const storedSubtotal = storedCart.reduce((sum, item) => sum + (item.product_price || 0), 0);
        const storedTotal = storedCart.length > 0 ? storedSubtotal + DELIVERY_CHARGE : 0;

        const payload = {
            ...form,
            products: storedCart.map((item) => ({
                product_id: item.product_id,
                product_type: item.model,
                product_name: item.product_name,
                product_img: item.product_img,
                product_category: item.product_category?.category_name,
                product_price: item.product_price,
                quantity: 1,
                total_price: item.product_price,
            })),
            subtotal: storedSubtotal,
            delivery_charges: DELIVERY_CHARGE,
            total_amount: storedTotal,
        };

        try {
            await axios.post(`${server}order_create`, payload);
            setSubmitSuccess(true);
            setForm(EMPTY_FORM);
            clearCart();
        } catch (error) {
            console.log(error);
            setSubmitError(error.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const closeEverything = () => {
        setOrderOpen(false);
        setCartOpen(false);
        setSubmitSuccess(false);
        setSubmitError("");
    };

    return (
        <>
            <nav className={`avy-nav ${scrolled ? "avy-nav--solid" : ""}`}>
                <div className="avy-nav__inner">
                    <a href="/" className="avy-logo">
                        <img src="/accets/img/logo_2.png" alt="AVYRON" className="avy-logo__img" />
                    </a>

                    {/* Desktop links */}
                    <div className="avy-links">
                        <a href="/" className="avy-link">
                            Home
                        </a>

                        <div className="avy-collection" ref={collectionRef}>
                            <button
                                className="avy-link avy-link--btn"
                                onClick={() => setCollectionOpen((v) => !v)}
                                aria-expanded={collectionOpen}
                            >
                                Collection
                                <ChevronIcon open={collectionOpen} />
                            </button>

                            {collectionOpen && (
                                <div className="avy-dropdown">
                                    {CATEGORIES.map((cat) => (
                                        <a
                                            key={cat._id}
                                            href={`/category_product/${cat.category_name.toLowerCase()}`}
                                            className="avy-dropdown__item"
                                            onClick={() => setCollectionOpen(false)}
                                        >
                                            {cat.category_name}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* <a href="/contact" className="avy-link">
                            Contact
                        </a> */}
                    </div>

                    {/* Right side: cart + hamburger
                    <div className="avy-actions">
                        <button className="avy-cart-btn" onClick={() => setCartOpen(true)} aria-label="Open cart">
                            <CartIcon />
                            {cart.length > 0 && <span className="avy-cart-badge">{cart.length}</span>}
                        </button>

                        <button className="avy-burger" onClick={() => setMobileOpen(true)} aria-label="Open menu">
                            <span />
                            <span />
                            <span />
                        </button>
                    </div> */}
                    {/* Right side: cart + hamburger */}
                    <div className="avy-actions">
                        <button className="avy-cart-btn" onClick={() => navigate("/Cart_Page")} aria-label="Open cart">
                            <CartIcon />
                            {cart.length > 0 && <span className="avy-cart-badge">{cart.length}</span>}
                        </button>

                        <button className="avy-burger" onClick={() => setMobileOpen(true)} aria-label="Open menu">
                            <span />
                            <span />
                            <span />
                        </button>
                    </div>
                </div>
            </nav>

            {/* ---------------- MOBILE SLIDE-IN MENU ---------------- */}
            {mobileOpen && (
                <div className="avy-mobile avy-mobile--open">
                    <div className="avy-mobile__header">
                        <span className="avy-logo">
                            <img src="/accets/img/logo_3.png" alt="AVYRON" className="avy-logo__img" />
                        </span>
                        <button className="avy-icon-btn" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                            <CloseIcon />
                        </button>
                    </div>

                    <a href="/" className="avy-mobile__link" onClick={() => setMobileOpen(false)}>
                        Home
                    </a>

                    <div className="avy-mobile__group">
                        <span className="avy-mobile__label">Collection</span>
                        {CATEGORIES.map((cat) => (
                            <a
                                key={cat._id}
                                href={`/collection/${cat.category_name.toLowerCase()}`}
                                className="avy-mobile__sublink"
                                onClick={() => setMobileOpen(false)}
                            >
                                {cat.category_name}
                            </a>
                        ))}
                    </div>

                    {/* <a href="/contact" className="avy-mobile__link" onClick={() => setMobileOpen(false)}>
                        Contact
                    </a> */}
                </div>
            )}

            {mobileOpen && <div className="avy-overlay" onClick={() => setMobileOpen(false)} />}

            {/* ---------------- CART MODAL ---------------- */}
            {cartOpen && !orderOpen && (
                <div className="avy-overlay avy-overlay--top" onClick={() => setCartOpen(false)}>
                    <div className="avy-cart-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="avy-cart-modal__header">
                            <span>Your Cart</span>
                            <button className="avy-icon-btn" onClick={() => setCartOpen(false)} aria-label="Close cart">
                                <CloseIcon />
                            </button>
                        </div>

                        {cart.length === 0 ? (
                            <div className="avy-cart-empty">
                                <p>Your cart is empty.</p>
                                <a href="/" className="avy-cart-empty__cta" onClick={() => setCartOpen(false)}>
                                    Browse the collection
                                </a>
                            </div>
                        ) : (
                            <>
                                <div className="avy-cart-list">
                                    {cart.map((item, index) => (
                                        <div key={`${item.product_id}-${index}`} className="avy-cart-row">
                                            <img
                                                src={item.product_img || item.image}
                                                alt={item.product_name || item.name}
                                                className="avy-cart-row__img"
                                            />
                                            <div className="avy-cart-row__info">
                                                <span className="avy-cart-row__name">
                                                    {item.product_name || item.name || "Unnamed item"}
                                                </span>
                                                <span className="avy-cart-row__type">{item.model}</span>
                                            </div>
                                            <div className="avy-cart-row__side">
                                                <span className="avy-cart-row__price">
                                                    Rs. {item.product_price ?? item.price}
                                                </span>
                                                <button
                                                    className="avy-cart-row__remove"
                                                    onClick={() => handleRemoveFromCart(item.product_id, item.model)}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="avy-cart-summary">
                                    <div className="avy-cart-summary__row">
                                        <span>Subtotal</span>
                                        <span>Rs. {subtotal}</span>
                                    </div>
                                    <div className="avy-cart-summary__row">
                                        <span>Delivery Charges</span>
                                        <span>Rs. {DELIVERY_CHARGE}</span>
                                    </div>
                                    <div className="avy-cart-summary__row avy-cart-summary__row--total">
                                        <span>Total</span>
                                        <span>Rs. {totalAmount}</span>
                                    </div>

                                    <button className="avy-order-btn" onClick={() => setOrderOpen(true)}>
                                        Order Now
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* ---------------- ORDER FORM MODAL ---------------- */}
            {orderOpen && (
                <div className="avy-overlay avy-overlay--top" onClick={closeEverything}>
                    <div className="avy-order-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="avy-cart-modal__header">
                            <span>{submitSuccess ? "Order Placed" : "Checkout Details"}</span>
                            <button className="avy-icon-btn" onClick={closeEverything} aria-label="Close">
                                <CloseIcon />
                            </button>
                        </div>

                        {submitSuccess ? (
                            <div className="avy-cart-empty">
                                <p>Thanks! Your order has been placed. We'll reach out to confirm shortly.</p>
                                <button className="avy-cart-empty__cta" onClick={closeEverything}>
                                    Continue shopping
                                </button>
                            </div>
                        ) : (
                            <form className="avy-order-form" onSubmit={handleOrderSubmit}>
                                <label className="avy-order-form__label">
                                    Name
                                    <input
                                        name="client_name"
                                        value={form.client_name}
                                        onChange={handleFormChange}
                                        required
                                        className="avy-order-form__input"
                                    />
                                </label>
                                <label className="avy-order-form__label">
                                    Email
                                    <input
                                        type="email"
                                        name="client_email"
                                        value={form.client_email}
                                        onChange={handleFormChange}
                                        required
                                        className="avy-order-form__input"
                                    />
                                </label>
                                <label className="avy-order-form__label">
                                    WhatsApp Number
                                    <input
                                        name="client_whatsapp"
                                        value={form.client_whatsapp}
                                        onChange={handleFormChange}
                                        required
                                        className="avy-order-form__input"
                                    />
                                </label>
                                <label className="avy-order-form__label">
                                    Phone
                                    <input
                                        name="client_phone"
                                        value={form.client_phone}
                                        onChange={handleFormChange}
                                        required
                                        className="avy-order-form__input"
                                    />
                                </label>
                                <label className="avy-order-form__label">
                                    Address
                                    <input
                                        name="client_address"
                                        value={form.client_address}
                                        onChange={handleFormChange}
                                        required
                                        className="avy-order-form__input"
                                    />
                                </label>
                                <label className="avy-order-form__label">
                                    City
                                    <input
                                        name="client_city"
                                        value={form.client_city}
                                        onChange={handleFormChange}
                                        required
                                        className="avy-order-form__input"
                                    />
                                </label>
                                <label className="avy-order-form__label">
                                    Notes (optional)
                                    <textarea
                                        name="client_notes"
                                        value={form.client_notes}
                                        onChange={handleFormChange}
                                        rows={3}
                                        className="avy-order-form__input avy-order-form__textarea"
                                    />
                                </label>

                                {submitError && <p className="avy-order-form__error">{submitError}</p>}

                                <button type="submit" className="avy-order-btn" disabled={submitting}>
                                    {submitting ? "Placing Order..." : "Place Order"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
