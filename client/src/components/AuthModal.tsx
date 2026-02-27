import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Separate components guarantee completely cleared state on unmount
function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoggingIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ username, password });
      onSuccess();
    } catch (err) {
      // Error handled by hook toast
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="login-username">Tên đăng nhập</Label>
        <Input 
          id="login-username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
          className="focus-visible:ring-primary"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="login-password">Mật khẩu</Label>
        <Input 
          id="login-password" 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          className="focus-visible:ring-primary"
        />
      </div>
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-11" disabled={isLoggingIn}>
        {isLoggingIn ? "Đang xử lý..." : "Đăng Nhập"}
      </Button>
    </form>
  );
}

function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { register, isRegistering } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ username, password });
      onSuccess();
    } catch (err) {
      // Error handled by hook toast
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="reg-username">Tên đăng nhập mới</Label>
        <Input 
          id="reg-username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
          className="focus-visible:ring-primary"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="reg-password">Mật khẩu</Label>
        <Input 
          id="reg-password" 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          className="focus-visible:ring-primary"
        />
      </div>
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-11" disabled={isRegistering}>
        {isRegistering ? "Đang xử lý..." : "Đăng Ký Tài Khoản"}
      </Button>
    </form>
  );
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden border-none shadow-2xl">
        <div className="bg-gradient-to-r from-primary to-orange-500 p-6 text-white text-center">
          <DialogTitle className="text-2xl font-display font-bold">TikTok Shop</DialogTitle>
          <p className="text-white/80 text-sm mt-1">Mua sắm thả ga, không lo về giá!</p>
        </div>
        
        <div className="p-6 bg-card">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted p-1 rounded-xl">
              <TabsTrigger value="login" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all">Đăng nhập</TabsTrigger>
              <TabsTrigger value="register" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all">Đăng ký</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              {activeTab === "login" && <LoginForm onSuccess={onClose} />}
            </TabsContent>
            <TabsContent value="register">
              {activeTab === "register" && <RegisterForm onSuccess={onClose} />}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
