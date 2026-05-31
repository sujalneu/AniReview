import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Level & Rank Calculator helper
function getLevelAndRank(xp) {
    if (xp < 100) {
        return { level: 1, rank: "Beginner Otaku", badge: "ri-seedling-line text-emerald-400", currentLevelMin: 0, nextLevelMin: 100 };
    } else if (xp < 500) {
        return { level: 2, rank: "Anime Fan", badge: "ri-star-line text-yellow-400", currentLevelMin: 100, nextLevelMin: 500 };
    } else if (xp < 1500) {
        return { level: 3, rank: "Elite Reviewer", badge: "ri-trophy-line text-indigo-400", currentLevelMin: 500, nextLevelMin: 1500 };
    } else {
        return { level: 4, rank: "Anime Master", badge: "ri-vip-crown-line text-amber-400", currentLevelMin: 1500, nextLevelMin: null };
    }
}

export default function ChatPage() {
    const [friends, setFriends] = useState([]);
    const [loadingFriends, setLoadingFriends] = useState(true);
    const [activeFriend, setActiveFriend] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    const currentUsername = localStorage.getItem("username");
    const currentUserId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    // Fetch friends list
    useEffect(() => {
        if (!token) {
            navigate("/auth");
            return;
        }

        const fetchFriends = async () => {
            try {
                const res = await axios.get("http://localhost:8000/api/users/auth/friends", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setFriends(res.data);
            } catch (err) {
                console.error("Failed to load friends:", err);
            } finally {
                setLoadingFriends(false);
            }
        };

        fetchFriends();
    }, [token, navigate]);

    // Fetch message history for selected friend
    const fetchMessages = async (friendId) => {
        if (!token || !friendId) return;
        try {
            const res = await axios.get(`http://localhost:8000/api/messages/${friendId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(res.data);
        } catch (err) {
            console.error("Failed to fetch messages:", err);
        }
    };

    // Poll for new messages every 4 seconds when activeFriend is selected
    useEffect(() => {
        if (!activeFriend) return;

        fetchMessages(activeFriend._id);

        const interval = setInterval(() => {
            fetchMessages(activeFriend._id);
        }, 4000);

        return () => clearInterval(interval);
    }, [activeFriend, token]);

    // Scroll to bottom of chat
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageText.trim() || !activeFriend) return;

        const text = messageText;
        setMessageText(""); // Clear immediately for UX
        try {
            await axios.post("http://localhost:8000/api/messages", {
                recipientId: activeFriend._id,
                text
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Refresh messages from server to avoid duplicates with polling
            fetchMessages(activeFriend._id);
        } catch (err) {
            setMessageText(text); // Restore on error
            alert(err.response?.data?.message || "Failed to send message.");
        }
    };

    const filteredFriends = [...new Map(friends.map(f => [f._id, f])).values()]
        .filter(friend => friend.username.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="min-h-[calc(100vh-80px)] bg-zinc-950 text-zinc-100 flex flex-col md:flex-row">
            {/* LEFT PANE: Friends List */}
            <div className={`w-full md:w-80 border-r border-zinc-800 bg-zinc-900/50 flex flex-col ${activeFriend ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-6 border-b border-zinc-800 space-y-4">
                    <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                        <i className="ri-message-3-line text-indigo-400"></i> Direct Messages
                    </h2>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Filter friends..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <i className="ri-search-line absolute left-3.5 top-3 text-zinc-500 text-sm"></i>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-zinc-800/40">
                    {loadingFriends ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500"></div>
                        </div>
                    ) : filteredFriends.length > 0 ? (
                        filteredFriends.map(friend => {
                            const { level, badge } = getLevelAndRank(friend.xp || 0);
                            return (
                                <button
                                    key={friend._id}
                                    onClick={() => setActiveFriend(friend)}
                                    className={`w-full p-4 text-left flex items-center gap-3 transition cursor-pointer hover:bg-zinc-800/30 ${activeFriend?._id === friend._id ? 'bg-indigo-600/10 border-l-4 border-indigo-500' : ''}`}
                                >
                                    <div className="w-11 h-11 rounded-full overflow-hidden border border-zinc-700 shrink-0">
                                        <img src={friend.avatar} alt={friend.username} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-0.5">
                                            <span className="font-semibold text-white truncate text-sm">{friend.username}</span>
                                        </div>
                                        <p className="text-xs text-zinc-500 flex items-center gap-1.5 font-medium">
                                            <i className={badge}></i> Lvl {level}
                                        </p>
                                    </div>
                                </button>
                            );
                        })
                    ) : (
                        <div className="p-8 text-center text-zinc-500 text-sm">
                            <i className="ri-user-unfollow-line text-3xl mb-2 block"></i>
                            No friends found. Add friends in the Community page to chat!
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT PANE: Chat History */}
            <div className={`flex-1 flex flex-col bg-zinc-950 ${!activeFriend ? 'hidden md:flex justify-center items-center text-center p-8 text-zinc-500' : 'flex'}`}>
                {!activeFriend ? (
                    <div className="max-w-md space-y-4">
                        <div className="w-20 h-20 bg-zinc-900 rounded-3xl border border-zinc-800 flex items-center justify-center mx-auto text-indigo-400 shadow-xl shadow-indigo-500/5">
                            <i className="ri-wechat-line text-4xl"></i>
                        </div>
                        <h3 className="text-xl font-bold text-zinc-300">Your Chatroom</h3>
                        <p className="text-sm leading-relaxed">Select a friend from the left sidebar to start debating about your favorite anime shows!</p>
                    </div>
                ) : (
                    <>
                        {/* Chat Header */}
                        <div className="px-6 py-4 border-b border-zinc-800/80 bg-zinc-900/20 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setActiveFriend(null)}
                                    className="md:hidden p-2 -ml-2 text-zinc-400 hover:text-white transition cursor-pointer"
                                >
                                    <i className="ri-arrow-left-line text-xl"></i>
                                </button>
                                <div className="w-10 h-10 rounded-full overflow-hidden border border-zinc-700 shrink-0">
                                    <img src={activeFriend.avatar} alt={activeFriend.username} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-sm">{activeFriend.username}</h4>
                                    <button
                                        onClick={() => navigate(`/profile/${activeFriend.username}`)}
                                        className="text-xs text-indigo-400 hover:underline hover:text-indigo-300 transition text-left cursor-pointer"
                                    >
                                        View Profile
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Message History */}
                        <div className="flex-1 p-6 overflow-y-auto space-y-4 max-h-[calc(100vh-230px)] no-scrollbar">
                            {messages.length > 0 ? (
                                messages.map(msg => {
                                    const isSender = msg.sender === currentUserId;
                                    return (
                                        <div key={msg._id} className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm shadow-md leading-relaxed ${isSender ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-zinc-800/80 text-zinc-100 rounded-tl-none border border-zinc-700/30'}`}>
                                                <p className="whitespace-pre-wrap">{msg.text}</p>
                                                <span className="text-[10px] text-zinc-400/80 block text-right mt-1 font-mono">
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="h-full flex flex-col justify-center items-center text-center text-zinc-500 py-12">
                                    <i className="ri-chat-voice-line text-4xl text-zinc-700 mb-2"></i>
                                    <p className="text-sm">This is the start of your message history with @{activeFriend.username}.</p>
                                    <p className="text-xs text-zinc-600 mt-1">Say hello! 👋</p>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className="p-4 border-t border-zinc-800 bg-zinc-900/30 flex gap-3">
                            <input
                                type="text"
                                placeholder={`Write a message to ${activeFriend.username}...`}
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                className="flex-1 px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-zinc-500"
                            />
                            <button
                                type="submit"
                                className="bg-indigo-600 hover:bg-indigo-500 text-white w-12 h-12 rounded-xl flex items-center justify-center transition active:scale-95 shadow-md shadow-indigo-600/10 cursor-pointer"
                            >
                                <i className="ri-send-plane-2-fill text-lg"></i>
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
