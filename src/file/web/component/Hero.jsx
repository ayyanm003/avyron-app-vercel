import React, { useEffect, useState } from "react";
import "./style/Hero_style.css";

// Har image ka apna tagline — slider ke saath sync hoga
const heroSlides = [
    { src: "/accets/img/hero (1).png", tagline: "Luxury That Speaks Without Words" },
    { src: "/accets/img/hero2.png", tagline: "Not just a fragrance an identity" },
    { src: "/accets/img/hero3.png", tagline: "Your Signature Starts Here." },
];

const Hero = () => {
    // ---------------- STATE ----------------
    const [currentImage, setCurrentImage] = useState(0); // konsi image abhi show ho rahi hai

    // ---------------- AUTO SLIDER (har 3 second mein image change) ----------------
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % heroSlides.length);
        }, 3000);

        return () => clearInterval(interval); // cleanup jab component unmount ho
    }, []);

    // ---------------- JSX ----------------
    return (
        <div className="hero">
            {/* Sirf CURRENT image DOM mein hai — baaki exist hi nahi karti, is liye overlap possible hi nahi */}
            <img
                key={currentImage}
                src={heroSlides[currentImage].src}
                alt={`hero-${currentImage}`}
                className="hero-img"
            />

            {/* Dark overlay taake text saaf dikhe */}
            <div className="hero-overlay"></div>

            {/* Text content — image ke saath change hota hai */}
            <div className="hero-content">
                <p className="hero-tagline">{heroSlides[currentImage].tagline}</p>
            </div>

            {/* Slider dots */}
            <div className="hero-dots">
                {heroSlides.map((_, index) => (
                    <span
                        key={index}
                        className={`hero-dot ${index === currentImage ? "active" : ""}`}
                        onClick={() => setCurrentImage(index)}
                    ></span>
                ))}
            </div>
        </div>
    );
};

export default Hero;
