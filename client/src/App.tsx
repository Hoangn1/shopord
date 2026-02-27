import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Navbar } from "@/components/Navbar";
import { ChatWidget } from "@/components/ChatWidget";
import { AuthModal } from "@/components/AuthModal";
import { useState } from "react";

// Pages
import Home from "./pages/Home";
import AdminChat from "./pages/AdminChat";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin/chat" component={AdminChat} />
      <Route component={NotFound} />
    </Switch>
  );
}

function Layout() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        <Router />
      </main>
      
      <ChatWidget onRequireAuth={() => setIsAuthOpen(true)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Layout />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
