import React from "react";
import Header from "../header_footer/header";
import Footer from "../header_footer/footer";
import { useNavigate } from "react-router-dom";
import { useApiRequest } from '../../hooks/useApiRequest';
import { bannerService } from './service/bannerService';
import { productService } from '../product/service/productService';
import { cartService } from '../cart/service/cartService';
import { useToast } from '../../hooks/useToast';

const img = {
  heroRing:
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80",
  solitaire:
    "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80",
  earrings:
    "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=700&q=80",
  sapphire:
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=700&q=80",
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

interface ProductCardProps {
  product: any;
  onAdd?: (id: string) => void;
}

function ProductCard({ product, onAdd }: ProductCardProps) {
  const navigate = useNavigate();
  const price = product.price
    ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)
    : '';
  const image = product.image || (product.thumbnailUrl ?? '');

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg bg-white border border-gray-100 p-3 transition-all duration-300 hover:shadow-lg hover:border-gray-200">
      {/* Media Container */}
      <div
        className="relative aspect-square overflow-hidden rounded bg-gray-50 cursor-pointer mb-4"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-neutral-100 flex items-center justify-center text-neutral-400 text-xs">
            No Image
          </div>
        )}
      </div>

      {/* Details Body */}
      <div className="flex flex-col flex-1 text-left">
        <h4
          className="font-normal text-[0.95rem] text-neutral-800 line-clamp-2 cursor-pointer hover:text-[#5c2434] transition-colors duration-200 min-h-[2.5rem]"
          onClick={() => navigate(`/product/${product.id}`)}
        >
          {product.name}
        </h4>

        <div className="mt-1 font-semibold text-neutral-900 text-base">
          {price}
        </div>

        <button
          className="mt-3 w-fit text-xs font-medium text-neutral-500 hover:text-[#5c2434] underline underline-offset-4 transition-all py-1"
          onClick={() => onAdd && onAdd(product.id)}
        >
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
}

