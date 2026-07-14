import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./style/Tester_style.css";

const server = "http://localhost:2000/";

export default function Tester() {
    const [testers, setTesters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const trackRef = useRef(null);

    // useEffect(() => {
    //     const fetchTesters = async () => {
    //         try {
    //             const res = await axios.get(`${server}tester_read_client`);
    //             const list = Array.isArray(res.data) ? res.data : res.data.testers || [];
    //             setTesters(list);
    //         } catch (err) {
    //             console.log("tester_read_client error:", err);
    //             setError(true);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchTesters();
    // }, []);

    const addToCart = (data, model) => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];

        // Maximum 3 items
        if (cart.length >= 3) {
            alert("Maximum 3 items allowed.");
            return;
        }

        // Duplicate check
        // const exists = cart.find(
        //     (item) =>
        //         item.product_id === data._id &&
        //         item.model === model
        // );

        // if (exists) {
        //     alert("Already added.");
        //     return;
        // }

        cart.push({
            product_id: data._id,
            model: model, // Product | Tester

            product_img: data.img,
            product_name: data.name,
            product_category: data.category,
            product_price: data.price,
        });

        localStorage.setItem("cart", JSON.stringify(cart));

        alert("Added to cart");
    };

    useEffect(() => {
        const fetchTesters = async () => {
            try {
                const res = await axios.get(`${server}tester_read_client`);

                // console.log(res.data);

                setTesters(res.data.data);

            } catch (error) {
                console.log(error);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchTesters();
    }, []);

    const scroll = (direction) => {
        if (!trackRef.current) return;
        const amount = trackRef.current.clientWidth * 0.7;
        trackRef.current.scrollBy({
            left: direction === "left" ? -amount : amount,
            behavior: "smooth",
        });
    };

    return (
        <section className="tester-section">
            <div className="tester-section__inner">
                <div className="tester-section__header">
                    <span className="tester-eyebrow">Try Before You Buy</span>
                    <h2 className="tester-heading">Testers</h2>
                </div>

                <div className="tester-row">
                    <button
                        className="tester-arrow tester-arrow--left"
                        onClick={() => scroll("left")}
                        aria-label="Scroll left"
                    >
                        ‹
                    </button>

                    <div className="tester-track" ref={trackRef}>
                        {loading &&
                            Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="tester-card tester-card--skeleton" />
                            ))}

                        {!loading && error && (
                            <p className="tester-message">Couldn't load testers right now.</p>
                        )}

                        {!loading && !error && testers.length === 0 && (
                            <p className="tester-message">No testers available yet.</p>
                        )}

                        {!loading &&
                            !error &&
                            testers.map((t) => (
                                <Link key={t._id} to={`/tester/${t._id}`} className="tester-card">
                                    <div className="tester-card__img-wrap">
                                        <img src={t.img} alt={t.name} className="tester-card__img" />
                                    </div>

                                    <div className="tester-card__row">
                                        <span className="tester-card__title">{t.name}</span>
                                        <span className="tester-card__category">{t.category?.category_name}</span>
                                    </div>

                                    <div className="tester-card__row">
                                        <button
                                            className="tester-card__btn tester-card__btn--solid"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                // TODO: go straight to checkout with this tester
                                            }}
                                        >
                                            Buy Now
                                        </button>
                                        {/* <button
                                            className="tester-card__btn tester-card__btn--outline"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                // TODO: hook into your cart utility
                                            }}
                                        >
                                            Add to Cart
                                        </button> */}

                                        <button
                                            className="tester-card__btn tester-card__btn--outline"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();

                                                addToCart(t, "Tester");
                                            }}
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </Link>
                            ))}
                    </div>

                    <button
                        className="tester-arrow tester-arrow--right"
                        onClick={() => scroll("right")}
                        aria-label="Scroll right"
                    >
                        ›
                    </button>
                </div>
            </div>
        </section>
    );
}
