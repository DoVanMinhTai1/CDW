import React from "react";
import Header from "../header_footer/header";
import Footer from "../header_footer/footer";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

const CollectionPage = () => {
    return (
        <div className="w-full bg-[#f6f4f2] text-[#4b1d1d] font-[Inter,sans-serif]">
            <Header />

            {/* HERO */}
            <section className="text-center px-5 pt-[90px] pb-[70px]">
                <h1 className="text-[88px] font-semibold font-['Times_New_Roman',serif] text-[#4f0f0f] mb-[26px]">
                    Collection
                </h1>
                <p className="max-w-[760px] mx-auto leading-[1.8] text-[20px] text-[#7c6f6f]">
                    Discover exceptional jewelry crafted with timeless elegance and contemporary sophistication.
                </p>
            </section>

            {/* TOP BAR */}
            <div className="px-[72px] mb-[42px] flex items-center justify-between">
                <span className="text-[13px] text-[#7a6f6f]">
                    Showing 24 products
                </span>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 border-none bg-transparent text-[#4f0f0f] font-semibold cursor-pointer">
                        Sort By
                        <ChevronDown size={16} />
                    </button>
                </div>
            </div>

            {/* CONTENT */}
            <div className="flex gap-[52px] px-[72px] max-[1024px]:flex-col">

                {/* SIDEBAR */}
                <aside className="w-[260px] max-[1024px]:w-full">

                    {/* CATEGORY */}
                    <div className="mb-[46px]">
                        <h4 className="text-[14px] mb-[26px] text-[#4f0f0f]">
                            Categories
                        </h4>

                        <label className="flex items-center gap-3 mb-[18px] text-[15px] text-[#4f0f0f]">
                            <input type="checkbox" checked readOnly />
                            Rings
                        </label>

                        <label className="flex items-center gap-3 mb-[18px] text-[15px] text-[#7b6f6f]">
                            <input type="checkbox" />
                            Necklaces
                        </label>

                        <label className="flex items-center gap-3 mb-[18px] text-[15px] text-[#7b6f6f]">
                            <input type="checkbox" />
                            Earrings
                        </label>

                        <label className="flex items-center gap-3 mb-[18px] text-[15px] text-[#7b6f6f]">
                            <input type="checkbox" />
                            Bracelets
                        </label>
                    </div>

                    {/* PRICE */}
                    <div className="mb-[46px]">
                        <h4 className="text-[14px] mb-[26px] text-[#4f0f0f]">
                            Price
                        </h4>

                        <div className="w-full h-[2px] bg-[#ddd3d3] mb-[18px]" />

                        <div className="flex justify-between text-[13px] text-[#7d7171]">
                            <span>$500</span>
                            <span>$10,000</span>
                        </div>
                    </div>

                    {/* MATERIAL */}
                    <div className="mb-[46px]">
                        <h4 className="text-[14px] mb-[26px] text-[#4f0f0f]">
                            Material
                        </h4>

                        <label className="flex items-center gap-3 mb-[18px] text-[15px] text-[#7b6f6f]">
                            <span className="w-[14px] h-[14px] rounded-full bg-[#d7a93f]" />
                            Gold
                        </label>

                        <label className="flex items-center gap-3 mb-[18px] text-[15px] text-[#7b6f6f]">
                            <span className="w-[14px] h-[14px] rounded-full bg-[#dadada]" />
                            Platinum
                        </label>

                        <label className="flex items-center gap-3 mb-[18px] text-[15px] text-[#7b6f6f]">
                            <span className="w-[14px] h-[14px] rounded-full bg-[#c47d8a]" />
                            Rose Gold
                        </label>
                    </div>

                    <button className="w-full h-[52px] border border-[#6d2d2d] bg-transparent text-[#6d2d2d] font-semibold cursor-pointer hover:bg-[#6d2d2d] hover:text-white transition-all duration-300">
                        Reset Filters
                    </button>
                </aside>

                {/* PRODUCTS */}
                <section className="flex-1 grid grid-cols-3 gap-y-[62px] gap-x-[28px] max-[1200px]:grid-cols-2 max-[768px]:grid-cols-1">

                    {[1,2,3,4,5,6,7,8,9].map((item) => (
                        <article key={item} className="group cursor-pointer">
                            <img
                                src={`https://picsum.photos/500/600?random=${item}`}
                                alt=""
                                className="w-full h-[390px] object-cover mb-5 transition-transform duration-500 group-hover:scale-[1.02]"
                            />

                            <span className="block text-center text-[12px] text-[#9b8c8c] mb-[14px] tracking-[1px] uppercase">
                                High Jewelry
                            </span>

                            <h3 className="text-center text-[30px] leading-[1.2] font-medium font-['Times_New_Roman',serif] mb-3 text-[#4f0f0f]">
                                Diamond Ring
                            </h3>

                            <p className="text-center text-[18px] text-[#8a7b7b]">
                                $4,950
                            </p>
                        </article>
                    ))}
                </section>
            </div>

            {/* PAGINATION */}
            <div className="py-[120px] flex items-center justify-center gap-[48px]">
                <button className="border-none bg-transparent text-[#7d6d6d] flex items-center gap-2 cursor-pointer hover:text-[#4f0f0f]">
                    <ChevronLeft size={16} />
                    Previous
                </button>

                <div className="flex gap-[22px]">
                    <span className="text-[#4f0f0f] border-b border-[#4f0f0f]">
                        1
                    </span>
                    <span className="text-[#7b6f6f]">2</span>
                    <span className="text-[#7b6f6f]">3</span>
                    <span className="text-[#7b6f6f]">4</span>
                </div>

                <button className="border-none bg-transparent text-[#7d6d6d] flex items-center gap-2 cursor-pointer hover:text-[#4f0f0f]">
                    Next
                    <ChevronRight size={16} />
                </button>
            </div>

            <Footer />
        </div>
    );
};

export default CollectionPage;