const HomePage: React.FC = () => {
  const { showToast } = useToast();
  const { data: banners } = useApiRequest(() => bannerService.getBanners(), []);
  const { data: featured, loading: featuredLoading } = useApiRequest(() => productService.getFeaturedProducts(), []);

  const handleAddToCart = async (productId: string) => {
    try {
      await cartService.addToCart({ productId, quantity: 1 });
      showToast('Đã thêm vào giỏ', 'success');
    } catch (err: any) {
      showToast(err?.message || 'Thêm thất bại', 'error');
    }
  };

  return (
    <div className="text-[#1a1a1a] bg-white font-['DM_Sans',system-ui,sans-serif] antialiased">
      <Header />

      {/* HERO */}
      <section className="bg-gradient-to-br from-[#f3ece4] to-[#ebe3d9]">
        <div className="max-w-[1280px] mx-auto px-6 py-[clamp(3rem,8vw,5.5rem)] pb-[clamp(3rem,10vw,6rem)] grid gap-10 items-center min-[900px]:grid-cols-2 min-[900px]:gap-12">
          <div>
            <h1 className="font-['Playfair_Display',Georgia,serif] text-[clamp(2.25rem,5vw,3.5rem)] font-semibold leading-[1.12] tracking-[-0.02em] mb-5 text-[#2d1b18]">
              A Legacy Carved in Light.
            </h1>
            <p className="max-w-[28rem] text-[#5c5c5c] text-base leading-[1.65] mb-8">
              Mỗi viên đá quý là một chương trong câu chuyện của thời gian — được chọn lọc, chế tác và trao tay như một lời cam kết vĩnh cửu.
            </p>
            <a
              href="#new-arrivals"
              className="inline-flex items-center justify-center px-7 py-4 text-[0.72rem] font-semibold tracking-[0.16em] uppercase rounded-sm bg-[#5c2434] text-white transition-all duration-300 hover:bg-[#4a1d2b] hover:shadow-[0_8px_24px_rgba(92,36,52,0.25)] hover:-translate-y-[1px]"
            >
              Discover the collection
            </a>
          </div>

          <div className="rounded overflow-hidden shadow-[0_24px_60px_rgba(26,26,26,0.12)]">
            <img
              src={banners && banners.length ? banners[0].imageUrl : img.heroRing}
              alt="Hero Banner"
              className="block w-full aspect-[4/5] object-cover"
            />
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section id="featured" className="max-w-[1280px] mx-auto px-6 py-[clamp(3.5rem,8vw,5.5rem)]">
        <div className="flex items-baseline justify-between gap-4 mb-8">
          <h2 className="font-['Playfair_Display',Georgia,serif] text-[clamp(1.75rem,3vw,2.25rem)] font-semibold text-[#1a1a1a]">
            Featured Products
          </h2>
          <a
            href="#collections"
            className="text-[0.72rem] font-semibold tracking-[0.14em] uppercase border-b border-transparent hover:border-[#1a1a1a] hover:opacity-85 transition-all text-neutral-600"
          >
            View all
          </a>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredLoading && (
            <div className="flex justify-center items-center min-h-[200px] col-span-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5c2434]"></div>
            </div>
          )}

          {!featuredLoading && (!Array.isArray(featured) || featured.length === 0) && (
            <p className="text-center text-neutral-500 col-span-full py-10">Không có sản phẩm nổi bật</p>
          )}

          {!featuredLoading &&
            Array.isArray(featured) &&
            featured.map((p: any) => (
              <ProductCard
                key={p.id}
                product={p}
                onAdd={() => handleAddToCart(p.id)}
              />
            ))}
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section id="new-arrivals" className="max-w-[1280px] mx-auto px-6 py-[clamp(3.5rem,8vw,5.5rem)] border-t border-neutral-100">
        <div className="flex items-baseline justify-between gap-4 mb-8">
          <h2 className="font-['Playfair_Display',Georgia,serif] text-[clamp(1.75rem,3vw,2.25rem)] font-semibold">
            New Arrivals
          </h2>
          <a
            href="#collections"
            className="text-[0.72rem] font-semibold tracking-[0.14em] uppercase border-b border-transparent hover:border-[#1a1a1a] transition-all text-neutral-600"
          >
            View all
          </a>
        </div>

        <div className="grid gap-6 md:grid-cols-[1.2fr_1fr] md:items-stretch">
          <article className="group cursor-pointer">
            <div className="rounded overflow-hidden bg-[#f3ece4] aspect-[4/5] min-h-[280px]">
              <img
                src={img.solitaire}
                alt="Nhẫn kim cương Solitaire"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
            <h3 className="font-['Playfair_Display',Georgia,serif] text-[1.1rem] font-medium text-center mt-4 text-neutral-800 group-hover:text-[#5c2434]">
              The Solitaire Collection
            </h3>
          </article>

          <div className="flex flex-col gap-6">
            <article className="group cursor-pointer">
              <div className="rounded overflow-hidden aspect-[16/11] min-h-[200px]">
                <img
                  src={img.earrings}
                  alt="Bông tai Celestial Drops"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
              <h3 className="font-['Playfair_Display',Georgia,serif] text-[1.1rem] font-medium text-center mt-4 text-neutral-800 group-hover:text-[#5c2434]">
                Celestial Drops
              </h3>
            </article>

            <article className="group cursor-pointer">
              <div className="rounded overflow-hidden bg-[#f3ece4] aspect-[16/11] min-h-[200px]">
                <img
                  src={img.sapphire}
                  alt="Dây chuyền sapphire Heritage"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
              <h3 className="font-['Playfair_Display',Georgia,serif] text-[1.1rem] font-medium text-center mt-4 text-neutral-800 group-hover:text-[#5c2434]">
                Heritage Sapphire
              </h3>
            </article>
          </div>
        </div>
      </section>

      {/* HERITAGE */}
      <section id="heritage" className="bg-[#5c2434] text-white text-center px-6 py-[clamp(4rem,10vw,6rem)]" >
        <p className="mb-3 text-[0.68rem] font-semibold tracking-[0.2em] uppercase opacity-75">
          Since 1924
        </p>
        <h2 className="font-['Playfair_Display',Georgia,serif] text-[clamp(2rem,4vw,2.75rem)] font-semibold mb-5">
          Our Heritage
        </h2>
        <p className="max-w-[36rem] mx-auto mb-7 text-base leading-[1.75] opacity-90 font-light">
          Từ xưởng chế tác đầu tiên đến những cửa hàng trên khắp thế giới, chúng tôi giữ nguyên tinh thần thủ công — nơi ánh sáng gặp đá quý và trở thành di sản.
        </p>
        <a href="#collections" className="text-[0.72rem] font-semibold tracking-[0.16em] uppercase underline underline-offset-[0.35rem] hover:opacity-80 transition" >
          Read more
        </a>
      </section>

      {/* CURATED COLLECTIONS */}
      <section id="collections" className="max-w-[1280px] mx-auto px-6 py-[clamp(3.5rem,8vw,5.5rem)]">
        <header className="text-center max-w-[36rem] mx-auto mb-11">
          <h2 className="font-['Playfair_Display',Georgia,serif] text-[clamp(1.75rem,3vw,2.25rem)] font-semibold mb-3">
            Curated Collections
          </h2>
          <p className="text-[#5c5c5c] text-[0.95rem] leading-[1.6]">
            Những bộ sưu tập được chọn lọc cho khoảnh khắc đáng nhớ nhất.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          <figure className="m-0 group cursor-pointer">
            <div className="overflow-hidden rounded">
              <img
                src={img.curatedRings}
                alt="Rings"
                className="block w-full aspect-[3/4] object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <figcaption className="mt-3.5 text-center font-['Playfair_Display',Georgia,serif] text-base font-semibold text-neutral-800 group-hover:text-[#5c2434]">
              Rings
            </figcaption>
          </figure>

          <figure className="m-0 group cursor-pointer">
            <div className="overflow-hidden rounded">
              <img
                src={img.curatedNecklace}
                alt="Necklaces"
                className="block w-full aspect-[3/4] object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <figcaption className="mt-3.5 text-center font-['Playfair_Display',Georgia,serif] text-base font-semibold text-neutral-800 group-hover:text-[#5c2434]">
              Necklaces
            </figcaption>
          </figure>

          <figure className="m-0 group cursor-pointer">
            <div className="overflow-hidden rounded">
              <img
                src={img.curatedBracelets}
                alt="Bracelets"
                className="block w-full aspect-[3/4] object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <figcaption className="mt-3.5 text-center font-['Playfair_Display',Georgia,serif] text-base font-semibold text-neutral-800 group-hover:text-[#5c2434]">
              Bracelets
            </figcaption>
          </figure>
        </div>
      </section>

      {/* BEHIND THE SCENES */}
      <section className="max-w-[1280px] mx-auto px-6 py-[clamp(3.5rem,8vw,5.5rem)] border-t border-neutral-100">
        <div className="flex items-baseline justify-between gap-4 mb-8">
          <h2 className="font-['Playfair_Display',Georgia,serif] text-[clamp(1.75rem,3vw,2.25rem)] font-semibold">
            Behind the Scenes
          </h2>
          <a
            href="#footer-newsletter"
            className="text-[0.72rem] font-semibold tracking-[0.14em] uppercase border-b border-transparent hover:border-[#1a1a1a] hover:opacity-85 transition text-neutral-600"
          >
            Follow us
          </a>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          <img src={img.bts1} alt="BTS 1" className="w-full aspect-square object-cover rounded block hover:opacity-90 transition-opacity" />
          <img src={img.bts2} alt="BTS 2" className="w-full aspect-square object-cover rounded block hover:opacity-90 transition-opacity" />
          <img src={img.bts3} alt="BTS 3" className="w-full aspect-square object-cover rounded block hover:opacity-90 transition-opacity" />
          <img src={img.bts4} alt="BTS 4" className="w-full aspect-square object-cover rounded block hover:opacity-90 transition-opacity" />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;