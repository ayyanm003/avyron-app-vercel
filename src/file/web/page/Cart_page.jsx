import { useState, useEffect } from "react";
import axios from "axios";
import "./style/Cart_page_style.css";
import { useNavigate } from "react-router-dom";

const server = "http://localhost:2000/";
const DELIVERY_CHARGE = 200;

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

// Category kabhi string hoti hai (Product se), kabhi object (Tester se) —
// dono cases ko safely handle karo
const getCategoryLabel = (product_category) => {
    if (!product_category) return "";
    if (typeof product_category === "string") return product_category;
    return product_category.category_name || "";
};

export default function Cart_Page() {

    const navigate = useNavigate()

    const [cart, setCart] = useState([]);

    const [orderOpen, setOrderOpen] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // ---------------- LOAD CART FROM LOCALSTORAGE ----------------
    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(stored);
    }, []);

    // ---------------- CART HELPERS ----------------
    // Index se remove karte hain — product_id/model match se nahi,
    // taake duplicate ya missing id ki wajah se sab items galti se na hat jayein
    const handleRemoveFromCart = (index) => {
        const stored = JSON.parse(localStorage.getItem("cart")) || [];
        const updated = stored.filter((_, i) => i !== index);
        localStorage.setItem("cart", JSON.stringify(updated));
        setCart(updated);
        window.dispatchEvent(new Event("cartUpdated"));
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem("cart");
        window.dispatchEvent(new Event("cartUpdated"));
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
                product_category: getCategoryLabel(item.product_category),
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
            navigate("/")
            clearCart();
        } catch (error) {
            console.log(error);
            setSubmitError(error.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const closeOrderModal = () => {
        setOrderOpen(false);
        setSubmitSuccess(false);
        setSubmitError("");
    };

    return (
        <section className="cartpg">
            <div className="cartpg__inner">
                <h1 className="cartpg__heading">Your Cart</h1>

                {cart.length === 0 ? (
                    <div className="cartpg__empty">
                        <p>Your cart is empty.</p>
                        <a href="/" className="cartpg__empty-cta">
                            Browse the collection
                        </a>
                    </div>
                ) : (
                    <>
                        <div className="cartpg__list">
                            {cart.map((item, index) => (
                                <div key={`${item.product_id}-${index}`} className="cartpg__row">
                                    <img
                                        src={item.product_img}
                                        alt={item.product_name}
                                        className="cartpg__img"
                                    />

                                    <div className="cartpg__info">
                                        <span className="cartpg__name">{item.product_name}</span>
                                        <span className="cartpg__category">
                                            {getCategoryLabel(item.product_category)} · {item.model}
                                        </span>
                                    </div>

                                    <span className="cartpg__price">Rs. {item.product_price}</span>

                                    <button
                                        className="cartpg__remove"
                                        onClick={() => handleRemoveFromCart(index)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="cartpg__summary">
                            <div className="cartpg__summary-row">
                                <span>Subtotal</span>
                                <span>Rs. {subtotal}</span>
                            </div>
                            <div className="cartpg__summary-row">
                                <span>Delivery Charges</span>
                                <span>Rs. {DELIVERY_CHARGE}</span>
                            </div>
                            <div className="cartpg__summary-row cartpg__summary-row--total">
                                <span>Total</span>
                                <span>Rs. {totalAmount}</span>
                            </div>

                            <button className="cartpg__order-btn" onClick={() => setOrderOpen(true)}>
                                Order Now
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* ---------------- ORDER FORM MODAL ---------------- */}
            {orderOpen && (
                <div className="cartpg__overlay" onClick={closeOrderModal}>
                    <div className="cartpg__order-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="cartpg__order-modal-header">
                            <span>{submitSuccess ? "Order Placed" : "Checkout Details"}</span>
                            <button className="cartpg__icon-btn" onClick={closeOrderModal} aria-label="Close">
                                <CloseIcon />
                            </button>
                        </div>

                        {submitSuccess ? (
                            <div className="cartpg__empty">
                                <p>Thanks! Your order has been placed. We'll reach out to confirm shortly.</p>
                                <button className="cartpg__empty-cta" onClick={closeOrderModal}>
                                    Continue shopping
                                </button>
                            </div>
                        ) : (
                            <form className="cartpg__order-form" onSubmit={handleOrderSubmit}>
                                <label className="cartpg__order-label">
                                    Name
                                    <input
                                        name="client_name"
                                        value={form.client_name}
                                        onChange={handleFormChange}
                                        required
                                        className="cartpg__order-input"
                                    />
                                </label>
                                <label className="cartpg__order-label">
                                    Email
                                    <input
                                        type="email"
                                        name="client_email"
                                        value={form.client_email}
                                        onChange={handleFormChange}
                                        required
                                        className="cartpg__order-input"
                                    />
                                </label>
                                <label className="cartpg__order-label">
                                    WhatsApp Number
                                    <input
                                        name="client_whatsapp"
                                        value={form.client_whatsapp}
                                        onChange={handleFormChange}
                                        required
                                        className="cartpg__order-input"
                                    />
                                </label>
                                <label className="cartpg__order-label">
                                    Phone
                                    <input
                                        name="client_phone"
                                        value={form.client_phone}
                                        onChange={handleFormChange}
                                        required
                                        className="cartpg__order-input"
                                    />
                                </label>
                                <label className="cartpg__order-label">
                                    Address
                                    <input
                                        name="client_address"
                                        value={form.client_address}
                                        onChange={handleFormChange}
                                        required
                                        className="cartpg__order-input"
                                    />
                                </label>
                                <label className="cartpg__order-label">
                                    City
                                    <input
                                        name="client_city"
                                        value={form.client_city}
                                        onChange={handleFormChange}
                                        required
                                        className="cartpg__order-input"
                                    />
                                </label>
                                <label className="cartpg__order-label">
                                    Notes (optional)
                                    <textarea
                                        name="client_notes"
                                        value={form.client_notes}
                                        onChange={handleFormChange}
                                        rows={3}
                                        className="cartpg__order-input cartpg__order-textarea"
                                    />
                                </label>

                                {submitError && <p className="cartpg__order-error">{submitError}</p>}

                                <button type="submit" className="cartpg__order-btn" disabled={submitting}>
                                    {submitting ? "Placing Order..." : "Place Order"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}
