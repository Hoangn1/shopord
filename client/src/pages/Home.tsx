import { useState, useEffect } from "react";
import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import { AuthModal } from "@/components/AuthModal";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronRight, Zap, Gift, Clock, ShieldCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: products, isLoading } = useProducts();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 4000 })]);

  const [timeLeft, setTimeLeft] = useState({ h: 2, m: 45, s: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 2; m = 59; s = 59; } // reset for demo
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Flashy banners using Unsplash images
  const banners = [
    // e-commerce sale banner shoes
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&h=400&fit=crop",
    // e-commerce sale banner electronics
    "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&h=400&fit=crop",
    // e-commerce sale fashion bags
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop"
  ];

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      {/* Banner Carousel */}
      <div className="bg-white pt-4 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4">
            {/* Main Carousel */}
            <div className="w-full lg:w-2/3 rounded-2xl overflow-hidden shadow-lg" ref={emblaRef}>
              <div className="flex h-[200px] sm:h-[300px] md:h-[400px]">
                {banners.map((src, i) => (
                  <div className="flex-[0_0_100%] min-w-0 relative" key={i}>
                    <img src={src} alt={`Promo ${i}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6 sm:p-8">
                      <div className="text-white">
                        <span className="px-3 py-1 bg-[#f53d2d] text-xs font-bold rounded-full mb-2 inline-block">HOT DEAL</span>
                        <h2 className="text-2xl sm:text-4xl font-display font-bold text-white mb-2 shadow-sm">Siêu Sale Cuối Tháng</h2>
                        <p className="opacity-90 max-w-md hidden sm:block">Mua hàng ngay để nhận nhiều ưu đãi chính hãng. Mua ngay kẻo lỡ!</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Side Banners (Hidden on small screens) */}
            <div className="hidden lg:flex w-1/3 flex-col gap-4">
              <div className="flex-1 rounded-2xl overflow-hidden relative group shadow-md cursor-pointer">
                {/* fashion side banner */}
                <img src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=200&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
              </div>
              <div className="flex-1 rounded-2xl overflow-hidden relative group shadow-md cursor-pointer">
                {/* electronics side banner */}
                <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=200&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
              </div>
            </div>
          </div>

          {/* Quick Links / Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            {[
              { icon: Zap, text: "Freeship Xtra", color: "text-[#f53d2d]", bg: "bg-[#f53d2d]/10" },
              { icon: ShieldCheck, text: "Hàng Chính Hãng", color: "text-blue-600", bg: "bg-blue-600/10" },
              { icon: Gift, text: "Ưu Đãi Hấp Dẫn", color: "text-amber-500", bg: "bg-amber-500/10" },
              { icon: Clock, text: "Trả Hàng 15 Ngày", color: "text-green-600", bg: "bg-green-600/10" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-center sm:justify-start gap-3 p-4 rounded-2xl border border-border/50 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.bg}`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <span className="font-medium text-sm sm:text-base">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Flash Sale Header */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-border/50 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[#f53d2d]">
              <h2 className="text-2xl font-display font-black italic tracking-widest uppercase">S Ả N &nbsp; P H Ẩ M &nbsp; M Ớ I</h2>
            </div>
          </div>
          
          <button className="text-[#f53d2d] font-semibold text-sm flex items-center hover:underline">
            Xem tất cả <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
          {isLoading ? (
            Array(10).fill(0).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="w-full aspect-square rounded-2xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full mt-2" />
              </div>
            ))
          ) : products && products.length > 0 ? (
            products.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onRequireAuth={() => setIsAuthOpen(true)} 
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-muted-foreground flex flex-col items-center justify-center">
              <Gift className="w-16 h-16 mb-4 text-border" />
              <p className="text-xl font-medium">Chưa có sản phẩm nào</p>
              <p className="text-sm mt-1">Admin hãy thêm sản phẩm để bắt đầu bán hàng nhé!</p>
            </div>
          )}
        </div>
      </div>
      
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
