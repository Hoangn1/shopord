import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateProduct } from "@/hooks/use-products";

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProductForm({ isOpen, onClose }: ProductFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [externalLink, setExternalLink] = useState("");
  
  const { mutate: createProduct, isPending } = useCreateProduct();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProduct(
      {
        name,
        description,
        price: parseInt(price, 10),
        imageUrl: imageUrl || null,
        externalLink: externalLink || null,
      },
      {
        onSuccess: () => {
          onClose();
          setName("");
          setDescription("");
          setPrice("");
          setImageUrl("");
          setExternalLink("");
        }
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-xl border border-border shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-display font-bold">Thêm Sản Phẩm Mới (Admin)</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên sản phẩm *</Label>
            <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price">Giá (VND) *</Label>
            <Input id="price" type="number" min="0" value={price} onChange={e => setPrice(e.target.value)} required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả *</Label>
            <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} required rows={3} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Link Ảnh (URL)</Label>
            <Input id="imageUrl" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="externalLink">Link Taobao/Shopee (Tùy chọn)</Label>
            <Input id="externalLink" value={externalLink} onChange={e => setExternalLink(e.target.value)} placeholder="https://..." />
          </div>
          
          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>Hủy</Button>
            <Button type="submit" disabled={isPending} className="bg-primary hover:bg-primary/90 text-white">
              {isPending ? "Đang thêm..." : "Thêm Sản Phẩm"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
