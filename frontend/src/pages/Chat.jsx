import { useState, useEffect, useRef, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Send, ArrowLeft, User } from "lucide-react";
import { useSocket } from "../context/SocketContext";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import toast from "react-hot-toast";

const Chat = () => {
  const { roomId } = useParams();
  const { user } = useContext(AuthContext);
  const { getSocket } = useSocket();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [typingUser, setTypingUser] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);
  const typingTimeout = useRef(null);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }

    const socket = getSocket();

    // Load history
    API.get(`/chat/${roomId}`)
      .then(({ data }) => setMessages(data))
      .catch(() => {})
      .finally(() => setLoading(false));

    if (socket) {
      socket.emit("join_room", roomId);

      socket.on("receive_message", (data) => {
        if (data.room === roomId) {
          setMessages((prev) => [...prev, {
            sender: data.senderId,
            text: data.message,
            createdAt: new Date(),
            _id: Date.now(),
          }]);
        }
      });

      socket.on("typing", (data) => {
        if (data.userId !== user._id) {
          setTypingUser(data.name);
          setTyping(true);
        }
      });

      socket.on("stop_typing", (data) => {
        if (data.userId !== user._id) {
          setTyping(false);
          setTypingUser("");
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("receive_message");
        socket.off("typing");
        socket.off("stop_typing");
      }
    };
  }, [roomId, user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const handleSend = () => {
    if (!input.trim()) return;
    const socket = getSocket();
    if (!socket) return toast.error("Connection lost. Please refresh.");

    socket.emit("send_message", {
      room: roomId,
      senderId: user._id,
      senderName: user.name,
      message: input.trim(),
    });

    // Optimistic update
    setMessages((prev) => [...prev, {
      sender: user._id,
      text: input.trim(),
      createdAt: new Date(),
      _id: "opt_" + Date.now(),
    }]);

    setInput("");
    socket.emit("stop_typing", { room: roomId, userId: user._id });
  };

  const handleTyping = (e) => {
    setInput(e.target.value);
    const socket = getSocket();
    if (!socket) return;
    socket.emit("typing", { room: roomId, userId: user._id, name: user.name });
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit("stop_typing", { room: roomId, userId: user._id });
    }, 1500);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#F8F9FB]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 shadow-sm">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-brand-600 transition">
          <ArrowLeft size={22} />
        </button>
        <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
          <User size={18} className="text-brand-600" />
        </div>
        <div>
          <p className="font-black text-gray-900 text-sm">Private Chat</p>
          <p className="text-xs text-gray-400 font-mono truncate max-w-48">{roomId}</p>
        </div>
        <div className="ml-auto w-2 h-2 bg-emerald-400 rounded-full animate-pulse" title="Online" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-brand-300 border-t-brand-600 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm">Loading messages...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send size={24} className="text-gray-300" />
              </div>
              <p className="font-bold">Start the conversation!</p>
              <p className="text-sm mt-1">Ask "Last price kya hai?" 😄</p>
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender === user._id || msg.sender?._id === user._id || msg.sender?.toString() === user._id;
            return (
              <div key={msg._id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] px-4 py-3 rounded-2xl shadow-sm ${
                  isMe
                    ? "bg-brand-600 text-white rounded-br-sm"
                    : "bg-white text-gray-900 rounded-bl-sm border border-gray-100"
                }`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <p className={`text-[10px] mt-1 ${isMe ? "text-brand-200" : "text-gray-400"}`}>
                    {new Date(msg.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            );
          })
        )}

        {/* Typing indicator */}
        {typing && typingUser && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500 mr-1">{typingUser} is typing</span>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-100 px-4 py-3">
        <div className="flex items-center gap-3 max-w-3xl mx-auto">
          <div className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-brand-300 focus-within:border-brand-300 transition">
            <textarea
              value={input}
              onChange={handleTyping}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Type a message... (Enter to send)"
              className="w-full bg-transparent outline-none text-sm resize-none max-h-32"
              style={{ lineHeight: "1.5" }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-12 h-12 bg-brand-600 text-white rounded-2xl flex items-center justify-center hover:bg-brand-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 shadow-lg shadow-brand-100"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-center text-[10px] text-gray-300 mt-2">
          Messages are private and secure
        </p>
      </div>
    </div>
  );
};

export default Chat;
