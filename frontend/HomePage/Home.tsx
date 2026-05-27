import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import Header from "../header_footer/header.tsx";
import Footer from "../header_footer/footer.tsx";
const img = {
  heroRing:
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80",
  solitaire:
    "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80",
  earrings:
    "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=700&q=80",
  sapphire:
    "https://unsplash.com/photos/a-pair-of-earrings-sitting-on-top-of-a-rock-uESNpqs3Fb4",
  curatedRings:
    "https://images.unsplash.com/photo-1611591437281-460bfbe1220c?auto=format&fit=crop&w=600&q=80",
  curatedNecklace:
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80",
  curatedBracelets:
    "https://images.unsplash.com/photo-1611652022419-a9419f77443f?auto=format&fit=crop&w=600&q=80",
  bts1:
    "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=500&q=80",
  bts2:
    "https://images.unsplash.com/photo-1573408301185-e914c0b76e2f?auto=format&fit=crop&w=500&q=80",
  bts3:
    "https://images.unsplash.com/photo-1589674781289-e41701c8b17a?auto=format&fit=crop&w=500&q=80",
  bts4:
    "https://images.unsplash.com/photo-1603561596112-0a132b757442?auto=format&fit=crop&w=500&q=80",
} as const;

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
        <Header />
      <section className="home-page__hero">
        <div className="home-page__hero-inner">
          <div className="home-page__hero-copy">
            <h1>A Legacy Carved in Light.</h1>
            <p>
              Mỗi viên đá quý là một chương trong câu chuyện của thời gian — được chọn lọc,
              chế tác và trao tay như một lời cam kết vĩnh cửu.
            </p>
            <a href="#new-arrivals" className="home-page__btn home-page__btn--primary">
              Discover the collection
            </a>
          </div>
          <div className="home-page__hero-visual" aria-hidden>
            <img src={img.heroRing} alt="" />
          </div>
        </div>
      </section>

      <section id="new-arrivals" className="home-page__section home-page__new-arrivals">
        <div className="home-page__section-head">
          <h2>New Arrivals</h2>
          <a href="#collections" className="home-page__text-link">
            View all
          </a>
        </div>
        <div className="home-page__new-grid">
          <article className="home-page__new-card home-page__new-card--large">
            <div className="home-page__new-card-media">
              <img src={img.solitaire} alt="Nhẫn kim cương Solitaire" />
            </div>
            <h3>The Solitaire Collection</h3>
          </article>
          <div className="home-page__new-stack">
            <article className="home-page__new-card home-page__new-card--small">
              <div className="home-page__new-card-media home-page__new-card-media--dark">
                <img src={img.earrings} alt="Bông tai Celestial Drops" />
              </div>
              <h3>Celestial Drops</h3>
            </article>
            <article className="home-page__new-card home-page__new-card--small">
              <div className="home-page__new-card-media">
                <img src={img.sapphire} alt="Dây chuyền sapphire Heritage" />
              </div>
              <h3>Heritage Sapphire</h3>
            </article>
          </div>
        </div>
      </section>

      <section id="heritage" className="home-page__heritage">
        <p className="home-page__heritage-label">Since 1924</p>
        <h2>Our Heritage</h2>
        <p className="home-page__heritage-text">
          Từ xưởng chế tác đầu tiên đến những cửa hàng trên khắp thế giới, chúng tôi giữ nguyên
          tinh thần thủ công — nơi ánh sáng gặp đá quý và trở thành di sản.
        </p>
        <a href="#collections" className="home-page__heritage-link">
          Read more
        </a>
      </section>

      <section id="collections" className="home-page__section home-page__curated">
        <header className="home-page__curated-head">
          <h2>Curated Collections</h2>
          <p>Những bộ sưu tập được chọn lọc cho khoảnh khắc đáng nhớ nhất.</p>
        </header>
        <div className="home-page__curated-grid">
          <figure>
            <img src={img.curatedRings} alt="Nhẫn trưng bày trên đế marble" />
            <figcaption>Rings</figcaption>
          </figure>
          <figure>
            <img src={img.curatedNecklace} alt="Dây chuyền kim cương" />
            <figcaption>Necklaces</figcaption>
          </figure>
          <figure>
            <img src={img.curatedBracelets} alt="Vòng tay vàng" />
            <figcaption>Bracelets</figcaption>
          </figure>
        </div>
      </section>

      <section className="home-page__section home-page__bts">
        <div className="home-page__section-head">
          <h2>Behind the Scenes</h2>
          <a href="#footer-newsletter" className="home-page__text-link">
            Follow us
          </a>
        </div>
        <div className="home-page__bts-row">
          <img src={img.bts1} alt="Khách hàng đeo trang sức" />
          <img src={img.bts2} alt="Nghệ nhân chế tác trang sức" />
          <img src={img.bts3} alt="Hộp trang sức và hoa" />
          <img src={img.bts4} alt="Ngọc lục bảo cận cảnh" />
        </div>
      </section>
        <Footer />

    </div>
  );
};

export default HomePage;
