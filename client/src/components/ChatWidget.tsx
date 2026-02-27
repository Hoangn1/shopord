import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMessages, useSendMessage } from "@/hooks/use-messages";
import { useAuth } from "@/hooks/use-auth";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";

interface ChatWidgetProps {
  onRequireAuth: () => void;
}

export function ChatWidget({ onRequireAuth }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { user } = useAuth();
  const { data: messages = [] } = useMessages();
  const { mutate: sendMessage, isPending } = useSendMessage();

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  // Don't show widget for admin (they have a dedicated view)
  if (user?.isAdmin) return null;

  const handleOpen = () => {
    if (!user) {
      onRequireAuth();
      return;
    }
    setIsOpen(true);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;
    sendMessage({ content, receiverId: null }, {
      onSuccess: () => setContent("")
    });
  };

  // Only show my messages and messages sent TO me
  const myMessages = messages.filter(m => m.senderId === user?.id || m.receiverId === user?.id);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            ref={chatRef}
            className="bg-card w-80 sm:w-96 rounded-2xl shadow-2xl border border-border overflow-hidden mb-4 flex flex-col h-[500px] max-h-[80vh]"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-orange-500 p-4 text-white flex justify-between items-center shadow-md z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold font-display leading-tight">TikTok Shop</h3>
                  <p className="text-xs text-white/80 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>
                    Đang hoạt động
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full h-8 w-8" onClick={() => setIsOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-muted/30" ref={scrollRef}>
              {myMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-center space-y-3">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-sm">Hãy gửi tin nhắn đầu tiên để được hỗ trợ nhé!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myMessages.map((msg, i) => {
                    const isMine = msg.senderId === user?.id;
                    return (
                      <div key={msg.id || i} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                          isMine 
                            ? 'bg-primary text-white rounded-tr-sm shadow-md shadow-primary/20' 
                            : 'bg-white border border-border text-foreground rounded-tl-sm shadow-sm'
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-border flex items-center gap-2">
              <Input
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Nhắn tin cho shop..."
                className="flex-1 rounded-full bg-muted/50 border-transparent focus-visible:ring-primary/20 focus-visible:border-primary"
              />
              <Button type="submit" size="icon" disabled={!content.trim() || isPending} className="rounded-full bg-primary hover:bg-primary/90 shadow-md shadow-primary/20 shrink-0">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleOpen}
        className={`w-14 h-14 rounded-full bg-primary text-white shadow-lg shadow-primary/30 flex items-center justify-center transition-colors hover:bg-primary/90 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>
    </div>
  );
}
