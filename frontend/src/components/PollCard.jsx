import { useState, useEffect } from "react";
import axios from "axios";

export default function PollCard({ poll, onVote, onDelete, currentUser }) {
    const [timeLeft, setTimeLeft] = useState("");
    const isExpired = new Date() > new Date(poll.expiresAt);
    const hasVoted = poll.options.some((opt) =>
        opt.votes.includes(currentUser?.id || currentUser?._id)
    );
    const totalVotes = poll.options.reduce((acc, opt) => acc + opt.votes.length, 0);

    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [commentsList, setCommentsList] = useState(poll.comments || []);
    const [submittingComment, setSubmittingComment] = useState(false);

    useEffect(() => {
        setCommentsList(poll.comments || []);
    }, [poll.comments]);

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim() || submittingComment) return;

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please log in to participate in the debate!");
            return;
        }

        setSubmittingComment(true);
        try {
            const res = await axios.post(`http://localhost:8000/api/polls/${poll._id}/comments`, 
                { text: commentText }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setCommentsList(res.data.comments || []);
            setCommentText("");
        } catch (err) {
            alert(err.response?.data?.message || "Failed to post comment.");
        } finally {
            setSubmittingComment(false);
        }
    };

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = new Date(poll.expiresAt) - new Date();
            if (difference <= 0) {
                setTimeLeft("Expired");
                return;
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((difference / 1000 / 60) % 60);

            setTimeLeft(`${days}d ${hours}h ${minutes}m left`);
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 60000); // update every minute

        return () => clearInterval(timer);
    }, [poll.expiresAt]);

    const handleVote = (index) => {
        if (!currentUser || isExpired || hasVoted) return;
        onVote(poll._id, index);
    };

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold text-zinc-100">{poll.question}</h3>
                    <p className="text-sm text-zinc-500 mt-1">
                        Posted by <span className="text-indigo-400">@{poll.creator?.isAdmin ? "Admin" : poll.creator?.username}</span>
                    </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${isExpired ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                    {isExpired ? 'Expired' : timeLeft}
                </div>
            </div>

            <div className="space-y-3">
                {poll.options.map((option, index) => {
                    const percentage = totalVotes === 0 ? 0 : Math.round((option.votes.length / totalVotes) * 100);
                    const isWinning = isExpired && option.votes.length > 0 && 
                        option.votes.length === Math.max(...poll.options.map(o => o.votes.length));

                    return (
                        <div key={index} className="relative group">
                            {(hasVoted || isExpired) ? (
                                <div className="space-y-1">
                                    <div className="flex justify-between text-sm px-1">
                                        <span className={isWinning ? "text-indigo-400 font-bold" : "text-zinc-300"}>
                                            {option.text} {isWinning && "🏆"}
                                        </span>
                                        <span className="text-zinc-500">{percentage}% ({option.votes.length})</span>
                                    </div>
                                    <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full transition-all duration-500 ${isWinning ? 'bg-indigo-500' : 'bg-zinc-600'}`}
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => handleVote(index)}
                                    className="w-full text-left px-4 py-3 rounded-xl border border-zinc-700 hover:border-indigo-500 hover:bg-indigo-500/5 transition group-hover:scale-[1.01] active:scale-[0.99]"
                                >
                                    <span className="text-zinc-300 group-hover:text-white transition">{option.text}</span>
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Comments Toggle and Actions */}
            <div className="border-t border-zinc-800/60 pt-4 flex justify-between items-center text-sm">
                <span className="text-zinc-500">{totalVotes} votes</span>
                <div className="flex gap-4 items-center">
                    <button
                        onClick={() => setShowComments(!showComments)}
                        className="text-indigo-400 hover:text-indigo-300 transition flex items-center gap-1.5 font-medium cursor-pointer"
                    >
                        <i className="ri-chat-3-line"></i> Debate ({commentsList.length})
                    </button>
                    {onDelete && (currentUser?.isAdmin || currentUser?.id === poll.creator?._id || currentUser?._id === poll.creator?._id) && (
                        <button 
                            onClick={() => onDelete(poll._id)}
                            className="text-zinc-500 hover:text-red-400 transition cursor-pointer"
                            title="Delete Poll"
                        >
                            <i className="ri-delete-bin-line"></i>
                        </button>
                    )}
                </div>
            </div>

            {/* Comments Drawer */}
            {showComments && (
                <div className="space-y-4 border-t border-zinc-800/40 pt-4 animate-in fade-in duration-200">
                    <div className="max-h-48 overflow-y-auto space-y-2.5 pr-1 no-scrollbar">
                        {commentsList.length > 0 ? (
                            commentsList.map((c, i) => (
                                <div key={c._id || i} className="bg-zinc-850/50 border border-zinc-800/20 rounded-xl p-3 text-xs space-y-1 bg-zinc-800/30">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-indigo-300">@{c.username || c.user?.username}</span>
                                        <span className="text-zinc-500 text-[10px]">{new Date(c.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-zinc-350 leading-relaxed break-words">{c.text}</p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-4 text-zinc-600 italic text-xs">
                                No debate comments yet. Be the first to share your take!
                            </div>
                        )}
                    </div>

                    {/* Comment Input */}
                    {!isExpired ? (
                        currentUser ? (
                            <form onSubmit={handleAddComment} className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Write your debate stance..."
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    className="flex-1 bg-zinc-800 border border-zinc-700/80 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-zinc-100 placeholder-zinc-500"
                                />
                                <button
                                    type="submit"
                                    disabled={submittingComment || !commentText.trim()}
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-xl text-xs font-bold transition disabled:opacity-50 cursor-pointer"
                                >
                                    {submittingComment ? '...' : 'Send'}
                                </button>
                            </form>
                        ) : (
                            <p className="text-[11px] text-zinc-500 text-center italic">
                                Please sign in to join the debate.
                            </p>
                        )
                    ) : (
                        <p className="text-[11px] text-red-400/80 text-center italic">
                            Poll is expired. Debate is closed.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
