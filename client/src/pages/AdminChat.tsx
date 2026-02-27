import { useAuth } from "@/hooks/use-auth";
import { useMessages, useSendMessage } from "@/hooks/use-messages";
import { Redirect } from "wouter";
import { useState, useMemo, useRef, useEffect } from "react";
import { Store, UserCircle, Send, ArrowLeft, Search, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default function AdminChat() {
  const { user, isLoading: authLoading } = useAuth();
  const { data: messages = [], isLoading: msgsLoading } = useMessages();
  const { mutate: sendMessage, isPending } = useSendMessage();
  
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [content, setContent] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Group messages by user (assuming shop admin is receiverId = null or their own ID)
  const conversations = useMemo(() => {
    if (!user) return new Map();
    const map = new Map<number, typeof messages>();
    
    messages.forEach(m => {
      // Find the "other" person in the conversation
      const otherId = m.senderId === user.id ? m.receiverId : m.senderId;
      if (otherId === null) return; // Shouldn't happen unless admin messages general inbox
      
      if (!map.has(otherId)) {
        map.set(otherId, []);
      }
      map.get(otherId)!.push(m);
    });
    
    return map;
  }, [messages, user]);

  const conversationList = Array.from(conversations.entries()).map(([userId, msgs]) => {
    const lastMsg = msgs[msgs.length - 1];
    return { userId, lastMsg, count: msgs.length };
  }).sort((a, b) => new Date(b.lastMsg.createdAt).getTime() - new Date(a.lastMsg.createdAt).getTime());

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [selectedUserId, messages]);

  if (authLoading) return <div className="p-8 text-center">Loading...</div>;
  
  // Protect route
  if (!user || !user.isAdmin) {
    return <Redirect to="/" />;
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !selectedUserId) return;
    
    sendMessage({ content, receiverId: selectedUserId }, {
      onSuccess: () => setContent("")
    });
  };

  const selectedMsgs = selectedUserId ? conversations.get(selectedUserId) || [] : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-80px)]">
      <div className="bg-card rounded-2xl shadow-xl border border-border h-full flex overflow-hidden">
        
        {/* Left Sidebar - Conversation List */}
        <div className={`w-full md:w-80 border-r border-border flex flex-col ${selectedUserId ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-border bg-muted/30">
            <h2 className="text-xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
              <Store className="text-primary w-6 h-6" />
              Quản lý tin nhắn
            </h2>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Tìm kiếm khách hàng..." className="pl-9 bg-white rounded-full border-transparent focus-visible:ring-primary/20 shadow-sm" />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            {msgsLoading ? (
              <div className="p-4 text-center text-sm text-muted-foreground">Đang tải...</div>
            ) : conversationList.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
                <MessageSquare className="w-12 h-12 mb-2 opacity-20" />
                <p>Chưa có cuộc hội thoại nào.</p>
              </div>
            ) : (
              conversationList.map(({ userId, lastMsg, count }) => (
                <div 
                  key={userId}
                  onClick={() => setSelectedUserId(userId)}
                  className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all mb-1 ${selectedUserId === userId ? 'bg-primary/10 border-primary/20' : 'hover:bg-muted border-transparent'} border`}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center shrink-0 shadow-inner">
                    <UserCircle className="w-7 h-7 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h4 className="font-semibold text-sm truncate text-foreground">Khách hàng #{userId}</h4>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                        {format(new Date(lastMsg.createdAt), "HH:mm")}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {lastMsg.senderId === user.id ? 'Bạn: ' : ''}{lastMsg.content}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Area - Chat Window */}
        <div className={`flex-1 flex flex-col bg-[#f8f9fa] ${!selectedUserId ? 'hidden md:flex' : 'flex'}`}>
          {!selectedUserId ? (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                <Store className="w-12 h-12 text-primary/40" />
              </div>
              <h3 className="text-xl font-display font-medium text-foreground">Xin chào Admin!</h3>
              <p className="text-sm mt-2 max-w-xs text-center">Chọn một cuộc hội thoại bên trái để bắt đầu trả lời khách hàng.</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="px-6 py-4 bg-white border-b border-border shadow-sm z-10 flex items-center gap-4">
                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSelectedUserId(null)}>
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shrink-0">
                  <UserCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Khách hàng #{selectedUserId}</h3>
                  <p className="text-xs text-green-500 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>
                    Online
                  </p>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
                {selectedMsgs.map((msg, i) => {
                  const isAdmin = msg.senderId === user.id;
                  const showTime = i === 0 || new Date(msg.createdAt).getTime() - new Date(selectedMsgs[i-1].createdAt).getTime() > 5 * 60 * 1000;
                  
                  return (
                    <div key={msg.id} className="flex flex-col">
                      {showTime && (
                        <div className="text-center mb-4">
                          <span className="text-[10px] bg-black/5 text-muted-foreground px-3 py-1 rounded-full font-medium inline-flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {format(new Date(msg.createdAt), "dd/MM HH:mm")}
                          </span>
                        </div>
                      )}
                      <div className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                        {!isAdmin && (
                          <div className="w-8 h-8 rounded-full bg-gray-200 mr-2 shrink-0 flex items-center justify-center mt-1">
                            <UserCircle className="w-5 h-5 text-gray-500" />
                          </div>
                        )}
                        <div className={`max-w-[70%] rounded-2xl px-5 py-3 text-sm shadow-sm ${
                          isAdmin 
                            ? 'bg-gradient-to-br from-primary to-[#ff6633] text-white rounded-tr-sm' 
                            : 'bg-white border border-border text-foreground rounded-tl-sm'
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-white border-t border-border">
                <form onSubmit={handleSend} className="flex items-center gap-3">
                  <Input 
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Nhập tin nhắn trả lời..."
                    className="flex-1 rounded-full bg-muted/50 border-transparent focus-visible:ring-primary/30 h-12 px-6"
                  />
                  <Button 
                    type="submit" 
                    disabled={!content.trim() || isPending}
                    className="rounded-full w-12 h-12 bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20 shrink-0"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Ensure MessageSquare is imported for empty state
import { MessageSquare } from "lucide-react";
