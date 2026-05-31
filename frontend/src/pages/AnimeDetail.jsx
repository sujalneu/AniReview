import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { getAnimeById } from "../api/jikan";
import ReactMarkdown from "react-markdown";

const ANIME_GIFS = [
	// Action
	{ id: "naruto-rasengan", name: "Naruto Rasengan", category: "Action", url: "/gifs/naruto-rasengan.gif" },
	{ id: "gojo-domain", name: "Gojo Domain Expansion", category: "Action", url: "/gifs/gojo-domain.gif" },
	{ id: "eren-fight", name: "Eren Titan Fight", category: "Action", url: "/gifs/eren-fight.gif" },
	{ id: "goku-transform", name: "Goku Super Saiyan", category: "Action", url: "/gifs/goku-transform.gif" },
	{ id: "deku-smash", name: "Deku Detroit Smash", category: "Action", url: "/gifs/deku-smash.gif" },
	{ id: "killua-lightning", name: "Killua Godspeed", category: "Action", url: "/gifs/killua-lightning.gif" },
	{ id: "zenitsu-thunder", name: "Zenitsu Thunder Breathing", category: "Action", url: "/gifs/zenitsu-thunder.gif" },
	{ id: "tanjiro-water", name: "Tanjiro Water Breathing", category: "Action", url: "/gifs/tanjiro-water.gif" },
	{ id: "luffy-gear5", name: "Luffy Gear 5", category: "Action", url: "/gifs/luffy-gear5.gif" },
	{ id: "itachi-susanoo", name: "Itachi Susanoo", category: "Action", url: "/gifs/itachi-susanoo.gif" },
	{ id: "levi-spin", name: "Levi Survey Corps", category: "Action", url: "/gifs/levi-spin.gif" },
	{ id: "l-think", name: "L Thinking Death Note", category: "Action", url: "/gifs/l-think.gif" },
	// Happy
	{ id: "luffy-laugh", name: "Luffy Laugh", category: "Happy", url: "/gifs/luffy-laugh.gif" },
	{ id: "hinata-jump", name: "Hinata Jump Spike", category: "Happy", url: "/gifs/hinata-jump.gif" },
	{ id: "nezuko-dance", name: "Nezuko Happy Dance", category: "Happy", url: "/gifs/nezuko-dance.gif" },
	{ id: "power-happy", name: "Power Excited Chainsaw Man", category: "Happy", url: "/gifs/power-happy.gif" },
	{ id: "miku-dance", name: "Hatsune Miku Dance", category: "Happy", url: "/gifs/miku-dance.gif" },
	{ id: "rem-smile", name: "Rem Re:Zero Smile", category: "Happy", url: "/gifs/rem-smile.gif" },
	{ id: "chopper-dance", name: "Chopper Dance", category: "Happy", url: "/gifs/chopper-dance.gif" },
	// Funny
	{ id: "anya-smug", name: "Anya Smug Face", category: "Funny", url: "/gifs/anya-smug.gif" },
	{ id: "saitama-ok", name: "Saitama OK", category: "Funny", url: "/gifs/saitama-ok.gif" },
	{ id: "spirited-noface", name: "No Face Spirited Away", category: "Funny", url: "/gifs/spirited-noface.gif" },
	// Smart
	{ id: "lelouch-plan", name: "Lelouch Code Geass", category: "Smart", url: "/gifs/lelouch-plan.gif" },
	{ id: "light-laugh", name: "Light Yagami Death Note", category: "Smart", url: "/gifs/light-laugh.gif" },
	{ id: "shikamaru-think", name: "Shikamaru Thinking", category: "Smart", url: "/gifs/shikamaru-think.gif" },
	// Sad
	{ id: "violet-cry", name: "Violet Evergarden Crying", category: "Sad", url: "/gifs/violet-cry.gif" },
	// Wholesome
	{ id: "sailor-moon", name: "Sailor Moon Transform", category: "Wholesome", url: "/gifs/sailor-moon.gif" },
	{ id: "totoro-wave", name: "Totoro Waving", category: "Wholesome", url: "/gifs/totoro-wave.gif" },
	{ id: "ponyo-run", name: "Ponyo Running", category: "Wholesome", url: "/gifs/ponyo-run.gif" },
	{ id: "kiki-fly", name: "Kiki Delivery Service", category: "Wholesome", url: "/gifs/kiki-fly.gif" },
];

