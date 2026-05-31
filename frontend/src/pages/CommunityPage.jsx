import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer";
import { getLevelAndRank, COSMETICS_SHOP } from "./ProfilePage";
import PollCard from "../components/PollCard";
import CreatePollModal from "../components/CreatePollModal";

export default function CommunityPage() {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState("users"); // users, polls, discussions

	// Shared
	const [loading, setLoading] = useState(true);
	const [currentUserProfile, setCurrentUserProfile] = useState(null);

	// Users Tab
	const [users, setUsers] = useState([]);
	const [leaderboard, setLeaderboard] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");

	// Polls Tab
	const [polls, setPolls] = useState([]);
	const [isPollModalOpen, setIsPollModalOpen] = useState(false);

	// Discussions Tab
	const [discussions, setDiscussions] = useState([]);
	const [newDiscussion, setNewDiscussion] = useState({ title: "", content: "" });
	const [isCreatingDiscussion, setIsCreatingDiscussion] = useState(false);
	const [activeDiscussion, setActiveDiscussion] = useState(null); // when viewing a specific thread
	const [replyContent, setReplyContent] = useState("");
	const [editingDiscussion, setEditingDiscussion] = useState(null);
	const [editingReply, setEditingReply] = useState(null);

	const currentUsername = localStorage.getItem("username");

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [usersRes, leaderboardRes, pollsRes, discussionsRes] = await Promise.all([
					axios.get("http://localhost:8000/api/users").catch(() => ({ data: [] })),
					axios.get("http://localhost:8000/api/users/leaderboard/top").catch(() => ({ data: [] })),
					axios.get("http://localhost:8000/api/polls").catch(() => ({ data: [] })),
					axios.get("http://localhost:8000/api/discussions").catch(() => ({ data: [] }))
				]);
				setUsers(usersRes.data);
				setLeaderboard(leaderboardRes.data);
				setPolls(pollsRes.data);
				setDiscussions(discussionsRes.data);

				if (currentUsername) {
					const profileRes = await axios.get(`http://localhost:8000/api/users/${currentUsername}`);
					setCurrentUserProfile({ ...profileRes.data, id: profileRes.data._id });
				}
			} catch (err) {
				console.error("Error fetching community data:", err);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [currentUsername]);

	// --- POLLS LOGIC ---
	const handleCreatePoll = async (pollData) => {
		const token = localStorage.getItem("token");
		const res = await axios.post("http://localhost:8000/api/polls", pollData, {
			headers: { Authorization: `Bearer ${token}` }
		});
		setPolls([res.data, ...polls]);
	};

	const handleVote = async (pollId, optionIndex) => {
		const token = localStorage.getItem("token");
		try {
			const res = await axios.post(`http://localhost:8000/api/polls/${pollId}/vote`, 
				{ optionIndex }, 
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			setPolls(polls.map(p => p._id === pollId ? res.data : p));
		} catch (err) {
			alert(err.response?.data?.message || "Voting failed.");
		}
	};

	const handleDeletePoll = async (pollId) => {
		if (!window.confirm("Are you sure you want to delete this poll?")) return;
		const token = localStorage.getItem("token");
		try {
			await axios.delete(`http://localhost:8000/api/polls/${pollId}`, {
				headers: { Authorization: `Bearer ${token}` }
			});
			setPolls(polls.filter(p => p._id !== pollId));
		} catch (err) {
			alert(err.response?.data?.message || "Delete failed.");
		}
	};

	// --- DISCUSSIONS LOGIC ---
	const handleCreateDiscussion = async () => {
		if (!newDiscussion.title || !newDiscussion.content) return;
		const token = localStorage.getItem("token");
		try {
			const res = await axios.post("http://localhost:8000/api/discussions", newDiscussion, {
				headers: { Authorization: `Bearer ${token}` }
			});
			setDiscussions([res.data, ...discussions]);
			setIsCreatingDiscussion(false);
			setNewDiscussion({ title: "", content: "" });
		} catch (err) {
			alert(err.response?.data?.message || "Failed to create discussion");
		}
	};

	const handleDeleteDiscussion = async (id) => {
		if (!window.confirm("Delete this discussion?")) return;
		const token = localStorage.getItem("token");
		try {
			await axios.delete(`http://localhost:8000/api/discussions/${id}`, {
				headers: { Authorization: `Bearer ${token}` }
			});
			setDiscussions(discussions.filter(d => d._id !== id));
			if (activeDiscussion?._id === id) setActiveDiscussion(null);
		} catch (err) {
			alert(err.response?.data?.message || "Delete failed.");
		}
	};

	const handleEditDiscussion = async (id, title, content) => {
		const token = localStorage.getItem("token");
		try {
			const res = await axios.put(`http://localhost:8000/api/discussions/${id}`, { title, content }, {
				headers: { Authorization: `Bearer ${token}` }
			});
			setDiscussions(discussions.map(d => d._id === id ? res.data : d));
			if (activeDiscussion?._id === id) setActiveDiscussion(res.data);
			setEditingDiscussion(null);
		} catch (err) {
			alert(err.response?.data?.message || "Edit failed.");
		}
	};

	const handleAddReply = async (id) => {
		if (!replyContent) return;
		const token = localStorage.getItem("token");
		try {
			const res = await axios.post(`http://localhost:8000/api/discussions/${id}/reply`, { content: replyContent }, {
				headers: { Authorization: `Bearer ${token}` }
			});
			setDiscussions(discussions.map(d => d._id === id ? res.data : d));
			setActiveDiscussion(res.data);
			setReplyContent("");
		} catch (err) {
			alert(err.response?.data?.message || "Reply failed.");
		}
	};

	const handleDeleteReply = async (id, replyId) => {
		if (!window.confirm("Delete reply?")) return;
		const token = localStorage.getItem("token");
		try {
			const res = await axios.delete(`http://localhost:8000/api/discussions/${id}/reply/${replyId}`, {
				headers: { Authorization: `Bearer ${token}` }
			});
			setDiscussions(discussions.map(d => d._id === id ? res.data : d));
			setActiveDiscussion(res.data);
		} catch (err) {
			alert(err.response?.data?.message || "Delete failed.");
		}
	};

	const handleEditReply = async (id, replyId, content) => {
		const token = localStorage.getItem("token");
		try {
			const res = await axios.put(`http://localhost:8000/api/discussions/${id}/reply/${replyId}`, { content }, {
				headers: { Authorization: `Bearer ${token}` }
			});
			setDiscussions(discussions.map(d => d._id === id ? res.data : d));
			setActiveDiscussion(res.data);
			setEditingReply(null);
		} catch (err) {
			alert(err.response?.data?.message || "Edit failed.");
		}
	};

	// UI Helpers
	const filteredUsers = users.filter((u) =>
		u.username !== currentUsername && u.username.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const recentActivities = [
		{ id: 1, user: "Sujal", action: "followed", target: "Luffy", time: "2m ago" },
		{ id: 2, user: "Zoro", action: "reviewed", target: "One Piece", time: "15m ago" },
		{ id: 3, user: "Nami", action: "joined", target: "AniReview", time: "1h ago" },
	];

	if (loading) {
		return (
			<div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
			<main className="flex-1 max-w-7xl mx-auto px-6 py-10 w-full">
				<div className="flex flex-col md:flex-row gap-8">
					{/* Main Content */}
					<div className="flex-1">
						<div className="flex justify-between items-center mb-8">
							<h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
								Community
							</h1>
						</div>

						{/* Tabs */}
						<div className="flex gap-4 border-b border-zinc-800 mb-6">
							{['users', 'polls', 'discussions'].map(tab => (
								<button
									key={tab}
									onClick={() => { setActiveTab(tab); setActiveDiscussion(null); }}
									className={`pb-3 font-semibold text-lg capitalize transition-colors border-b-2 ${
										activeTab === tab ? "border-indigo-500 text-indigo-400" : "border-transparent text-zinc-500 hover:text-zinc-300"
									}`}
								>
									{tab}
								</button>
							))}
						</div>

						{/* USERS TAB */}
						{activeTab === "users" && (
							<div>
								<div className="relative w-full max-w-md mb-6">
									<input
										type="text"
										placeholder="Search users..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="w-full px-4 py-2 pl-10 rounded-xl bg-zinc-900 border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
									/>
									<i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"></i>
								</div>
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
									{filteredUsers.length > 0 ? (
										filteredUsers.map((user) => {
											const { level, rank: levelRank, badge: levelBadge } = getLevelAndRank(user.xp || 0);
											const frameCosmetic = COSMETICS_SHOP.find(c => c.id === user.equippedCosmetics?.avatarFrame);
											const avatarFrameClass = frameCosmetic ? frameCosmetic.styleClass : "border-2 border-zinc-800";
											const colorCosmetic = COSMETICS_SHOP.find(c => c.id === user.equippedCosmetics?.usernameColor);
											const usernameColorClass = colorCosmetic ? colorCosmetic.styleClass : "text-zinc-200";

											return (
												<div
													key={user._id}
													onClick={() => navigate(`/profile/${user.username}`)}
													className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-indigo-500/50 transition group cursor-pointer relative overflow-hidden flex flex-col justify-between"
												>
													<div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-3xl rounded-full -mr-12 -mt-12 group-hover:bg-indigo-500/10 transition"></div>
													<div>
														<div className="flex items-center gap-4 mb-4">
															<img src={user.avatar || "https://api.dicebear.com/9.x/pixel-art/svg?seed=Guest"} alt={user.username} className={`w-16 h-16 rounded-full object-cover ${avatarFrameClass}`} />
															<div className="min-w-0 flex-1">
																<h3 className={`text-xl font-bold truncate group-hover:text-indigo-400 transition flex items-center gap-1.5 ${usernameColorClass}`}>
																	{user.username} <i className={`${levelBadge} text-sm ml-1`}></i>
																</h3>
																<p className="text-xs text-indigo-400 font-semibold mt-0.5">Level {level} • {levelRank}</p>
																<p className="text-xs text-zinc-500 mt-1">{user.followers?.length || 0} followers</p>
															</div>
														</div>
														<p className="text-sm text-zinc-400 line-clamp-2 mb-6">{user.bio || "No bio yet."}</p>
													</div>
													<button onClick={(e) => { e.stopPropagation(); navigate(`/profile/${user.username}`); }} className="w-full py-2 bg-indigo-600/10 text-indigo-400 rounded-xl hover:bg-indigo-600 hover:text-white transition font-semibold cursor-pointer">
														View Profile
													</button>
												</div>
											);
										})
									) : (
										<p className="text-zinc-500">No users found.</p>
									)}
								</div>
							</div>
						)}

						{/* POLLS TAB */}
						{activeTab === "polls" && (
							<div>
								<div className="flex justify-between items-center mb-6">
									<h2 className="text-2xl font-bold">Community Polls</h2>
									<button onClick={() => setIsPollModalOpen(true)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl flex items-center gap-2 cursor-pointer">
										<i className="ri-add-line"></i> Create Poll
									</button>
								</div>
								<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
									{polls.map(poll => (
										<PollCard 
											key={poll._id} 
											poll={poll} 
											onVote={handleVote}
											onDelete={handleDeletePoll}
											currentUser={currentUserProfile}
										/>
									))}
								</div>
								{polls.length === 0 && <p className="text-zinc-500 mt-4">No polls available.</p>}
							</div>
						)}

						{/* DISCUSSIONS TAB */}
						{activeTab === "discussions" && (
							<div>
								{activeDiscussion ? (
									<div className="space-y-6 animate-fadeIn">
										<button onClick={() => setActiveDiscussion(null)} className="text-zinc-400 hover:text-white flex items-center gap-1 mb-4 cursor-pointer">
											<i className="ri-arrow-left-line"></i> Back to Discussions
										</button>
										
										{/* Main Discussion Post */}
										<div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative shadow-lg">
											{editingDiscussion?.id === activeDiscussion._id ? (
												<div className="space-y-3">
													<input type="text" className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-white" value={editingDiscussion.title} onChange={e => setEditingDiscussion({...editingDiscussion, title: e.target.value})} />
													<textarea className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-white h-32" value={editingDiscussion.content} onChange={e => setEditingDiscussion({...editingDiscussion, content: e.target.value})}></textarea>
													<div className="flex gap-2">
														<button onClick={() => handleEditDiscussion(activeDiscussion._id, editingDiscussion.title, editingDiscussion.content)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white font-semibold cursor-pointer">Save</button>
														<button onClick={() => setEditingDiscussion(null)} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-white font-semibold cursor-pointer">Cancel</button>
													</div>
												</div>
											) : (
												<>
													<h2 className="text-2xl font-bold text-white mb-4">{activeDiscussion.title}</h2>
													<div className="flex items-center gap-3 mb-6">
														<img src={activeDiscussion.author?.avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
														<div>
															<span className="text-sm font-bold text-indigo-400">{activeDiscussion.author?.username}</span>
															<span className="text-xs text-zinc-500 ml-2">{new Date(activeDiscussion.createdAt).toLocaleString()}</span>
														</div>
													</div>
													<p className="text-zinc-300 whitespace-pre-wrap">{activeDiscussion.content}</p>
													
													{(currentUserProfile?._id === activeDiscussion.author?._id || currentUserProfile?.isAdmin) && (
														<div className="absolute top-4 right-4 flex gap-2">
															{currentUserProfile?._id === activeDiscussion.author?._id && (
																<button onClick={() => setEditingDiscussion({id: activeDiscussion._id, title: activeDiscussion.title, content: activeDiscussion.content})} className="p-2 text-zinc-400 hover:text-indigo-400 transition cursor-pointer"><i className="ri-pencil-line"></i></button>
															)}
															<button onClick={() => handleDeleteDiscussion(activeDiscussion._id)} className="p-2 text-zinc-400 hover:text-red-400 transition cursor-pointer"><i className="ri-delete-bin-line"></i></button>
														</div>
													)}
												</>
											)}
										</div>

										<h3 className="text-xl font-bold border-b border-zinc-800 pb-2 mt-8">Replies ({activeDiscussion.replies?.length})</h3>

										{/* Replies */}
										<div className="space-y-4">
											{activeDiscussion.replies?.map(reply => (
												<div key={reply._id} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 relative">
													{editingReply?.id === reply._id ? (
														<div className="space-y-3">
															<textarea className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-white" value={editingReply.content} onChange={e => setEditingReply({...editingReply, content: e.target.value})}></textarea>
															<div className="flex gap-2">
																<button onClick={() => handleEditReply(activeDiscussion._id, reply._id, editingReply.content)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white text-sm cursor-pointer">Save</button>
																<button onClick={() => setEditingReply(null)} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-white text-sm cursor-pointer">Cancel</button>
															</div>
														</div>
													) : (
														<>
															<div className="flex items-center gap-3 mb-3">
																<img src={reply.author?.avatar} alt="avatar" className="w-6 h-6 rounded-full object-cover" />
																<span className="text-sm font-bold text-zinc-300">{reply.author?.username}</span>
																<span className="text-xs text-zinc-600">{new Date(reply.createdAt).toLocaleString()}</span>
															</div>
															<p className="text-zinc-400 text-sm whitespace-pre-wrap">{reply.content}</p>

															{(currentUserProfile?._id === reply.author?._id || currentUserProfile?.isAdmin) && (
																<div className="absolute top-3 right-3 flex gap-2">
																	{currentUserProfile?._id === reply.author?._id && (
																		<button onClick={() => setEditingReply({id: reply._id, content: reply.content})} className="text-zinc-500 hover:text-indigo-400 text-sm transition cursor-pointer"><i className="ri-pencil-line"></i></button>
																	)}
																	<button onClick={() => handleDeleteReply(activeDiscussion._id, reply._id)} className="text-zinc-500 hover:text-red-400 text-sm transition cursor-pointer"><i className="ri-delete-bin-line"></i></button>
																</div>
															)}
														</>
													)}
												</div>
											))}
										</div>

										{/* Add Reply */}
										{currentUserProfile ? (
											<div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mt-6">
												<textarea 
													placeholder="Write a reply..." 
													className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white outline-none focus:border-indigo-500 h-24 mb-3 transition"
													value={replyContent}
													onChange={e => setReplyContent(e.target.value)}
												/>
												<div className="flex justify-end">
													<button onClick={() => handleAddReply(activeDiscussion._id)} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 font-bold rounded-lg text-white cursor-pointer transition">Post Reply</button>
												</div>
											</div>
										) : (
											<p className="text-zinc-500 mt-4">Log in to reply to this discussion.</p>
										)}
									</div>
								) : (
									<div className="space-y-6">
										<div className="flex justify-between items-center mb-6">
											<h2 className="text-2xl font-bold">Anime Discussions</h2>
											<button onClick={() => setIsCreatingDiscussion(!isCreatingDiscussion)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl flex items-center gap-2 transition cursor-pointer">
												<i className="ri-add-line"></i> Start Discussion
											</button>
										</div>

										{isCreatingDiscussion && (
											<div className="bg-zinc-900 border border-indigo-500/50 rounded-2xl p-6 mb-8 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
												<h3 className="text-lg font-bold mb-4">New Discussion</h3>
												<input type="text" placeholder="Title" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white mb-4 outline-none focus:border-indigo-500 transition" value={newDiscussion.title} onChange={e => setNewDiscussion({...newDiscussion, title: e.target.value})} />
												<textarea placeholder="What do you want to talk about?" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white h-32 mb-4 outline-none focus:border-indigo-500 transition" value={newDiscussion.content} onChange={e => setNewDiscussion({...newDiscussion, content: e.target.value})} />
												<div className="flex justify-end gap-3">
													<button onClick={() => setIsCreatingDiscussion(false)} className="px-4 py-2 bg-zinc-800 text-zinc-300 font-bold rounded-lg hover:bg-zinc-700 transition cursor-pointer">Cancel</button>
													<button onClick={handleCreateDiscussion} className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-500 transition cursor-pointer">Post Discussion</button>
												</div>
											</div>
										)}

										<div className="space-y-4">
											{discussions.map(disc => (
												<div key={disc._id} onClick={() => setActiveDiscussion(disc)} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-indigo-500/50 cursor-pointer transition flex items-center justify-between">
													<div>
														<h3 className="text-lg font-bold text-white mb-1 group-hover:text-indigo-400 transition">{disc.title}</h3>
														<div className="flex items-center gap-2 text-xs text-zinc-500">
															<span>By <span className="font-semibold text-indigo-400">{disc.author?.username}</span></span>
															<span>• {new Date(disc.createdAt).toLocaleDateString()}</span>
														</div>
													</div>
													<div className="flex items-center gap-2 text-zinc-400">
														<i className="ri-chat-3-line"></i>
														<span className="font-bold">{disc.replies?.length || 0}</span>
													</div>
												</div>
											))}
											{discussions.length === 0 && <p className="text-zinc-500">No discussions found. Be the first to start one!</p>}
										</div>
									</div>
								)}
							</div>
						)}
					</div>

					{/* Sidebar */}
					<div className="w-full md:w-80 space-y-6">
						{/* Leaderboard */}
						<div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 shadow-md">
							<h2 className="text-lg font-bold mb-5 flex items-center gap-2 text-zinc-100">
								<i className="ri-trophy-line text-yellow-400 mr-2"></i> Top Otakus
							</h2>
							<div className="space-y-3">
								{leaderboard.length === 0 ? (
									<p className="text-xs text-zinc-500">No leaderboard users yet.</p>
								) : (
									leaderboard.map((leadUser, idx) => {
										const { level } = getLevelAndRank(leadUser.xp || 0);
										const rankNum = idx + 1;
										let medal = "";
										let medalColor = "text-zinc-500";
										
										if (rankNum === 1) {
											medal = "🥇";
											medalColor = "text-yellow-400";
										} else if (rankNum === 2) {
											medal = "🥈";
											medalColor = "text-zinc-300";
										} else if (rankNum === 3) {
											medal = "🥉";
											medalColor = "text-amber-600";
										} else {
											medal = `#${rankNum}`;
										}

										const colorCosmetic = COSMETICS_SHOP.find(c => c.id === leadUser.equippedCosmetics?.usernameColor);
										const usernameColorClass = colorCosmetic ? colorCosmetic.styleClass : "text-zinc-200";

										return (
											<div 
												key={leadUser._id} 
												onClick={() => navigate(`/profile/${leadUser.username}`)}
												className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-850 border border-transparent hover:border-zinc-800 transition duration-300 cursor-pointer"
											>
												<span className={`w-6 text-center text-xs font-bold shrink-0 ${medalColor}`}>{medal}</span>
												<img src={leadUser.avatar || "https://api.dicebear.com/9.x/pixel-art/svg?seed=Guest"} alt={leadUser.username} className="w-9 h-9 rounded-full object-cover border border-zinc-850 shrink-0"/>
												<div className="flex-1 min-w-0">
													<h4 className={`text-sm font-bold truncate ${usernameColorClass}`}>{leadUser.username}</h4>
													<p className="text-[10px] text-zinc-500 font-semibold">Lvl {level} • {leadUser.xp || 0} XP</p>
												</div>
											</div>
										);
									})
								)}
							</div>
						</div>

						{/* Recent Activity */}
						<div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 shadow-md">
							<h2 className="text-lg font-bold mb-5 flex items-center gap-2 text-zinc-100">
								<i className="ri-pulse-line text-green-500"></i> Live Activity
							</h2>
							<div className="space-y-4">
								{recentActivities.map((act) => (
									<div key={act.id} className="relative pl-5 before:content-[''] before:absolute before:left-0 before:top-2 before:bottom-0 before:w-0.5 before:bg-zinc-800">
										<div className="absolute left-[-3px] top-1.5 w-2 h-2 rounded-full bg-indigo-500"></div>
										<p className="text-xs leading-normal">
											<span className="font-bold text-indigo-400">{act.user}</span>{" "}
											<span className="text-zinc-400">{act.action}</span>{" "}
											<span className="font-bold text-zinc-300">{act.target}</span>
										</p>
										<span className="text-[9px] text-zinc-600 uppercase font-bold tracking-wider">{act.time}</span>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</main>
			
			<CreatePollModal 
				isOpen={isPollModalOpen} 
				onClose={() => setIsPollModalOpen(false)}
				onCreate={handleCreatePoll}
				currentUser={currentUserProfile}
			/>

			<Footer />
		</div>
	);
}
