import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertCircle, CheckCircle2 } from "lucide-react";
// @ts-ignore
import qrCode from "@assets/maqrnganhang_1772200819471.png";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
  price?: number;
}

export function CheckoutModal({ isOpen, onClose, productName, price }: CheckoutModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl overflow-hidden border-none shadow-2xl">
        <div className="bg-gradient-to-b from-primary/10 to-transparent p-6 text-center border-b border-border/50">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-display text-foreground">Thanh toán đơn hàng</DialogTitle>
          {productName && (
            <p className="mt-2 text-muted-foreground font-medium">{productName}</p>
          )}
          {price && (
            <p className="text-2xl font-bold text-primary mt-1">
              ₫{price.toLocaleString('vi-VN')}
            </p>
          )}
        </div>
        
        <div className="p-6 flex flex-col items-center">
          <div className="p-2 bg-white rounded-xl shadow-md border border-border inline-block mb-6">
            <img 
              src={qrCode} 
              alt="Mã QR Ngân Hàng" 
              className="w-48 h-48 object-contain rounded-lg"
              onError={(e) => {
                // Fallback placeholder if asset isn't found during dev
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1595054225574-8846399c5c24?w=400&h=400&fit=crop";
              }}
            />
          </div>
          
          <div className="bg-secondary/50 text-secondary-foreground p-4 rounded-xl flex gap-3 items-start w-full border border-primary/20">
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0 text-primary" />
            <p className="text-sm font-semibold">
              Hãy chụp bill của bạn và gửi cho sốp bên tiktok
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
