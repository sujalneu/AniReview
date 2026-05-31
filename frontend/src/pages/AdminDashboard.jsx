import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
	XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import CreatePollModal from "../components/CreatePollModal";
import PollCard from "../components/PollCard";

export default function AdminDashboard() {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState("users");
	const [currentUser, setCurrentUser] = useState(null);
	const [token, setToken] = useState(null);

	// Modal States for Anime
	const [showModal, setShowModal] = useState(false);
	const [search, setSearch] = useState("");
	const [results, setResults] = useState([]);	
	const [animeList, setAnimeList] = useState([]);
	const [adminReviews, setAdminReviews] = useState([]);
	const [successMsg, setSuccessMsg] = useState("");
	
	// Analytics States
	const [metrics, setMetrics] = useState({ 
		totalUsers: 0, totalReviews: 0, activeUsersCount: 0,
		monthlySignups: [], reviewGrowth: [], watchlistStats: {}, genreStats: []
	});

	// Users & Reports States
	const [reportedUsers, setReportedUsers] = useState([]);
	const [userSearchQuery, setUserSearchQuery] = useState("");
	const [searchedUser, setSearchedUser] = useState(null);
	const [userSearchError, setUserSearchError] = useState("");

	// Polls States
	const [polls, setPolls] = useState([]);
	const [isPollModalOpen, setIsPollModalOpen] = useState(false);

	// Discussions States
	const [discussions, setDiscussions] = useState([]);

	/* ================= CHECK ADMIN AUTH ================= */
	useEffect(() => {
		const checkAdmin = async () => {
			const username = localStorage.getItem("username");
			const storedToken = localStorage.getItem("token");
			if (!username || !storedToken) {
				return navigate("/home");
			}
			setToken(storedToken);
			
			try {
				const res = await fetch(`http://localhost:8000/api/users/${username}`, {
					headers: { Authorization: `Bearer ${storedToken}` }
				});
				if (!res.ok) throw new Error("Not Found");
				const data = await res.json();
				if (!data.isAdmin) {
					return navigate("/home");
				}
				setCurrentUser({ ...data, id: data._id });
			} catch (err) {
				navigate("/home");
			}
		};
		checkAdmin();
	}, [navigate]);

	/* ================= FETCH INITIAL DATA ================= */
	useEffect(() => {
		if (token) {
			fetchMetrics();
			fetchAnime();
			fetchAdminReviews();
			fetchReportedUsers();
			fetchPolls();
			fetchDiscussions();
		}
	}, [token]);

	const authHeaders = {
		Authorization: `Bearer ${token}`
	};

	const fetchMetrics = async () => {
		try {
			const res = await fetch("http://localhost:8000/api/users/stats/platform");
			const data = await res.json();
			setMetrics(data);
		} catch (err) {
			console.error(err);
		}
	};

	const fetchAnime = async () => {
		try {
			const res = await fetch("http://localhost:8000/api/anime");
			const data = await res.json();
			setAnimeList(data);
		} catch (err) {
			console.error(err);
		}
	};

	const fetchAdminReviews = async () => {
		try {
			const res = await fetch("http://localhost:8000/api/reviews/recent");
			const data = await res.json();
			setAdminReviews(data);
		} catch (err) {
			console.error(err);
		}
	};

	const fetchReportedUsers = async () => {
		try {
			const res = await fetch("http://localhost:8000/api/users/admin/reported", { headers: authHeaders });
			if (res.ok) {
				const data = await res.json();
				setReportedUsers(data);
			}
		} catch (err) {
			console.error(err);
		}
	};

	const fetchPolls = async () => {
		try {
			const res = await fetch("http://localhost:8000/api/polls");
			const data = await res.json();
			setPolls(data);
		} catch (err) {
			console.error(err);
		}
	};

	const fetchDiscussions = async () => {
		try {
			const res = await fetch("http://localhost:8000/api/discussions");
			const data = await res.json();
			setDiscussions(data);
		} catch (err) {
			console.error(err);
		}
	};

	/* ================= SEARCH JIKAN ================= */
	const handleSearch = async () => {
		try {
			const res = await fetch(`https://api.jikan.moe/v4/anime?q=${search}&limit=5`);
			const data = await res.json();
			setResults(data.data);
		} catch (err) {
			console.error(err);
		}
	};

	/* ================= ADD ANIME ================= */
	const addAnime = async (anime) => {
		try {
			await fetch("http://localhost:8000/api/anime", {
				method: "POST",
				headers: { ...authHeaders, "Content-Type": "application/json" },
				body: JSON.stringify({
					mal_id: anime.mal_id,
					title: anime.title,
					image: anime.images.jpg.image_url,
					synopsis: anime.synopsis,
					score: anime.score,
					year: anime.year,
					genres: anime.genres.map((g) => g.name),
				}),
			});

			fetchAnime();
			setSuccessMsg(`${anime.title} added successfully!`);
			setTimeout(() => setSuccessMsg(""), 3000);
		} catch (err) {
			console.error(err);
		}
	};

	/* ================= DELETE ANIME ================= */
	const deleteAnime = async (id) => {
		try {
			await fetch(`http://localhost:8000/api/anime/${id}`, {
				method: "DELETE",
				headers: authHeaders
			});
			fetchAnime();
		} catch (err) {
			console.error(err);
		}
	};

	/* ================= DELETE REVIEW ================= */
	const deleteReview = async (id) => {
		try {
			await fetch(`http://localhost:8000/api/reviews/${id}`, {
				method: "DELETE",
				headers: authHeaders
			});
			fetchAdminReviews();
		} catch (err) {
			console.error(err);
		}
	};

	/* ================= USER MODERATION ACTIONS ================= */
	const handleUserSearch = async () => {
		if (!userSearchQuery.trim()) return;
		setUserSearchError("");
		setSearchedUser(null);
		try {
			const res = await fetch(`http://localhost:8000/api/users/admin/search/${userSearchQuery.trim()}`, { headers: authHeaders });
			const data = await res.json();
			if (!res.ok) {
				setUserSearchError(data.message || "User not found");
			} else {
				setSearchedUser(data);
			}
		} catch (err) {
			console.error(err);
			setUserSearchError("Server error");
		}
	};

	const handleWarnUser = async (username) => {
		try {
			const res = await fetch(`http://localhost:8000/api/users/admin/${username}/warn`, { method: "POST", headers: authHeaders });
			const data = await res.json();
			alert(data.message);
			if (searchedUser && searchedUser.username === username) handleUserSearch();
			fetchReportedUsers();
		} catch (err) {
			console.error(err);
		}
	};

	const handleBanUser = async (username, durationDays = 0) => {
		try {
			const res = await fetch(`http://localhost:8000/api/users/admin/${username}/ban`, {
				method: "POST",
				headers: { ...authHeaders, "Content-Type": "application/json" },
				body: JSON.stringify({ durationDays })
			});
			const data = await res.json();
			alert(data.message);
			if (searchedUser && searchedUser.username === username) handleUserSearch();
			fetchReportedUsers();
		} catch (err) {
			console.error(err);
		}
	};

	const handleUnbanUser = async (username) => {
		try {
			const res = await fetch(`http://localhost:8000/api/users/admin/${username}/unban`, { method: "POST", headers: authHeaders });
			const data = await res.json();
			alert(data.message);
			if (searchedUser && searchedUser.username === username) handleUserSearch();
			fetchReportedUsers();
		} catch (err) {
			console.error(err);
		}
	};

	const handleDismissReport = async (username, reportId) => {
		try {
			await fetch(`http://localhost:8000/api/users/admin/${username}/reports/${reportId}`, { method: "DELETE", headers: authHeaders });
			fetchReportedUsers();
			if (searchedUser && searchedUser.username === username) handleUserSearch();
		} catch (err) {
			console.error(err);
		}
	};

	/* ================= POLL ACTIONS ================= */
	const handleCreatePoll = async (pollData) => {
		try {
			const res = await fetch("http://localhost:8000/api/polls", {
				method: "POST",
				headers: { ...authHeaders, "Content-Type": "application/json" },
				body: JSON.stringify(pollData)
			});
			const data = await res.json();
			if (res.ok) {
				setPolls([data, ...polls]);
			}
		} catch (err) {
			console.error(err);
		}
	};

	const handleDeletePoll = async (pollId) => {
		if (!window.confirm("Are you sure you want to delete this poll?")) return;
		try {
			await fetch(`http://localhost:8000/api/polls/${pollId}`, {
				method: "DELETE",
				headers: authHeaders
			});
			setPolls(polls.filter(p => p._id !== pollId));
		} catch (err) {
			console.error(err);
		}
	};

	const handleVotePoll = async (pollId, optionIndex) => {
		try {
			const res = await fetch(`http://localhost:8000/api/polls/${pollId}/vote`, {
				method: "POST",
				headers: { ...authHeaders, "Content-Type": "application/json" },
				body: JSON.stringify({ optionIndex })
			});
			if (res.ok) {
				const updatedPoll = await res.json();
				setPolls(polls.map(p => p._id === pollId ? updatedPoll : p));
			}
		} catch (err) {
			console.error(err);
		}
	};

	/* ================= DISCUSSIONS ACTIONS ================= */
	const handleDeleteDiscussion = async (id) => {
		if (!window.confirm("Delete this discussion permanently?")) return;
		try {
			await fetch(`http://localhost:8000/api/discussions/${id}`, {
				method: "DELETE",
				headers: authHeaders
			});
			setDiscussions(discussions.filter(d => d._id !== id));
		} catch (err) {
			console.error(err);
		}
	};

	if (!currentUser) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">Authenticating...</div>;

	return (
		<div className="flex min-h-screen bg-zinc-950 text-white">
			{/* SIDEBAR */}
			<div className="w-64 bg-zinc-900 border-r border-zinc-800 p-6 flex flex-col">
				<h1 className="text-2xl font-bold text-indigo-500 mb-10">
					AniReview Admin
				</h1>

				<nav className="space-y-3 flex-1">
					<button onClick={() => setActiveTab("users")} className={`block w-full text-left px-4 py-2 rounded-lg ${activeTab === "users" ? "bg-indigo-600" : "hover:bg-zinc-800"}`}>Users & Reports</button>
					<button onClick={() => setActiveTab("anime")} className={`block w-full text-left px-4 py-2 rounded-lg ${activeTab === "anime" ? "bg-indigo-600" : "hover:bg-zinc-800"}`}>Manage Anime</button>
					<button onClick={() => setActiveTab("reviews")} className={`block w-full text-left px-4 py-2 rounded-lg ${activeTab === "reviews" ? "bg-indigo-600" : "hover:bg-zinc-800"}`}>Moderate Reviews</button>
					<button onClick={() => setActiveTab("polls")} className={`block w-full text-left px-4 py-2 rounded-lg ${activeTab === "polls" ? "bg-indigo-600" : "hover:bg-zinc-800"}`}>Manage Polls</button>
					<button onClick={() => setActiveTab("discussions")} className={`block w-full text-left px-4 py-2 rounded-lg ${activeTab === "discussions" ? "bg-indigo-600" : "hover:bg-zinc-800"}`}>Manage Discussions</button>
					<button onClick={() => setActiveTab("analytics")} className={`block w-full text-left px-4 py-2 rounded-lg ${activeTab === "analytics" ? "bg-indigo-600" : "hover:bg-zinc-800"}`}>Analytics</button>
				</nav>
				
				<button onClick={() => navigate("/home")} className="mt-4 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded text-center w-full">Back to App</button>
			</div>

			{/* MAIN */}
			<div className="flex-1 p-10 overflow-y-auto">
				{/* HEADER */}
				<div className="flex justify-between items-center mb-10">
					<h2 className="text-3xl font-bold">Admin Dashboard</h2>

					{activeTab === "anime" && (
						<button onClick={() => setShowModal(true)} className="bg-indigo-600 px-5 py-2 rounded-lg hover:bg-indigo-500">+ Add Anime</button>
					)}
					{activeTab === "polls" && (
						<button onClick={() => setIsPollModalOpen(true)} className="bg-indigo-600 px-5 py-2 rounded-lg hover:bg-indigo-500">+ Create Poll</button>
					)}
				</div>

				{/* USERS & REPORTS */}
				{activeTab === "users" && (
					<div className="space-y-6">
						{/* Search & Moderate Specific User */}
						<div className="bg-zinc-900 rounded-xl p-6">
							<h3 className="text-xl font-bold mb-4">Search & Moderate User</h3>
							<div className="flex gap-2 mb-4">
								<input value={userSearchQuery} onChange={(e) => setUserSearchQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleUserSearch()} className="flex-1 p-2 rounded bg-zinc-800 border border-zinc-700 text-white" placeholder="Enter exact username..." />
								<button onClick={handleUserSearch} className="bg-indigo-600 px-6 font-semibold rounded hover:bg-indigo-500 transition">Search</button>
							</div>
							
							{userSearchError && <p className="text-red-500">{userSearchError}</p>}
							
							{searchedUser && (
								<div className="bg-zinc-800 p-4 rounded-lg mt-4 flex items-center gap-6 shadow-lg border border-zinc-700">
									<img src={searchedUser.avatar} className="w-16 h-16 rounded-full border-2 border-indigo-500" alt="avatar" />
									<div className="flex-1">
										<p className="text-xl font-bold text-indigo-400">{searchedUser.username}</p>
										<p className="text-sm text-zinc-300 mt-1">Warnings: <span className="font-bold">{searchedUser.warnings}</span> | Status: <span className={`font-bold ${searchedUser.isBanned ? 'text-red-500' : 'text-green-500'}`}>{searchedUser.isBanned ? `Banned (Expires: ${searchedUser.banExpiresAt ? new Date(searchedUser.banExpiresAt).toLocaleDateString() : 'Permanent'})` : 'Active'}</span></p>
									</div>
									<div className="flex gap-2">
										<button onClick={() => handleWarnUser(searchedUser.username)} className="bg-yellow-600 hover:bg-yellow-500 px-4 py-2 font-medium rounded transition">Warn</button>
										{!searchedUser.isBanned ? (
											<>
												<button onClick={() => handleBanUser(searchedUser.username, 1)} className="bg-red-500 hover:bg-red-400 px-4 py-2 font-medium rounded transition">Ban 1D</button>
												<button onClick={() => handleBanUser(searchedUser.username, 7)} className="bg-red-600 hover:bg-red-500 px-4 py-2 font-medium rounded transition">Ban 7D</button>
												<button onClick={() => handleBanUser(searchedUser.username, 0)} className="bg-red-800 hover:bg-red-700 px-4 py-2 font-medium rounded transition">Perma Ban</button>
											</>
										) : (
											<button onClick={() => handleUnbanUser(searchedUser.username)} className="bg-green-600 hover:bg-green-500 px-4 py-2 font-medium rounded transition">Unban</button>
										)}
									</div>
								</div>
							)}
						</div>

						{/* Reported Users */}
						<div className="bg-zinc-900 rounded-xl p-6">
							<h3 className="text-xl font-bold mb-4 flex items-center gap-2"><span className="text-red-500">⚠</span> Reported Users</h3>
							{reportedUsers.length === 0 ? <p className="text-zinc-500 italic">No active reports. All good!</p> : (
								<div className="space-y-4">
									{reportedUsers.map(user => (
										<div key={user._id} className="bg-zinc-800 p-5 rounded-lg border border-red-900/30">
											<div className="flex justify-between items-center mb-4">
												<div className="flex items-center gap-4">
													<img src={user.avatar} className="w-12 h-12 rounded-full border border-zinc-600" alt="avatar" />
													<div>
														<p className="font-bold text-lg">{user.username}</p>
														<p className="text-xs text-zinc-400">Warnings: <span className="text-yellow-500">{user.warnings}</span> | {user.isBanned ? <span className="text-red-500 font-bold">BANNED</span> : <span className="text-green-500 font-bold">ACTIVE</span>}</p>
													</div>
												</div>
												<div className="flex gap-2">
													<button onClick={() => handleWarnUser(user.username)} className="bg-yellow-600 hover:bg-yellow-500 px-3 py-1 font-medium rounded text-sm transition">Warn</button>
													{!user.isBanned ? (
														<button onClick={() => handleBanUser(user.username, 2)} className="bg-red-600 hover:bg-red-500 px-3 py-1 font-medium rounded text-sm transition">Ban 2D</button>
													) : (
														<button onClick={() => handleUnbanUser(user.username)} className="bg-green-600 hover:bg-green-500 px-3 py-1 font-medium rounded text-sm transition">Unban</button>
													)}
												</div>
											</div>
											<div className="space-y-2 border-t border-zinc-700 pt-3">
												<p className="text-xs text-zinc-400 font-bold uppercase tracking-wider mb-2">Reports ({user.reports.length})</p>
												{user.reports.map(report => (
													<div key={report._id} className="flex justify-between items-start bg-zinc-900 p-3 rounded border border-zinc-800">
														<div className="flex-1">
															<p className="text-sm text-zinc-200">"{report.reason}"</p>
															<p className="text-xs text-zinc-500 mt-1">Reported by: <span className="text-indigo-400">{report.reportedBy?.username || 'Unknown'}</span> on {new Date(report.createdAt).toLocaleDateString()}</p>
														</div>
														<button onClick={() => handleDismissReport(user.username, report._id)} className="text-xs bg-zinc-700 px-3 py-1 ml-4 rounded hover:bg-zinc-600 font-medium transition">Dismiss</button>
													</div>
												))}
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				)}

				{/* MANAGE POLLS */}
				{activeTab === "polls" && (
					<div className="space-y-6">
						<div className="bg-zinc-900 rounded-xl p-6">
							<h3 className="text-xl font-bold mb-6">Manage Community Polls</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{polls.map((poll) => (
									<PollCard 
										key={poll._id}
										poll={poll}
										currentUser={currentUser}
										onVote={handleVotePoll}
										onDelete={handleDeletePoll}
									/>
								))}
							</div>
						</div>
					</div>
				)}

				{/* MANAGE DISCUSSIONS */}
				{activeTab === "discussions" && (
					<div className="bg-zinc-900 rounded-xl p-6">
						<h3 className="text-xl font-bold mb-6">Moderate Discussions</h3>
						<div className="space-y-4">
							{discussions.length === 0 ? <p className="text-zinc-500">No discussions found.</p> : discussions.map((d) => (
								<div key={d._id} className="bg-zinc-800 p-4 rounded-lg flex justify-between items-center gap-4">
									<div className="flex-1">
										<p className="font-bold text-zinc-100">{d.title}</p>
										<p className="text-zinc-400 text-sm line-clamp-2 mt-1">{d.content}</p>
										<p className="text-xs text-zinc-500 mt-2">By <span className="text-indigo-400 font-semibold">{d.author?.username}</span> • {new Date(d.createdAt).toLocaleDateString()} • {d.replies?.length || 0} Replies</p>
									</div>
									<button onClick={() => handleDeleteDiscussion(d._id)} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm transition font-bold shrink-0">Delete Thread</button>
								</div>
							))}
						</div>
					</div>
				)}

				{/* ANALYTICS */}
				{activeTab === "analytics" && (
					<div className="space-y-6">
						{/* Key Metrics */}
						<div className="grid md:grid-cols-4 gap-6">
							<div className="bg-zinc-900 p-6 rounded-xl border-l-4 border-indigo-500">
								<p className="text-zinc-400 text-sm font-bold uppercase tracking-wider">Total Users</p>
								<h3 className="text-4xl font-bold mt-2">{metrics.totalUsers}</h3>
							</div>
							<div className="bg-zinc-900 p-6 rounded-xl border-l-4 border-green-500">
								<p className="text-zinc-400 text-sm font-bold uppercase tracking-wider">Total Anime</p>
								<h3 className="text-4xl font-bold mt-2">{animeList.length}</h3>
							</div>
							<div className="bg-zinc-900 p-6 rounded-xl border-l-4 border-yellow-500">
								<p className="text-zinc-400 text-sm font-bold uppercase tracking-wider">Reviews</p>
								<h3 className="text-4xl font-bold mt-2">{metrics.totalReviews}</h3>
							</div>
							<div className="bg-zinc-900 p-6 rounded-xl border-l-4 border-pink-500">
								<p className="text-zinc-400 text-sm font-bold uppercase tracking-wider">Active Users</p>
								<h3 className="text-4xl font-bold mt-2">{metrics.activeUsersCount}</h3>
							</div>
						</div>

						{/* Charts */}
						<div className="grid md:grid-cols-2 gap-6">
							{/* Monthly Signups */}
							<div className="bg-zinc-900 p-6 rounded-xl">
								<h4 className="text-xl font-bold mb-4">Monthly Signups</h4>
								<div className="h-72">
									<ResponsiveContainer width="100%" height="100%">
										<LineChart data={metrics.monthlySignups || []}>
											<CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" vertical={false} />
											<XAxis dataKey="date" stroke="#a1a1aa" axisLine={false} tickLine={false} />
											<YAxis stroke="#a1a1aa" axisLine={false} tickLine={false} />
											<Tooltip contentStyle={{ backgroundColor: "#18181b", borderColor: "#3f3f46", borderRadius: "8px" }} />
											<Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: "#6366f1" }} activeDot={{ r: 6 }} />
										</LineChart>
									</ResponsiveContainer>
								</div>
							</div>
							{/* Monthly Reviews */}
							<div className="bg-zinc-900 p-6 rounded-xl">
								<h4 className="text-xl font-bold mb-4">Monthly Reviews</h4>
								<div className="h-72">
									<ResponsiveContainer width="100%" height="100%">
										<LineChart data={metrics.reviewGrowth || []}>
											<CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" vertical={false} />
											<XAxis dataKey="date" stroke="#a1a1aa" axisLine={false} tickLine={false} />
											<YAxis stroke="#a1a1aa" axisLine={false} tickLine={false} />
											<Tooltip contentStyle={{ backgroundColor: "#18181b", borderColor: "#3f3f46", borderRadius: "8px" }} />
											<Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: "#10b981" }} activeDot={{ r: 6 }} />
										</LineChart>
									</ResponsiveContainer>
								</div>
							</div>
							{/* Top Genres */}
							<div className="bg-zinc-900 p-6 rounded-xl">
								<h4 className="text-xl font-bold mb-4">Top Genres</h4>
								<div className="h-72">
									<ResponsiveContainer width="100%" height="100%">
										<BarChart data={(metrics.genreStats || []).slice(0, 6)} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
											<CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" vertical={false} />
											<XAxis dataKey="genre" stroke="#a1a1aa" axisLine={false} tickLine={false} />
											<YAxis stroke="#a1a1aa" axisLine={false} tickLine={false} />
											<Tooltip contentStyle={{ backgroundColor: "#18181b", borderColor: "#3f3f46", borderRadius: "8px" }} cursor={{ fill: "#27272a" }} />
											<Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
										</BarChart>
									</ResponsiveContainer>
								</div>
							</div>
							{/* Watchlist Distribution */}
							<div className="bg-zinc-900 p-6 rounded-xl">
								<h4 className="text-xl font-bold mb-4">Watchlist</h4>
								<div className="h-72">
									<ResponsiveContainer width="100%" height="100%">
										<PieChart>
											<Pie
												data={[
													{ name: 'Watching', value: metrics.watchlistStats?.Watching || 0 },
													{ name: 'Completed', value: metrics.watchlistStats?.Completed || 0 },
													{ name: 'On-Hold', value: metrics.watchlistStats?.['On-Hold'] || 0 },
													{ name: 'Dropped', value: metrics.watchlistStats?.Dropped || 0 },
													{ name: 'Plan to Watch', value: metrics.watchlistStats?.['Plan to Watch'] || 0 },
												].filter(item => item.value > 0)}
												cx="50%"
												cy="50%"
												innerRadius={70}
												outerRadius={100}
												paddingAngle={3}
												dataKey="value"
											>
												<Cell fill="#3b82f6" /><Cell fill="#10b981" /><Cell fill="#f59e0b" /><Cell fill="#ef4444" /><Cell fill="#8b5cf6" />
											</Pie>
											<Tooltip contentStyle={{ backgroundColor: "#18181b", borderColor: "#3f3f46", borderRadius: "8px" }} />
											<Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: "#a1a1aa" }} />
										</PieChart>
									</ResponsiveContainer>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* MANAGE ANIME */}
				{activeTab === "anime" && (
					<div className="bg-zinc-900 rounded-xl p-6">
						<h3 className="text-xl font-bold mb-6">Manage Anime</h3>
						<table className="w-full text-sm">
							<thead className="text-zinc-400 border-b border-zinc-700">
								<tr>
									<th className="text-left py-3">Title</th><th className="text-left">Year</th><th className="text-left">Rating</th><th className="text-left">Actions</th>
								</tr>
							</thead>
							<tbody>
								{animeList.map((anime) => (
									<tr key={anime._id} className="border-b border-zinc-800">
										<td className="py-4">{anime.title}</td><td>{anime.year || "N/A"}</td><td>{anime.score || "N/A"}</td>
										<td><button onClick={() => deleteAnime(anime._id)} className="px-3 py-1 bg-red-600 rounded">Delete</button></td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				{/* REVIEWS */}
				{activeTab === "reviews" && (
					<div className="bg-zinc-900 rounded-xl p-6">
						<h3 className="text-xl font-bold mb-6">Moderate Reviews</h3>
						<div className="space-y-4">
							{adminReviews.length === 0 ? <p className="text-zinc-500">No reviews found to moderate.</p> : adminReviews.map((r) => (
								<div key={r._id} className="bg-zinc-800 p-4 rounded-lg flex justify-between items-center gap-4">
									<div className="flex-1">
										<p className="text-zinc-300 italic">"{r.text}"</p>
										<p className="text-xs text-zinc-500 mt-2">By {r.username} • {r.animeTitle} • Score: {r.score}</p>
									</div>
									<button onClick={() => deleteReview(r._id)} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition font-medium">Delete</button>
								</div>
							))}
						</div>
					</div>
				)}
			</div>

			{/* ANIME MODAL */}
			{showModal && (
				<div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
					<div className="bg-zinc-900 p-6 rounded-xl w-full max-w-2xl">
						<h2 className="text-xl mb-4">Search Anime</h2>
						{successMsg && <div className="bg-green-600/20 border border-green-500 text-green-400 px-4 py-2 rounded mb-4">{successMsg}</div>}
						<div className="flex gap-2 mb-4">
							<input value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 p-2 rounded bg-zinc-800 text-white" placeholder="Search anime..." />
							<button onClick={handleSearch} className="bg-indigo-600 px-4 rounded">Search</button>
						</div>
						<div className="space-y-3 max-h-80 overflow-y-auto pr-2">
							{results.map((a) => (
								<div key={a.mal_id} className="flex items-center gap-3 bg-zinc-800 p-2 rounded">
									<img src={a.images.jpg.image_url} className="w-14 h-20 object-cover" alt={a.title} />
									<div className="flex-1">
										<p className="font-bold">{a.title}</p>
										<p className="text-sm text-zinc-400">{a.year || "N/A"} • ⭐ {a.score || "N/A"}</p>
									</div>
									<button onClick={() => addAnime(a)} className="bg-green-600 px-3 py-1 rounded">Add</button>
								</div>
							))}
						</div>
						<button onClick={() => setShowModal(false)} className="mt-4 bg-red-600 px-4 py-2 rounded">Close</button>
					</div>
				</div>
			)}
			
			<CreatePollModal isOpen={isPollModalOpen} onClose={() => setIsPollModalOpen(false)} onCreate={handleCreatePoll} currentUser={currentUser} />
		</div>
	);
}
