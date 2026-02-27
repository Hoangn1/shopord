import { Link } from "wouter";
import { Search, ShoppingCart, User as UserIcon, LogOut, PlusCircle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { AuthModal } from "./AuthModal";
import { ProductForm } from "./ProductForm";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { user, logout } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-gradient-to-r from-[#f53d2d] to-[#ff6633] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
            
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center gap-2 group cursor-pointer">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center rotate-3 group-hover:-rotate-3 transition-transform shadow-inner">
                <ShoppingCart className="w-6 h-6 text-[#f53d2d]" />
              </div>
              <span className="text-2xl font-display font-black text-white tracking-tight hidden sm:block">
                TikTok Shop
              </span>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl px-2">
              <div className="relative group">
                <Input 
                  type="text" 
                  placeholder="Tìm kiếm sản phẩm, thương hiệu..." 
                  className="w-full pl-4 pr-12 py-2.5 sm:py-3 h-auto rounded-full border-none shadow-inner bg-white text-foreground focus-visible:ring-2 focus-visible:ring-white/50"
                />
                <Button size="icon" className="absolute right-1 top-1 bottom-1 h-auto rounded-full bg-[#f53d2d] hover:bg-[#d43224] text-white w-10 sm:w-12 transition-colors">
                  <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              {user?.isAdmin && (
                <>
                  <Link href="/admin/chat" className="text-white/90 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors relative">
                    <MessageSquare className="w-6 h-6" />
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-[#ff6633]"></span>
                  </Link>
                  <Button 
                    onClick={() => setIsProductFormOpen(true)}
                    className="bg-white/20 hover:bg-white/30 text-white border-none hidden sm:flex"
                  >
                    <PlusCircle className="w-4 h-4 mr-2" /> Thêm SP
                  </Button>
                </>
              )}
              
              {!user ? (
                <Button 
                  onClick={() => setIsAuthOpen(true)}
                  className="bg-white text-[#f53d2d] hover:bg-gray-100 font-bold rounded-full px-6"
                >
                  Đăng Nhập
                </Button>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-white hover:bg-white/10 rounded-full px-2 sm:px-4 flex items-center gap-2 h-10">
                      <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                        <UserIcon className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium hidden sm:inline-block max-w-[100px] truncate">
                        {user.username}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-xl p-2">
                    <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground border-b mb-1">
                      Tài khoản của tôi
                    </div>
                    {user.isAdmin && (
                      <DropdownMenuItem onClick={() => setIsProductFormOpen(true)} className="sm:hidden cursor-pointer">
                        <PlusCircle className="w-4 h-4 mr-2" /> Thêm SP
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => logout()} className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer rounded-lg mt-1">
                      <LogOut className="w-4 h-4 mr-2" /> Đăng xuất
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <ProductForm isOpen={isProductFormOpen} onClose={() => setIsProductFormOpen(false)} />
    </>
  );
}
