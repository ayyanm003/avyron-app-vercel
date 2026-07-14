import { useState } from "react";
import "./style/Contact_style.css";

// Swap these for your real contact details.
const CONTACT_EMAIL = "avyronfragrance@outlook.com";
const WHATSAPP_NUMBER = "+923170336168"; // country code + number, no + or spaces

export default function Contact() {
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: wire this up to your backend contact/order route.
        console.log("Contact form submitted:", form);
        setSubmitted(true);
        setForm({ name: "", email: "", message: "" });
    };

    return (
        <section className="contact-section">
            <div className="contact-section__inner">
                <div className="contact-info">
                    <span className="contact-eyebrow">Get in Touch</span>
                    <h2 className="contact-heading">Contact Us</h2>
                    <p className="contact-copy">
                        Questions about an order, sizing, or anything else  reach out and we'll get back to
                        you shortly.
                    </p>

                    <div className="contact-links">
                        <a href={`mailto:${CONTACT_EMAIL}`} className="contact-link">
                            <span className="contact-link__icon">✉</span>
                            {CONTACT_EMAIL}
                        </a>
                        <a
                            href={`https://wa.me/${WHATSAPP_NUMBER}`}
                            //    href="https://wa.me/923001234567"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="contact-link"
                        >
                            <span className="contact-link__icon">☎</span>
                            WhatsApp Us
                        </a>
                    </div>
                </div>

                <form className="contact-form" onSubmit={handleSubmit}>
                    <label className="contact-form__label">
                        Name
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="contact-form__input"
                        />
                    </label>

                    <label className="contact-form__label">
                        Email
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="contact-form__input"
                        />
                    </label>

                    <label className="contact-form__label">
                        Message
                        <textarea
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            required
                            rows={5}
                            className="contact-form__input contact-form__textarea"
                        />
                    </label>

                    <button type="submit" className="contact-form__submit">
                        Send Message
                    </button>

                    {submitted && <p className="contact-form__success">Thanks — we'll be in touch soon.</p>}
                </form>
            </div>
        </section>
    );
}
