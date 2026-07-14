import "./style/About_style.css";

export default function About() {
    return (
        <section className="about-section">
            <div className="about-section__inner">
                <div className="about-text">
                    <span className="about-eyebrow">Our Story</span>
                    <h2 className="about-heading">Made for the quiet, confident ones</h2>
                    <p className="about-copy">
                        <strong>AVÝRON</strong> began with a simple idea: that everyday essentials deserve the same care as
                        occasion wear. Every piece is designed in muted, earthy tones and cut for movement,
                        meant to feel as good as it looks, season after season.
                    </p>
                    <p className="about-copy">
                        We work with a small number of mills and finishers we trust, keeping runs limited and
                        details deliberate. No noise, no excess. Just clothing built to be worn, not just
                        owned.
                    </p>
                </div>

                <div className="about-gallery">
                    <img
                        src="/accets/img/gallery.png"
                        alt="AVYRON Moon Knight and Aris perfume bottles"
                        className="about-gallery__img"
                    />
                </div>
            </div>
        </section>
    );
}
