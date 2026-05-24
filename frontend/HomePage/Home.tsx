import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

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
      <header className="home-page__header">
        <div className="home-page__header-inner">
          <Link to="/" className="home-page__logo">
            L&apos;éclat Heritage
          </Link>
          <nav className="home-page__nav" aria-label="Chính">
            <a href="#collections">Collections</a>
            <a href="#heritage">Our Story</a>
            <a href="#stores">Stores</a>
            <a href="#search">Search</a>
          </nav>
          <div className="home-page__header-actions">
            <button type="button" className="home-page__icon-btn" aria-label="Tìm kiếm">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3-3" strokeLinecap="round" />
              </svg>
            </button>
            <button type="button" className="home-page__icon-btn" aria-label="Giỏ hàng">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 7h15l-1.5 9h-12L6 7z" />
                <path d="M6 7L5 3H2" strokeLinecap="round" />
                <circle cx="9" cy="20" r="1" fill="currentColor" />
                <circle cx="18" cy="20" r="1" fill="currentColor" />
              </svg>
            </button>
            <Link to="/login" className="home-page__account">
              Đăng nhập
            </Link>
          </div>
        </div>
      </header>

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

      <footer id="stores" className="home-page__footer">
        <div className="home-page__footer-top">
          <div className="home-page__footer-brand">
            <span className="home-page__logo home-page__logo--footer">L&apos;éclat Heritage</span>
            <p>
              Chúng tôi tin vào vẻ đẹp bền vững — nơi mỗi chi tiết đều mang dấu ấn của thời gian
              và bàn tay con người.
            </p>
          </div>
          <div className="home-page__footer-columns">
            <div>
              <h3>Shop</h3>
              <ul>
                <li>
                  <a href="#new-arrivals">New arrivals</a>
                </li>
                <li>
                  <a href="#collections">Collections</a>
                </li>
                <li>
                  <a href="#heritage">High jewelry</a>
                </li>
              </ul>
            </div>
            <div>
              <h3>About</h3>
              <ul>
                <li>
                  <a href="#heritage">Our heritage</a>
                </li>
                <li>
                  <a href="#search">Craftsmanship</a>
                </li>
                <li>
                  <a href="#stores">Boutiques</a>
                </li>
              </ul>
            </div>
            <div>
              <h3>Support</h3>
              <ul>
                <li>
                  <Link to="/login">Account</Link>
                </li>
                <li>
                  <a href="#footer-newsletter">Contact</a>
                </li>
                <li>
                  <a href="#search">FAQ</a>
                </li>
              </ul>
            </div>
          </div>
          <div id="footer-newsletter" className="home-page__footer-newsletter">
            <h3>Join our world</h3>
            <form className="home-page__newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="newsletter-email" className="visually-hidden">
                Email
              </label>
              <input id="newsletter-email" type="email" placeholder="Your email" autoComplete="email" />
              <button type="submit" aria-label="Đăng ký">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </form>
          </div>
        </div>
        <div className="home-page__footer-bottom">
          <p>© {new Date().getFullYear()} L&apos;éclat Heritage. All rights reserved.</p>
          <div className="home-page__social">
            <a href="#search" aria-label="Instagram">
              <span aria-hidden>IG</span>
            </a>
            <a href="#search" aria-label="Facebook">
              <span aria-hidden>FB</span>
            </a>
            <a href="#search" aria-label="Pinterest">
              <span aria-hidden>Pi</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
