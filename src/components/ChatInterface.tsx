"use client";

import { useState, useEffect, useRef } from "react";
import { Send, User as UserIcon, Loader2, ArrowLeft } from "lucide-react";
import { getChatRoomsAction, getMessagesAction, sendMessageAction, markMessagesReadAction } from "@/app/actions/chat";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function ChatInterface() {
  const { data: session } = useSession();
  const [rooms, setRooms] = useState<any[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Poll for rooms every 10 seconds
  useEffect(() => {
    fetchRooms();
    const interval = setInterval(fetchRooms, 10000);
    return () => clearInterval(interval);
  }, []);

  // Poll for messages every 3 seconds if active room
  useEffect(() => {
    if (activeRoomId) {
      fetchMessages(activeRoomId);
      const interval = setInterval(() => fetchMessages(activeRoomId, true), 3000);
      return () => clearInterval(interval);
    }
  }, [activeRoomId]);

  const fetchRooms = async () => {
    const res = await getChatRoomsAction();
    if (res.success) {
      setRooms(res.rooms);
    }
    setLoadingRooms(false);
  };

  const fetchMessages = async (roomId: string, background = false) => {
    if (!background) setLoadingMessages(true);
    const res = await getMessagesAction(roomId);
    if (res.success) {
      setMessages(res.messages);
      markMessagesReadAction(roomId);
      
      // Auto-scroll on new messages if not heavily scrolled up (simplified auto-scroll)
      setTimeout(scrollToBottom, 100);
    }
    if (!background) setLoadingMessages(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeRoomId) return;

    const content = newMessage.trim();
    setNewMessage(""); // Optimistic clear
    setSending(true);

    // Optimistic append
    const tempMsg = {
      id: "temp-" + Date.now(),
      content,
      senderId: session?.user?.id,
      createdAt: new Date(),
    };
    setMessages(prev => [...prev, tempMsg]);
    setTimeout(scrollToBottom, 10);

    const res = await sendMessageAction(activeRoomId, content);
    if (res.success) {
      // Background fetch will catch up anyway, but let's replace temp if needed
      fetchMessages(activeRoomId, true);
      fetchRooms(); // Update sidebar latest message
    }
    setSending(false);
  };

  const activeRoom = rooms.find(r => r.id === activeRoomId);
  const otherUser = activeRoom?.users?.find((u: any) => u.id !== session?.user?.id);

  if (loadingRooms) {
    return <div className="flex h-[600px] items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary-red" /></div>;
  }

  return (
    <div className="flex h-[calc(100vh-140px)] min-h-[600px] bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm">
      {/* Sidebar */}
      <div className={`w-full md:w-80 border-r border-gray-200 dark:border-gray-800 flex flex-col ${activeRoomId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Messages</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {rooms.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              No conversations yet. Messages will appear here when you connect with donors or hospitals.
            </div>
          ) : (
            rooms.map(room => {
              const user = room.users.find((u: any) => u.id !== session?.user?.id);
              const latestMessage = room.messages[0];
              const isUnread = latestMessage && latestMessage.senderId !== session?.user?.id && !latestMessage.isRead;

              return (
                <button
                  key={room.id}
                  onClick={() => setActiveRoomId(room.id)}
                  className={`w-full text-left p-4 flex items-start gap-3 border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors ${activeRoomId === room.id ? 'bg-red-50 dark:bg-red-900/20 border-l-4 border-l-primary-red' : ''}`}
                >
                  <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 overflow-hidden relative">
                    {user?.image ? (
                      <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="w-6 h-6 text-gray-400" />
                    )}
                    {isUnread && (
                      <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white dark:border-gray-900 rounded-full"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.name || "Unknown User"}</h3>
                      {latestMessage && (
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                          {new Date(latestMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    <p className={`text-sm truncate ${isUnread ? 'font-bold text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                      {latestMessage ? latestMessage.content : "Start chatting..."}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col ${!activeRoomId ? 'hidden md:flex' : 'flex'}`}>
        {activeRoomId && otherUser ? (
          <>
            {/* Chat Header */}
            <div className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center px-4 md:px-6 gap-3 shrink-0">
              <button 
                onClick={() => setActiveRoomId(null)}
                className="md:hidden p-2 -ml-2 text-gray-500 hover:text-gray-900 dark:hover:text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                {otherUser.image ? (
                  <img src={otherUser.image} alt={otherUser.name} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">{otherUser.name}</h3>
                <p className="text-xs text-gray-500 capitalize">{otherUser.role.replace("_", " ").toLowerCase()}</p>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50/50 dark:bg-gray-900/50">
              {loadingMessages && messages.length === 0 ? (
                <div className="flex h-full items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg: any) => {
                    const isMe = msg.senderId === session?.user?.id;
                    return (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={msg.id} 
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                          isMe 
                            ? 'bg-primary-red text-white rounded-br-sm' 
                            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-100 dark:border-gray-700 rounded-bl-sm'
                        }`}>
                          <p className="text-sm">{msg.content}</p>
                          <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-red-200' : 'text-gray-400'}`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 bg-gray-100 dark:bg-gray-800 border-transparent focus:border-primary-red focus:bg-white dark:focus:bg-gray-900 focus:ring-0 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white transition-all"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  className="bg-primary-red hover:bg-red-700 disabled:opacity-50 text-white rounded-xl px-4 flex items-center justify-center transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 bg-gray-50 dark:bg-gray-900/50">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Send className="w-8 h-8 text-gray-300 dark:text-gray-600 ml-1" />
            </div>
            <p className="font-medium">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}
