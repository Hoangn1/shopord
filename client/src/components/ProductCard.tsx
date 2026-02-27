import { useState } from "react";
import { type Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { CheckoutModal } from "./CheckoutModal";
import { useDeleteProduct } from "@/hooks/use-products";

interface ProductCardProps {
  product: Product;
  onRequireAuth: () => void;
}

export function ProductCard({ product, onRequireAuth }: ProductCardProps) {
  const { user } = useAuth();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const deleteProduct = useDeleteProduct();
  
  const fakeRating = (Math.random() * 1 + 4).toFixed(1); // 4.0 - 5.0

  const handleBuyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      onRequireAuth();
    } else {
      setIsCheckoutOpen(true);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      deleteProduct.mutate(product.id);
    }
  };

  return (
    <>
      <div className="group bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer">
        {/* Image Container */}
        <div className="aspect-square relative bg-muted overflow-hidden">
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-secondary/50 text-secondary-foreground">
              <ShoppingCart className="w-12 h-12 opacity-20" />
            </div>
          )}
          
          {user?.isAdmin && (
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
              onClick={handleDelete}
              disabled={deleteProduct.isPending}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Content Container */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-medium text-sm line-clamp-2 min-h-[40px] group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1 mb-2">
            {product.description}
          </p>
          
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center text-amber-400 text-xs font-medium">
              <Star className="w-3 h-3 fill-current mr-0.5" />
              {fakeRating}
            </div>
          </div>

          <div className="mt-auto pt-2 flex items-end justify-between border-t border-border/40">
            <div>
              <p className="text-[#f53d2d] font-display font-bold text-lg tracking-tight">
                <span className="text-sm underline decoration-1 underline-offset-2 mr-0.5">đ</span>
                {product.price.toLocaleString('vi-VN')}
              </p>
            </div>
          </div>
          
          <div className="mt-3 flex gap-2">
            <Button 
              onClick={handleBuyClick}
              className="flex-1 bg-gradient-to-r from-[#ff6633] to-[#f53d2d] hover:opacity-90 text-white shadow-md shadow-primary/20 transition-all font-semibold"
            >
              Mua Ngay
            </Button>
          </div>
        </div>
      </div>

      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        productName={product.name}
        price={product.price}
      />
    </>
  );
}