export default function AnimeDetail() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [anime, setAnime] = useState(null);
	const [recommendations, setRecommendations] = useState([]);
	const [personalRecs, setPersonalRecs] = useState([]);
	const recScrollRef = useRef();
	const [showReviewModal, setShowReviewModal] = useState(false);
	const [showTrailerModal, setShowTrailerModal] = useState(false);
	const [reviewText, setReviewText] = useState("");
	const [reviewScore, setReviewScore] = useState("");
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const [showGifInput, setShowGifInput] = useState(false);
	const [gifUrl, setGifUrl] = useState("");
	const [gifSearch, setGifSearch] = useState("");
	const [selectedGifCategory, setSelectedGifCategory] = useState("All");

	const [reviews, setReviews] = useState([]);
	const [replyText, setReplyText] = useState({});
	const [showReplyInput, setShowReplyInput] = useState({});
	const [watchlistStatus, setWatchlistStatus] = useState(null);
	const [hoverScore, setHoverScore] = useState(0);

	const filteredGifs = ANIME_GIFS.filter(gif => {
		const matchesCategory = selectedGifCategory === "All" || gif.category === selectedGifCategory;
		const matchesSearch = gif.name.toLowerCase().includes(gifSearch.toLowerCase()) || gif.category.toLowerCase().includes(gifSearch.toLowerCase());
		return matchesCategory && matchesSearch;
	});

	const checkAuth = () => {
		const token = localStorage.getItem("token");
		const username = localStorage.getItem("username");
		if (!token || !username || username === "Guest") {
			alert("Please log in or register to perform this action!");
			navigate("/auth");
			return false;
		}
		return true;
	};

	const WATCH_STATUSES = [
		"Watching",
		"Completed",
		"Dropped",
		"On-Hold",
		"Plan to Watch",
	];

	const fetchReviews = async () => {
		try {
			const res = await fetch(`http://localhost:8000/api/reviews/anime/${id}`);
			const data = await res.json();
			setReviews(data);
		} catch (err) {
			console.error(err);
		}
	};

	const handleEditClick = (review) => {
		setReviewText(review.text);
		setReviewScore(review.score);
		setEditReviewId(review._id);
		setShowReviewModal(true);
	};

	const handleUpdateReview = async () => {
		try {
			await fetch(`http://localhost:8000/api/reviews/${editReviewId}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					username: currentUsername,
					text: reviewText,
					score: Number(reviewScore) * 2 || 0,
				}),
			});
			setShowReviewModal(false);
			setEditReviewId(null);
			setReviewText("");
			setReviewScore("");
			fetchReviews();
		} catch (err) {
			console.error(err);
		}
	};

	const handleDeleteReview = async (reviewId) => {
		if (!window.confirm("Are you sure you want to delete your review?")) return;
		try {
			const token = localStorage.getItem("token");
			await fetch(`http://localhost:8000/api/reviews/${reviewId}`, {
				method: "DELETE",
				headers: { 
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`
				},
				body: JSON.stringify({ username: currentUsername }),
			});
			fetchReviews();
		} catch (err) {
			console.error(err);
		}
	};

	const [editingReplyId, setEditingReplyId] = useState(null);
	const [editingReplyText, setEditingReplyText] = useState("");

	const handleEditReplyClick = (reply) => {
		setEditingReplyId(reply._id || reply.id);
		setEditingReplyText(reply.text);
	};

	const handleUpdateReply = async (reviewId, replyId) => {
		if (!editingReplyText.trim()) return;
		try {
			await fetch(`http://localhost:8000/api/reviews/${reviewId}/replies/${replyId}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username: currentUsername, text: editingReplyText }),
			});
			setEditingReplyId(null);
			setEditingReplyText("");
			fetchReviews();
		} catch (err) {
			console.error(err);
		}
	};

	const handleDeleteReply = async (reviewId, replyId) => {
		if (!window.confirm("Are you sure you want to delete your reply?")) return;
		try {
			await fetch(`http://localhost:8000/api/reviews/${reviewId}/replies/${replyId}`, {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username: currentUsername }),
			});
			fetchReviews();
		} catch (err) {
			console.error(err);
		}
	};

	const currentUsername = localStorage.getItem("username") || "Guest";
	const userReview = reviews.find((r) => r.username === currentUsername);
	const [editReviewId, setEditReviewId] = useState(null);

	useEffect(() => {
		async function load() {
			const data = await getAnimeById(id);
			setAnime(data);
		}
		async function fetchRecommendations() {
			try {
				const res = await fetch(`https://api.jikan.moe/v4/anime/${id}/recommendations`);
				const data = await res.json();
				if (data.data) {
					setRecommendations(data.data.slice(0, 10).map(r => r.entry));
				}
			} catch (err) {
				console.error("Failed fetching recommendations:", err);
			}
		}
		async function fetchPersonalRecs() {
			const token = localStorage.getItem("token");
			const isGuest = localStorage.getItem("isGuest") === "true";
			if (!token || isGuest) return;

			try {
				const res = await fetch("http://localhost:8000/api/users/recommendations/personalized", {
					headers: { Authorization: `Bearer ${token}` }
				});
				if (res.ok) {
					const data = await res.json();
					setPersonalRecs(data.filter(a => String(a.mal_id) !== String(id)));
				}
			} catch (err) {
				console.error("Failed fetching personalized recommendations:", err);
			}
		}
		load();
		fetchReviews();
		fetchRecommendations();
		fetchPersonalRecs();
		window.scrollTo(0, 0); // Reset scroll position when jumping to new anime
	}, [id]);

	const handleAddReview = async () => {
		try {
			const username = localStorage.getItem("username") || "Guest";
			const res = await fetch("http://localhost:8000/api/reviews", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					animeId: id,
					animeTitle: anime.title,
					animeImage: anime.images?.jpg?.image_url || "",
					username,
					text: reviewText,
					score: Number(reviewScore) * 2 || 0,
				}),
			});
			const data = await res.json();
			setShowReviewModal(false);
			setReviewText("");
			setReviewScore("");
			setShowEmojiPicker(false);
			setShowGifInput(false);
			setGifUrl("");
			fetchReviews();
			// Show points popup
			if (data.pointsEarned > 0) {
				setTimeout(() => {
					window.dispatchEvent(new CustomEvent("show-points-popup", {
						detail: { points: data.pointsEarned, reason: data.reason || "Posted an anime review!" }
					}));
				}, 300);
			}
		} catch (err) {
			console.error(err);
		}
	};

	const handleLike = async (reviewId) => {
		if (!checkAuth()) return;
		try {
			const username = localStorage.getItem("username") || "Guest";
			await fetch(`http://localhost:8000/api/reviews/${reviewId}/like`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username }),
			});
			fetchReviews();
		} catch (err) {
			console.error(err);
		}
	};

	const handleDislike = async (reviewId) => {
		if (!checkAuth()) return;
		try {
			const username = localStorage.getItem("username") || "Guest";
			await fetch(`http://localhost:8000/api/reviews/${reviewId}/dislike`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username }),
			});
			fetchReviews();
		} catch (err) {
			console.error(err);
		}
	};

	const handleAddReply = async (reviewId) => {
		if (!replyText[reviewId]) return;
		try {
			const username = localStorage.getItem("username") || "Guest";
			await fetch(`http://localhost:8000/api/reviews/${reviewId}/reply`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username, text: replyText[reviewId] }),
			});
			setReplyText((prev) => ({ ...prev, [reviewId]: "" }));
			setShowReplyInput((prev) => ({ ...prev, [reviewId]: false }));
			fetchReviews();
		} catch (err) {
			console.error(err);
		}
	};

	const handleWatchlistChange = async (e) => {
		const status = e.target.value;
		if (!status) return;
		try {
			const username = localStorage.getItem("username");
			if (!username) return alert("Please log in first before adding to watchlist!");
			const res = await fetch(`http://localhost:8000/api/users/${username}/watchlist`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					animeId: id,
					title: anime.title,
					image: anime.images?.jpg?.image_url || anime.images?.jpg?.large_image_url || "",
					status
				})
			});
			if (res.ok) {
				setWatchlistStatus(status);
				alert(`Added to ${status}!`);
			}
		} catch (err) {
			console.error("Watchlist error", err);
		}
	}

	if (!anime) return <div className="p-10 text-white">Loading...</div>;

	return (
		<div className="min-h-screen bg-zinc-950 text-white px-6 py-12 mx-auto relative">
			<div className="flex flex-col md:flex-row gap-10 mb-12">
				{/* Cover Image */}
				<img
					src={anime.images.jpg.large_image_url || anime.images.jpg.image_url}
					alt={anime.title}
					className="w-full md:w-80 rounded-xl border border-zinc-800 shadow-lg object-cover"
				/>

				{/* Details */}
				<div className="flex-1 flex flex-col gap-6">
					{/* Title + Rating */}
					<div>
						<h1 className="text-4xl font-bold text-indigo-400">{anime.title}</h1>
						<p className="text-yellow-400 text-lg mt-2 font-semibold">
							⭐ {anime.score || ""} ({anime.scored_by?.toLocaleString() || "N/A"}{" "}
							votes)
						</p>

						{/* Genres */}
						<div className="flex flex-wrap gap-2 mt-3">
							{anime.genres?.map((g) => (
								<span
									key={g.mal_id}
									className="bg-indigo-700 text-indigo-100 px-3 py-1 rounded-full text-xs font-medium"
								>
									{g.name}
								</span>
							))}
						</div>
					</div>

					{/* Synopsis */}
					<p className="text-zinc-300 text-sm md:text-base leading-relaxed">
						{anime.synopsis || "No synopsis available."}
					</p>

					{/* Stats Card */}
					<div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 grid grid-cols-2 md:grid-cols-3 gap-4 text-zinc-400 text-sm">
						<p> Release: {anime.aired?.string || "TBA"}</p>
						<p> Episodes: {anime.episodes || "N/A"}</p>
						<p>Studio: {anime.studios?.map((s) => s.name).join(", ") || "N/A"}</p>
						<p>Genre: {anime.genres?.map((g) => g.name).join(", ") || "N/A"}</p>
						<p> Rank: #{anime.rank || "N/A"}</p>
						<p> Popularity: #{anime.popularity || "N/A"}</p>
					</div>

					{/* Actions */}
					<div className="mt-4 flex flex-wrap gap-4 items-center">
						{!userReview && (
							<button
								onClick={() => {
									if (!checkAuth()) return;
									setEditReviewId(null);
									setReviewText("");
									setReviewScore("");
									setShowReviewModal(true);
								}}
								className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg font-semibold transition w-max mt-auto cursor-pointer"
							>
								Write Review
							</button>
						)}

						<select
							className="bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg px-4 py-3 cursor-pointer outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
							value={watchlistStatus || ""}
							onChange={handleWatchlistChange}
						>
							<option value="" disabled>+ Add to List</option>
							{WATCH_STATUSES.map(status => (
								<option key={status} value={status}>{status}</option>
							))}
						</select>

						{anime.trailer && anime.trailer.embed_url && (
							<button
								onClick={() => setShowTrailerModal(true)}
								className="bg-zinc-800 hover:bg-zinc-700 px-6 py-3 rounded-lg font-semibold border border-zinc-700 transition w-max mt-auto cursor-pointer flex items-center gap-2"
							>
								<i className="ri-play-circle-line text-xl text-red-500"></i> Watch Trailer
							</button>
						)}
					</div>
				</div>
			</div>

			{/* RECOMMENDATIONS SECTION */}
			{recommendations.length > 0 && (
				<div className="max-w-7xl mx-auto border-t border-zinc-800 pt-10 mt-10 relative group">
					<h2 className="text-2xl font-bold mb-6 text-zinc-100">Similar Anime That You May Like</h2>

					{/* LEFT ARROW */}
					<button
						onClick={() => recScrollRef.current.scrollBy({ left: -300, behavior: "smooth" })}
						className="absolute left-2 top-[60%] z-10 bg-black/60 hover:bg-black/80 px-2 py-1 rounded-full cursor-pointer text-white transition hover:scale-110 opacity-0 group-hover:opacity-100"
					>
						<i className="ri-arrow-left-s-line text-lg"></i>
					</button>

					{/* RIGHT ARROW */}
					<button
						onClick={() => recScrollRef.current.scrollBy({ left: 300, behavior: "smooth" })}
						className="absolute right-2 top-[60%] z-10 bg-black/60 hover:bg-black/80 px-2 py-1 rounded-full cursor-pointer text-white transition hover:scale-110 opacity-0 group-hover:opacity-100"
					>
						<i className="ri-arrow-right-s-line text-lg"></i>
					</button>

					<div
						ref={recScrollRef}
						className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar pb-4"
					>
						{recommendations.map(entry => (
							<div
								key={entry.mal_id}
								onClick={() => navigate(`/anime/${entry.mal_id}`)}
								className="w-48 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:scale-105 shrink-0 transition flex flex-col cursor-pointer"
							>
								<img
									src={entry.images?.jpg?.large_image_url || entry.images?.jpg?.image_url}
									alt={entry.title}
									className="w-full h-64 object-cover"
								/>
								<div className="p-3 text-center">
									<h3 className="font-semibold text-sm line-clamp-2" title={entry.title}>{entry.title}</h3>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* PERSONALIZED RECOMMENDATIONS SECTION */}
			{personalRecs.length > 0 && (
				<div className="max-w-7xl mx-auto border-t border-zinc-800 pt-10 mt-10 relative group">
					<h2 className="text-2xl font-bold mb-6 text-zinc-100 flex items-center gap-2">
						<i className="ri-magic-line text-indigo-400"></i> Recommended For You
					</h2>

					<div
						className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar pb-4"
					>
						{personalRecs.map(entry => (
							<div
								key={entry.mal_id}
								onClick={() => navigate(`/anime/${entry.mal_id}`)}
								className="w-48 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:scale-105 shrink-0 transition flex flex-col cursor-pointer"
							>
								<img
									src={entry.image}
									alt={entry.title}
									className="w-full h-64 object-cover"
								/>
								<div className="p-3 text-center flex-1 flex flex-col justify-between">
									<h3 className="font-semibold text-sm line-clamp-2 text-zinc-200" title={entry.title}>{entry.title}</h3>
									<span className="text-[9px] text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-full mt-2 font-medium truncate block">
										{entry.reason}
									</span>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* REVIEWS SECTION */}
			<div className="max-w-4xl border-t border-zinc-800 pt-10 mt-10">
				<h2 className="text-2xl font-bold mb-6 text-zinc-100">User Reviews ({reviews.length})</h2>

				{reviews.length === 0 ? (
					<p className="text-zinc-500">No reviews yet. Be the first to review!</p>
				) : (
					<div className="space-y-6">
						{reviews.map((rev) => (
							<div key={rev._id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
								<div className="flex justify-between items-start mb-4">
									<div>
										<p className="font-bold text-indigo-400">{rev.username}</p>
										<p className="text-xs text-zinc-500">{new Date(rev.createdAt).toLocaleString()}</p>
									</div>
									<div className="flex items-center gap-1">
										<div className="flex text-lg">
											{[...Array(5)].map((_, i) => (
												<span key={i} className={i < Math.round(rev.score / 2) ? "" : "opacity-20 grayscale"}>⭐</span>
											))}
										</div>
										<span className="text-zinc-500 text-xs ml-1">({rev.score}/10)</span>
									</div>
								</div>

								<div className="text-zinc-300 leading-relaxed text-sm prose-markdown">
									<ReactMarkdown
										components={{
											p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
											ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-2" {...props} />,
											ol: ({ node, ...props }) => <ol className="list-decimal pl-5 my-2" {...props} />,
											li: ({ node, ...props }) => <li className="mb-1" {...props} />,
											img: ({ node, src, alt, ...props }) => <img src={src} alt={alt} className="rounded-xl max-w-full md:max-w-sm max-h-72 object-contain mt-3 mb-1 border border-zinc-700 shadow-lg block" />
										}}
									>
										{rev.text}
									</ReactMarkdown>
								</div>

								{/* Actions */}
								<div className="flex items-center gap-4 mt-4 pt-4 border-t border-zinc-800">
									<button onClick={() => handleLike(rev._id)} className="flex items-center gap-1 text-sm text-zinc-400 hover:text-green-400 transition cursor-pointer">
										<i className="ri-thumb-up-line hover:ri-thumb-up-fill text-green-400 mr-1"></i> {rev.likes?.length || 0}
									</button>
									<button onClick={() => handleDislike(rev._id)} className="flex items-center gap-1 text-sm text-zinc-400 hover:text-red-400 transition cursor-pointer">
										<i className="ri-thumb-down-line hover:ri-thumb-down-fill text-red-400 mr-1"></i> {rev.dislikes?.length || 0}
									</button>
									<button
										onClick={() => {
											if (!checkAuth()) return;
											setShowReplyInput(prev => ({ ...prev, [rev._id]: !prev[rev._id] }));
										}}
										className="text-sm text-indigo-400 hover:text-indigo-300 transition cursor-pointer"
									>
										Reply
									</button>

									{rev.username === currentUsername && (
										<div className="ml-auto flex gap-3">
											<button
												onClick={() => handleEditClick(rev)}
												className="text-sm text-blue-400 hover:text-blue-300 transition cursor-pointer"
											>
												Edit
											</button>
											<button
												onClick={() => handleDeleteReview(rev._id)}
												className="text-sm text-red-400 hover:text-red-300 transition cursor-pointer"
											>
												Delete
											</button>
										</div>
									)}
								</div>

								{/* Replies */}
								{rev.replies?.length > 0 && (
									<div className="mt-4 pl-4 border-l-2 border-zinc-800 space-y-3">
										{rev.replies.map((reply, i) => (
											<div key={reply._id || i} className="bg-zinc-800/50 p-3 rounded-xl">
												<div className="flex justify-between items-baseline mb-1">
													<p className="text-sm font-semibold text-zinc-300">{reply.username}</p>
													<p className="text-xs text-zinc-500">{new Date(reply.createdAt).toLocaleDateString()}</p>
												</div>
												{editingReplyId === (reply._id || reply.id) ? (
													<div className="space-y-2 mt-2">
														<input
															type="text"
															value={editingReplyText}
															onChange={(e) => setEditingReplyText(e.target.value)}
															className="w-full bg-zinc-705 border border-zinc-650 text-white text-sm px-3 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-zinc-700"
														/>
														<div className="flex gap-2">
															<button
																onClick={() => handleUpdateReply(rev._id, reply._id || reply.id)}
																className="text-xs bg-indigo-650 hover:bg-indigo-600 text-white px-2 py-1 rounded transition cursor-pointer font-semibold bg-indigo-600"
															>
																Save
															</button>
															<button
																onClick={() => setEditingReplyId(null)}
																className="text-xs bg-zinc-700 hover:bg-zinc-600 text-zinc-300 px-2 py-1 rounded transition cursor-pointer"
															>
																Cancel
															</button>
														</div>
													</div>
												) : (
													<>
														<div className="text-sm text-zinc-400 prose-markdown">
															<ReactMarkdown
																components={{
																	p: ({ node, ...props }) => <p className="mb-1 last:mb-0" {...props} />,
																	ul: ({ node, ...props }) => <ul className="list-disc pl-4 my-1" {...props} />,
																	ol: ({ node, ...props }) => <ol className="list-decimal pl-4 my-1" {...props} />,
																}}
															>
																{reply.text}
															</ReactMarkdown>
														</div>
														{reply.username === currentUsername && (
															<div className="flex gap-3 mt-1.5 justify-end">
																<button
																	onClick={() => handleEditReplyClick(reply)}
																	className="text-xs text-blue-400 hover:text-blue-300 transition cursor-pointer font-medium"
																>
																	Edit
																</button>
																<button
																	onClick={() => handleDeleteReply(rev._id, reply._id || reply.id)}
																	className="text-xs text-red-400 hover:text-red-300 transition cursor-pointer font-medium"
																>
																	Delete
																</button>
															</div>
														)}
													</>
												)}
											</div>
										))}
									</div>
								)}

								{/* Reply Input */}
								{showReplyInput[rev._id] && (
									<div className="mt-4 flex gap-2">
										<input
											type="text"
											placeholder="Write a reply..."
											className="flex-1 bg-zinc-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 text-zinc-100"
											value={replyText[rev._id] || ""}
											onChange={(e) => setReplyText(prev => ({ ...prev, [rev._id]: e.target.value }))}
										/>
										<button
											onClick={() => handleAddReply(rev._id)}
											className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer"
										>
											Send
										</button>
									</div>
								)}
							</div>
						))}
					</div>
				)}
			</div>

			{/* Review Modal */}
			{showReviewModal && (
				<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
					<div className="bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-4xl flex flex-col md:flex-row overflow-hidden animate-fadeIn">
						{/* Left: Anime Cover */}
						<div className="md:w-1/3 bg-zinc-800 flex items-center justify-center">
							<img
								src={
									anime.images.jpg.large_image_url || anime.images.jpg.image_url
								}
								alt={anime.title}
								className="w-full h-full object-cover"
							/>
						</div>

						{/* Right: Review Form */}
						<div className="md:w-2/3 p-8 flex flex-col justify-between relative">
							{/* Close Button */}
							<button
								onClick={() => setShowReviewModal(false)}
								className="absolute top-6 right-6 text-zinc-400 hover:text-white transition text-2xl font-bold"
							>
								&times;
							</button>

							<div className="flex flex-col gap-3">
								<h2 className="text-3xl font-bold text-indigo-400 mb-2">
									{anime.title}
								</h2>
								<p className="text-zinc-300 text-sm mb-2">
									Write your review below and rate this anime.
								</p>

								{/* Toolbar */}
								<div className="flex flex-wrap gap-2 mb-2 relative">
									<button
										type="button"
										title="Bold"
										className="px-3 py-1 rounded-md bg-zinc-700 hover:bg-zinc-600 transition cursor-pointer"
										onClick={() => setReviewText((prev) => prev + "**bold**")}
									>
										<b>B</b>
									</button>

									<button
										type="button"
										title="Italic"
										className="px-3 py-1 rounded-md bg-zinc-700 hover:bg-zinc-600 transition cursor-pointer"
										onClick={() => setReviewText((prev) => prev + "*italic*")}
									>
										<i>I</i>
									</button>

									<button
										type="button"
										title="Ordered List"
										className="px-3 py-1 rounded-md bg-zinc-700 hover:bg-zinc-600 transition cursor-pointer"
										onClick={() =>
											setReviewText((prev) => prev + "\n1. item\n2. item\n")
										}
									>
										1.
									</button>

									<button
										type="button"
										title="Unordered List"
										className="px-3 py-1 rounded-md bg-zinc-700 hover:bg-zinc-600 transition cursor-pointer"
										onClick={() =>
											setReviewText((prev) => prev + "\n- item\n- item\n")
										}
									>
										•
									</button>

									{/* Emoji Button */}
									<button
										type="button"
										title="Emoji"
										className={`px-3 py-1 rounded-md transition cursor-pointer ${showEmojiPicker ? 'bg-indigo-600' : 'bg-zinc-700 hover:bg-zinc-600'}`}
										onClick={() => { setShowEmojiPicker(p => !p); setShowGifInput(false); }}
									>
										😊
									</button>

									{/* GIF Button */}
									<button
										type="button"
										title="Insert GIF"
										className={`px-3 py-1 rounded-md text-xs font-bold transition cursor-pointer ${showGifInput ? 'bg-indigo-600 text-white' : 'bg-zinc-700 hover:bg-zinc-600 text-zinc-300'}`}
										onClick={() => { setShowGifInput(p => !p); setShowEmojiPicker(false); }}
									>
										GIF
									</button>
								</div>

								{/* Emoji Picker */}
								{showEmojiPicker && (
									<div className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 mb-2 flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
										{['(◕‿◕✿)', '(〃▽〃)', '＼(≧▽≦)／', '(≧◡≦)', '(★ω★)', '(✿◠‿◠)', '(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧', '(ಥ﹏ಥ)', '(T_T)', '(＠_＠)', '(•̀_•́)', '(╬ Ò﹏Ó)', '(；⌣̀_⌣́)', '(─‿─)', '(¬_¬)', '(o_O)', '(⊃｡•́‿•̀｡)⊃', '(⊙_⊙)', '(p_-)', '(^_<)～☆', '(o^ ^o)', '(•‿•)', '(─_─)', '(⊙﹏⊙)', '(っ˘ڡ˘ς)', '(っ˘̩╭╮˘̩)っ', '(;ﾟдﾟ)', '(*^ω^*)', '(*_*)', '(^_-)', '(｀▽´)', '(￣_￣)', '(￣﹃￣)'].map(emoji => (
											<button
												key={emoji}
												type="button"
												className="text-sm hover:bg-zinc-700 rounded-lg px-2 py-1 transition cursor-pointer text-zinc-300 hover:text-white"
												onClick={() => {
													setReviewText(prev => prev + ' ' + emoji + ' ');
												}}
											>
												{emoji}
											</button>
										))}
									</div>
								)}

								{/* GIF Input */}
								{/* GIF Selector Panel */}
								{showGifInput && (
									<div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-4 mb-3 space-y-3">
										{/* Search Bar */}
										<div className="flex gap-2">
											<div className="relative flex-1">
												<i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"></i>
												<input
													type="text"
													placeholder="Search website anime GIFs..."
													value={gifSearch}
													onChange={e => setGifSearch(e.target.value)}
													className="w-full pl-9 pr-4 py-2 bg-zinc-700 border border-zinc-600 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-zinc-500"
												/>
											</div>
											{gifSearch && (
												<button
													onClick={() => setGifSearch("")}
													className="px-3 py-2 bg-zinc-700 hover:bg-zinc-650 text-zinc-400 hover:text-white rounded-xl text-sm transition"
												>
													Clear
												</button>
											)}
										</div>

										{/* Category Filters */}
										<div className="flex flex-wrap gap-1.5 pb-1 border-b border-zinc-700/60">
											{["All", "Action", "Happy", "Funny", "Smart", "Sad", "Wholesome"].map(category => (
												<button
													key={category}
													type="button"
													onClick={() => setSelectedGifCategory(category)}
													className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
														selectedGifCategory === category
															? "bg-indigo-600 text-white"
															: "bg-zinc-700 text-zinc-400 hover:bg-zinc-600 hover:text-zinc-200"
													}`}
												>
													{category}
												</button>
											))}
										</div>

										{/* Grid of GIFs */}
										<div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto pr-1">
											{filteredGifs.length === 0 ? (
												<div className="col-span-full py-8 text-center text-zinc-500 text-sm italic">
													No GIFs match your search. Try a different keyword or category!
												</div>
											) : (
												filteredGifs.map(gif => (
													<div
														key={gif.id}
														onClick={() => {
															setReviewText(prev => prev + `\n![${gif.name}](${gif.url})\n`);
															setShowGifInput(false);
															setGifSearch("");
															setSelectedGifCategory("All");
														}}
														className="group relative h-28 bg-zinc-950 rounded-xl border border-zinc-700 overflow-hidden cursor-pointer hover:border-indigo-500 hover:shadow-indigo-500/20 hover:shadow-lg transition duration-300 shadow-md"
														title={`Click to insert ${gif.name}`}
													>
														<img
															src={gif.url}
															alt={gif.name}
															className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
															loading="lazy"
															referrerPolicy="no-referrer"
														/>
														{/* Overlay with Name */}
														<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-1.5">
															<span className="text-[9px] font-bold text-white truncate w-full">
																{gif.name}
															</span>
														</div>
														<span className="absolute top-1 right-1 bg-zinc-900/80 backdrop-blur-md text-[8px] text-zinc-400 font-semibold px-1.5 py-0.5 rounded-full border border-zinc-700">
															{gif.category}
														</span>
													</div>
												))
											)}
										</div>
									</div>
								)}

								{/* Textarea */}
								<textarea
									className="w-full p-4 rounded-2xl bg-zinc-800 text-white placeholder-zinc-400 resize-none h-40 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
									placeholder="Share your thoughts..."
									value={reviewText}
									onChange={(e) => setReviewText(e.target.value)}
								/>

								{/* Star Rating Input */}
								<div className="flex flex-col gap-2 mt-4">
									<p className="text-zinc-400 text-sm">Rating: {reviewScore ? `${reviewScore * 2}/10` : "Select stars"}</p>
									<div className="flex gap-2">
										{[1, 2, 3, 4, 5].map((s) => (
											<button
												key={s}
												type="button"
												className="text-3xl transition-transform hover:scale-125 cursor-pointer outline-none focus:ring-0"
												onMouseEnter={() => setHoverScore(s)}
												onMouseLeave={() => setHoverScore(0)}
												onClick={() => setReviewScore(s)}
											>
												<span className={`
													text-3xl transition-all duration-200
													${(hoverScore || reviewScore) >= s ? 'opacity-100 scale-110' : 'opacity-20 grayscale'}
												`}>⭐</span>
											</button>
										))}
									</div>
								</div>
							</div>

							{/* Buttons */}
							<div className="flex justify-end gap-4 mt-6">
								<button
									onClick={() => setShowReviewModal(false)}
									className="px-6 py-3 rounded-2xl bg-zinc-700 hover:bg-zinc-600 font-semibold transition cursor-pointer	"
								>
									Cancel
								</button>
								<button
									onClick={editReviewId ? handleUpdateReview : handleAddReview}
									className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-semibold transition cursor-pointer"
								>
									{editReviewId ? "Update Review" : "Add Review"}
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Trailer Modal */}
			{showTrailerModal && anime.trailer?.embed_url && (
				<div
					className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-[100] p-4"
					onClick={() => setShowTrailerModal(false)}
				>
					<div
						className="bg-zinc-900 w-full max-w-5xl overflow-hidden relative shadow-2xl animate-fadeIn"
						onClick={e => e.stopPropagation()}
					>
						<button
							onClick={() => setShowTrailerModal(false)}
							className="absolute -top-12 right-0 text-zinc-400 hover:text-white transition text-4xl font-bold z-10"
						>
							&times;
						</button>
						<div className="aspect-video w-full">
							<iframe
								src={`${anime.trailer.embed_url}&autoplay=1`}
								title="Anime Trailer"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowFullScreen
								className="w-full h-full border-0"
							></iframe>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
