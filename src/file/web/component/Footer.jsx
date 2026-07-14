import { Link } from "react-router-dom";
import "./style/Footer_style.css";

const CATEGORIES = ["Men", "Women", "Unisex"];

export default function Footer() {
    return (
        <footer className="avy-footer">
            <div className="avy-footer__inner">
                <div className="avy-footer__col avy-footer__col--brand">
                    {/* <span className="avy-footer__logo">AVYRON</span> */}

                    <p className="avy-footer__tagline"> <strong>AVÝRON </strong>
                        Everyday essentials, cut with quiet confidence.
                    </p>
                </div>

                <div className="avy-footer__col">
                    <span className="avy-footer__heading">Shop</span>
                    {/* <Link to="/" className="avy-footer__link">
                        Home
                    </Link> */}
                    {CATEGORIES.map((cat) => (
                        <Link key={cat} to={`/category_product/${cat.toLowerCase()}`} className="avy-footer__link">
                            {cat}
                        </Link>
                    ))}
                </div>

                <div className="avy-footer__col">
                    <span className="avy-footer__heading">Support</span>
                    <Link to="/contact" className="avy-footer__link">
                        Contact
                    </Link>
                    <a href="mailto:hello@avyron.com" className="avy-footer__link">
                        avyronfragrance@outlook.com
                    </a>
                </div>

                <div className="avy-footer__col">
                    <span className="avy-footer__heading">Follow</span>
                    <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="avy-footer__link"
                    >
                        Instagram
                    </a>
                    <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="avy-footer__link"
                    >
                        Facebook
                    </a>
                </div>
            </div>

            <div className="avy-footer__bottom">
                <span>© {new Date().getFullYear()} <strong>AVÝRON.</strong> All rights reserved.</span>
            </div>
        </footer>
    );
}
