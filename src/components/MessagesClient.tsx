"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, Search, Send, Loader2 } from "lucide-react";
import useSWR from "swr";
import { getChatRoomsAction, getMessagesAction, sendMessageAction, markMessagesReadAction } from "@/app/actions/chat";

export default function MessagesClient({ currentUserId }: { currentUserId: string }) {
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Poll for chat rooms every 5 seconds
  const { data: roomsData, mutate: mutateRooms } = useSWR('chatRooms', getChatRoomsAction, { refreshInterval: 5000 });
  const rooms = roomsData?.rooms || [];

  // Poll for active room messages every 3 seconds
  const { data: messagesData, mutate: mutateMessages } = useSWR(
    activeRoomId ? `messages-${activeRoomId}` : null,
    () => getMessagesAction(activeRoomId!),
    { refreshInterval: 3000 }
  );
  const messages = messagesData?.messages || [];

  // Auto-scroll and mark read when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    if (activeRoomId && messages.length > 0) {
      const hasUnread = messages.some(m => !m.isRead && m.senderId !== currentUserId);
      if (hasUnread) {
        markMessagesReadAction(activeRoomId).then(() => {
          mutateRooms();
          mutateMessages();
        });
      }
    }
  }, [messages, activeRoomId, currentUserId, mutateRooms, mutateMessages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeRoomId || sending) return;

    setSending(true);
    const content = messageText;
    setMessageText("");

    // Optimistic update
    mutateMessages({ success: true, messages: [...messages, { id: 'temp', content, senderId: currentUserId, roomId: activeRoomId, isRead: false, createdAt: new Date(), sender: { name: 'You', id: currentUserId } }] }, false);


    const res = await sendMessageAction(activeRoomId, content);
    if (res.success) {
      mutateMessages();
      mutateRooms();
    } else {
      setMessageText(content); // restore on fail
    }
    setSending(false);
  };

  const activeRoom = rooms.find((r: any) => r.id === activeRoomId);
  const otherUser = activeRoom?.users[0]; // because current user is excluded in the query

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm transition-colors">
      <div className="grid grid-cols-1 md:grid-cols-3 h-full">
        {/* Sidebar */}
        <div className={`border-r border-gray-100 dark:border-slate-800 flex flex-col h-full bg-gray-50/50 dark:bg-slate-900/50 transition-colors ${activeRoomId ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-gray-100 dark:border-slate-800 transition-colors">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
              <input 
                type="text" 
                placeholder="Search conversations..." 
                className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {!roomsData ? (
              <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-gray-400 dark:text-gray-600" /></div>
            ) : rooms.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">No conversations yet.<br/>Unlock a donor contact to start chatting.</div>
            ) : (
              rooms.map((room: any) => {
                const partner = room.users[0];
                const lastMessage = room.messages[0];
                const hasUnread = lastMessage && !lastMessage.isRead && lastMessage.senderId !== currentUserId;
                const isActive = room.id === activeRoomId;

                return (
                  <button 
                    key={room.id} 
                    onClick={() => setActiveRoomId(room.id)}
                    className={`w-full flex items-start gap-3 p-3 rounded-2xl transition-colors ${isActive ? 'bg-white dark:bg-slate-800 shadow-sm border border-gray-200 dark:border-slate-700' : 'hover:bg-gray-100 dark:hover:bg-slate-800/50 border border-transparent dark:border-transparent'}`}
                  >
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-light-red to-gray-200 dark:from-red-900/50 dark:to-slate-700 flex items-center justify-center font-bold text-gray-700 dark:text-gray-200 text-lg shadow-inner">
                        {partner?.name?.charAt(0) || '?'}
                      </div>
                      {hasUnread && <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full"></span>}
                    </div>
                    <div className="text-left flex-1 min-w-0 pt-1">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className={`font-bold truncate transition-colors ${hasUnread ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>{partner?.name || 'Unknown User'}</span>
                        {lastMessage && (
                          <span className={`text-xs transition-colors ${hasUnread ? 'text-primary-red font-bold' : 'text-gray-400 dark:text-gray-500'}`}>
                            {new Date(lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                      <p className={`text-sm truncate transition-colors ${hasUnread ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                        {lastMessage ? (lastMessage.senderId === currentUserId ? `You: ${lastMessage.content}` : lastMessage.content) : 'No messages yet'}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
        
        {/* Chat Area */}
        <div className={`md:flex md:col-span-2 flex-col h-full bg-white dark:bg-slate-900 transition-colors ${!activeRoomId ? 'hidden md:flex' : 'flex'}`}>
          {!activeRoomId ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-600">
              <MessageSquare className="w-16 h-16 mb-4 text-gray-200 dark:text-gray-700 transition-colors" />
              <p className="font-medium text-lg text-gray-500 dark:text-gray-400 transition-colors">Select a conversation to start messaging</p>
            </div>
          ) : (
            <>
              <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-10 transition-colors">
                <div className="flex items-center gap-4">
                  <button onClick={() => setActiveRoomId(null)} className="md:hidden text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-bold transition-colors">&larr; Back</button>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-light-red to-gray-200 dark:from-red-900/50 dark:to-slate-700 flex items-center justify-center font-bold text-gray-700 dark:text-gray-200 shadow-inner">{otherUser?.name?.charAt(0) || '?'}</div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg transition-colors">{otherUser?.name || 'Unknown User'}</h3>
                    <p className="text-xs text-green-500 dark:text-green-400 font-medium tracking-wide uppercase transition-colors">Connected via RaktaSetu</p>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto bg-[url('https://res.cloudinary.com/demo/image/upload/v1642683935/pattern-bg.png')] bg-opacity-5 dark:opacity-40">
                {!messagesData ? (
                  <div className="flex justify-center flex-1 items-center"><Loader2 className="w-8 h-8 animate-spin text-gray-300 dark:text-gray-600" /></div>
                ) : messages.length === 0 ? (
                  <div className="flex justify-center flex-1 items-center text-gray-500 dark:text-gray-400 font-medium">This is the beginning of your conversation.</div>
                ) : (
                  messages.map((msg: any) => {
                    const isMe = msg.senderId === currentUserId;
                    return (
                      <div key={msg.id} className={`flex flex-col max-w-[75%] ${isMe ? 'self-end' : 'self-start'}`}>
                        <div className={`py-3 px-5 rounded-2xl ${isMe ? 'bg-primary-red text-white rounded-tr-sm shadow-md shadow-red-200 dark:shadow-none' : 'bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded-tl-sm border border-gray-200 dark:border-slate-700'}`}>
                          <p className="leading-relaxed">{msg.content}</p>
                        </div>
                        <p className={`text-[10px] text-gray-400 dark:text-gray-500 mt-1.5 font-medium transition-colors ${isMe ? 'text-right' : 'text-left'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
                <form onSubmit={handleSend} className="flex gap-3 max-w-4xl mx-auto">
                  <input 
                    type="text" 
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type your message here..." 
                    className="flex-1 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all" 
                  />
                  <button 
                    type="submit"
                    disabled={sending || !messageText.trim()}
                    className="bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-100 text-white dark:text-gray-900 px-6 py-3.5 rounded-2xl font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:shadow-none flex items-center gap-2"
                  >
                    {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
