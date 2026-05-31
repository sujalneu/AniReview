import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

export default function ReviewsPage() {
	const [reviews, setReviews] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		async function fetchAllReviews() {
			try {
				// Fetch Local Reviews
				const localRes = await fetch("http://localhost:8000/api/reviews/recent");
				const localData = await localRes.json();

				// Normalize local data
				const normalizedLocal = (Array.isArray(localData) ? localData : []).map(r => ({
					id: `local-${r._id}`,
					source: "Community",
					animeId: r.animeId,
					animeTitle: r.animeTitle || "Unknown Anime",
					animeImage: r.animeImage || "https://via.placeholder.com/100x150",
					username: r.username,
					text: r.text,
					score: r.score,
					date: new Date(r.createdAt),
					likes: r.likes?.length || 0
				}));

				// Fetch Jikan API Reviews
				let normalizedMal = [];
				try {
					const malRes = await fetch("https://api.jikan.moe/v4/reviews/anime");
					const malData = await malRes.json();
					normalizedMal = (malData.data || []).map(r => ({
						id: `mal-${r.mal_id}`,
						source: "MyAnimeList",
						animeId: r.entry.mal_id,
						animeTitle: r.entry.title,
						animeImage: r.entry.images?.jpg?.image_url || "https://via.placeholder.com/100x150",
						username: r.user.username,
						text: r.review,
						score: r.score,
						date: new Date(r.date),
						likes: r.reactions?.overall || 0
					}));
				} catch (err) {
					console.error("Failed to fetch from Jikan", err);
				}

				// Merge and Sort by Date Descending
				const merged = [...normalizedLocal, ...normalizedMal].sort((a, b) => b.date - a.date);
				setReviews(merged);
			} catch (err) {
				console.error("Error fetching reviews:", err);
			} finally {
				setLoading(false);
			}
		}

		fetchAllReviews();
	}, []);

	return (
		<div className="min-h-screen bg-zinc-950 text-white px-6 md:px-12 py-12 w-full">
			<div className="mb-10 text-center">
				<h1 className="text-4xl font-bold text-indigo-400">Global Reviews</h1>
				<p className="text-zinc-400 mt-2">See what the community and MyAnimeList users are saying!</p>
			</div>

			{loading ? (
				<div className="text-center text-zinc-400 mt-20">Loading amazing reviews...</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{reviews.map((rev) => (
						<div key={rev.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col hover:border-indigo-500/50 transition duration-300">
							{/* Anime Info */}
							<div 
								className="flex gap-4 items-center mb-4 cursor-pointer"
								onClick={() => navigate(`/anime/${rev.animeId}`)}
							>
								<img 
									src={rev.animeImage} 
									alt={rev.animeTitle} 
									className="w-16 h-24 object-cover rounded-lg shadow-md"
								/>
								<div>
									<h2 className="font-bold text-lg leading-tight hover:text-indigo-400 transition line-clamp-2">{rev.animeTitle}</h2>
									<span className={`text-xs px-2 py-1 rounded-md mt-2 inline-block ${rev.source === 'Community' ? 'bg-indigo-600' : 'bg-blue-600'}`}>
										{rev.source}
									</span>
								</div>
							</div>

							{/* Review Info */}
							<div className="flex justify-between items-start mb-3 border-t border-zinc-800 pt-4">
								<div>
									<p className="font-bold text-indigo-300 text-sm">{rev.username}</p>
									<p className="text-xs text-zinc-500">{rev.date.toLocaleDateString()}</p>
								</div>
								<div className="flex items-center gap-1">
									<div className="flex gap-0.5">
										{[...Array(5)].map((_, i) => (
											<i key={i} className={`ri-star-fill text-[13px] ${i < Math.round(rev.score / 2) ? "text-amber-400" : "text-zinc-700"}`}></i>
										))}
									</div>
									<span className="text-zinc-500 text-[10px] ml-1">({rev.score}/10)</span>
								</div>
							</div>

							<div className="text-zinc-300 text-sm flex-1 overflow-hidden relative prose-markdown">
								<div className="line-clamp-6">
									<ReactMarkdown
										components={{
											p: ({node, ...props}) => <span {...props} />, // Use span to not break line-clamp
										}}
									>
										{rev.text}
									</ReactMarkdown>
								</div>
							</div>

							{/* Actions */}
							<div className="flex items-center gap-4 mt-4 pt-4 border-t border-zinc-800">
								<span className="flex items-center gap-1 text-xs text-zinc-400">
									<i className="ri-thumb-up-line text-green-400"></i> {rev.likes} Helpful
								</span>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
