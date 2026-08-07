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
    <div className="h-[calc(100vh-120px)] flex flex-col bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 h-full">
        {/* Sidebar */}
        <div className={`border-r border-gray-100 flex flex-col h-full bg-gray-50/50 ${activeRoomId ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search conversations..." 
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red text-sm"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {!roomsData ? (
              <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
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
                    className={`w-full flex items-start gap-3 p-3 rounded-2xl transition-colors ${isActive ? 'bg-white shadow-sm border border-gray-200' : 'hover:bg-gray-100 border border-transparent'}`}
                  >
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-light-red to-gray-200 flex items-center justify-center font-bold text-gray-700 text-lg shadow-inner">
                        {partner?.name?.charAt(0) || '?'}
                      </div>
                      {hasUnread && <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full"></span>}
                    </div>
                    <div className="text-left flex-1 min-w-0 pt-1">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className={`font-bold truncate ${hasUnread ? 'text-gray-900' : 'text-gray-700'}`}>{partner?.name || 'Unknown User'}</span>
                        {lastMessage && (
                          <span className={`text-xs ${hasUnread ? 'text-primary-red font-bold' : 'text-gray-400'}`}>
                            {new Date(lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                      <p className={`text-sm truncate ${hasUnread ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
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
        <div className={`md:flex md:col-span-2 flex-col h-full bg-white ${!activeRoomId ? 'hidden md:flex' : 'flex'}`}>
          {!activeRoomId ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <MessageSquare className="w-16 h-16 mb-4 text-gray-200" />
              <p className="font-medium text-lg text-gray-500">Select a conversation to start messaging</p>
            </div>
          ) : (
            <>
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white/80 backdrop-blur-md z-10">
                <div className="flex items-center gap-4">
                  <button onClick={() => setActiveRoomId(null)} className="md:hidden text-gray-500 hover:text-gray-900 font-bold">&larr; Back</button>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-light-red to-gray-200 flex items-center justify-center font-bold text-gray-700 shadow-inner">{otherUser?.name?.charAt(0) || '?'}</div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{otherUser?.name || 'Unknown User'}</h3>
                    <p className="text-xs text-green-500 font-medium tracking-wide uppercase">Connected via RaktaSetu</p>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto bg-[url('https://res.cloudinary.com/demo/image/upload/v1642683935/pattern-bg.png')] bg-opacity-5">
                {!messagesData ? (
                  <div className="flex justify-center flex-1 items-center"><Loader2 className="w-8 h-8 animate-spin text-gray-300" /></div>
                ) : messages.length === 0 ? (
                  <div className="flex justify-center flex-1 items-center text-gray-500 font-medium">This is the beginning of your conversation.</div>
                ) : (
                  messages.map((msg: any) => {
                    const isMe = msg.senderId === currentUserId;
                    return (
                      <div key={msg.id} className={`flex flex-col max-w-[75%] ${isMe ? 'self-end' : 'self-start'}`}>
                        <div className={`py-3 px-5 rounded-2xl ${isMe ? 'bg-primary-red text-white rounded-tr-sm shadow-md shadow-red-200' : 'bg-gray-100 text-gray-800 rounded-tl-sm border border-gray-200'}`}>
                          <p className="leading-relaxed">{msg.content}</p>
                        </div>
                        <p className={`text-[10px] text-gray-400 mt-1.5 font-medium ${isMe ? 'text-right' : 'text-left'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-gray-100 bg-white">
                <form onSubmit={handleSend} className="flex gap-3 max-w-4xl mx-auto">
                  <input 
                    type="text" 
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type your message here..." 
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red transition-all" 
                  />
                  <button 
                    type="submit"
                    disabled={sending || !messageText.trim()}
                    className="bg-gray-900 hover:bg-black text-white px-6 py-3.5 rounded-2xl font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:shadow-none flex items-center gap-2"
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
