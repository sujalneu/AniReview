import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const TYPE_ICON = {
    friend_request: { icon: "ri-user-add-line", color: "#a78bfa" },
    follow: { icon: "ri-user-follow-line", color: "#34d399" },
    review_reply: { icon: "ri-chat-3-line", color: "#60a5fa" },
    poll_comment: { icon: "ri-bar-chart-2-line", color: "#f59e0b" },
};

function timeAgo(date) {
    const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
}

export default function NotificationBell() {
    const [notifications, setNotifications] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    const fetchNotifications = useCallback(async () => {
        if (!token) return;
        try {
            const res = await axios.get("http://localhost:8000/api/notifications", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotifications(res.data);
        } catch {
            // silently fail – don't disrupt UI
        }
    }, [token]);

    // Initial fetch + polling every 30s
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const unreadCount = notifications.filter((n) => !n.read).length;

    async function handleOpen() {
        setOpen((prev) => !prev);
        if (!open) {
            await fetchNotifications();
        }
    }

    async function handleClick(notification) {
        // Mark as read
        if (!notification.read) {
            try {
                await axios.put(
                    `http://localhost:8000/api/notifications/${notification._id}/read`,
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setNotifications((prev) =>
                    prev.map((n) => (n._id === notification._id ? { ...n, read: true } : n))
                );
            } catch {}
        }
        setOpen(false);
        if (notification.link) navigate(notification.link);
    }

    async function handleMarkAllRead() {
        try {
            await axios.put(
                "http://localhost:8000/api/notifications/read-all",
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        } catch {}
    }

    async function handleDelete(e, id) {
        e.stopPropagation();
        try {
            await axios.delete(`http://localhost:8000/api/notifications/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotifications((prev) => prev.filter((n) => n._id !== id));
        } catch {}
    }

    async function handleClearAll() {
        try {
            await axios.delete("http://localhost:8000/api/notifications", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotifications([]);
        } catch {}
    }

    if (!token) return null;

    return (
        <div className="relative" ref={dropdownRef} style={{ zIndex: 9999 }}>
            {/* Bell Button */}
            <button
                id="notification-bell-btn"
                onClick={handleOpen}
                className="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-zinc-700 transition-all duration-200 cursor-pointer"
                aria-label="Notifications"
            >
                <i
                    className={`ri-notification-3-line text-xl transition-all duration-200 ${
                        unreadCount > 0 ? "text-indigo-400" : "text-zinc-400"
                    }`}
                />
                {unreadCount > 0 && (
                    <span
                        className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold text-white"
                        style={{
                            background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                            boxShadow: "0 0 8px rgba(124,58,237,0.7)",
                            animation: unreadCount > 0 ? "notif-pulse 2s infinite" : "none",
                        }}
                    >
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Panel */}
            {open && (
                <div
                    id="notification-dropdown"
                    className="absolute right-0 mt-2 w-96 rounded-2xl overflow-hidden shadow-2xl"
                    style={{
                        background: "linear-gradient(145deg, #18181b, #1c1c2e)",
                        border: "1px solid rgba(99,102,241,0.2)",
                        backdropFilter: "blur(20px)",
                    }}
                >
                    {/* Header */}
                    <div
                        className="flex items-center justify-between px-4 py-3"
                        style={{
                            borderBottom: "1px solid rgba(99,102,241,0.15)",
                            background: "linear-gradient(90deg, rgba(99,102,241,0.08), transparent)",
                        }}
                    >
                        <div className="flex items-center gap-2">
                            <i className="ri-notification-3-fill text-indigo-400" />
                            <span className="font-semibold text-white text-sm">Notifications</span>
                            {unreadCount > 0 && (
                                <span className="px-2 py-0.5 rounded-full text-xs font-bold text-indigo-300 bg-indigo-900/50">
                                    {unreadCount} new
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllRead}
                                    className="text-xs text-indigo-400 hover:text-indigo-300 transition cursor-pointer"
                                    title="Mark all as read"
                                >
                                    Mark all read
                                </button>
                            )}
                            {notifications.length > 0 && (
                                <button
                                    onClick={handleClearAll}
                                    className="text-xs text-zinc-500 hover:text-red-400 transition cursor-pointer"
                                    title="Clear all"
                                >
                                    Clear all
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Notification List */}
                    <div className="max-h-[420px] overflow-y-auto scrollbar-thin">
                        {notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
                                <i className="ri-notification-off-line text-4xl mb-3 text-zinc-600" />
                                <p className="text-sm">No notifications yet</p>
                                <p className="text-xs mt-1 text-zinc-600">
                                    You'll be notified about replies, friends & more
                                </p>
                            </div>
                        ) : (
                            notifications.map((notif) => {
                                const typeInfo = TYPE_ICON[notif.type] || {
                                    icon: "ri-notification-3-line",
                                    color: "#94a3b8",
                                };
                                return (
                                    <div
                                        key={notif._id}
                                        onClick={() => handleClick(notif)}
                                        className="group flex items-start gap-3 px-4 py-3 cursor-pointer transition-all duration-200 relative"
                                        style={{
                                            background: notif.read
                                                ? "transparent"
                                                : "linear-gradient(90deg, rgba(99,102,241,0.06), transparent)",
                                            borderBottom: "1px solid rgba(255,255,255,0.04)",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background =
                                                "rgba(99,102,241,0.1)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = notif.read
                                                ? "transparent"
                                                : "linear-gradient(90deg, rgba(99,102,241,0.06), transparent)";
                                        }}
                                    >
                                        {/* Unread dot */}
                                        {!notif.read && (
                                            <div
                                                className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
                                                style={{ background: typeInfo.color }}
                                            />
                                        )}

                                        {/* Type icon */}
                                        <div
                                            className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center mt-0.5"
                                            style={{
                                                background: `${typeInfo.color}18`,
                                                border: `1px solid ${typeInfo.color}30`,
                                            }}
                                        >
                                            <i
                                                className={`${typeInfo.icon} text-base`}
                                                style={{ color: typeInfo.color }}
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <p
                                                className="text-sm leading-snug"
                                                style={{
                                                    color: notif.read ? "#a1a1aa" : "#e4e4e7",
                                                    fontWeight: notif.read ? 400 : 500,
                                                }}
                                            >
                                                {notif.message}
                                            </p>
                                            <p className="text-xs text-zinc-600 mt-0.5">
                                                {timeAgo(notif.createdAt)}
                                            </p>
                                        </div>

                                        {/* Delete button */}
                                        <button
                                            onClick={(e) => handleDelete(e, notif._id)}
                                            className="opacity-0 group-hover:opacity-100 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-zinc-600 hover:text-red-400 hover:bg-red-900/20 transition-all duration-200 cursor-pointer"
                                        >
                                            <i className="ri-close-line text-xs" />
                                        </button>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div
                            className="px-4 py-2 text-center"
                            style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
                        >
                            <p className="text-xs text-zinc-600">
                                Showing {notifications.length} notification
                                {notifications.length !== 1 ? "s" : ""}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Pulse animation */}
            <style>{`
                @keyframes notif-pulse {
                    0%, 100% { box-shadow: 0 0 8px rgba(124,58,237,0.7); }
                    50% { box-shadow: 0 0 16px rgba(124,58,237,1), 0 0 24px rgba(79,70,229,0.5); }
                }
            `}</style>
        </div>
    );
}
