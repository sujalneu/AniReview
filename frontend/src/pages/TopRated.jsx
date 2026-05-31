import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTopAnime } from "../api/jikan";

const genreMap = {
	action: 1,
	adventure: 2,
	cars: 3,
	comedy: 4,
	dementia: 5,
	demons: 6,
	mystery: 7,
	drama: 8,
	horror: 9,
	fantasy: 10,
	game: 11,
	harem: 12,
	martialarts: 17,
	school: 23,
	scifi: 24,
	sports: 30,
	isekai: 55,
	romance: 22,
};

const genreIcons = {
	action: "ri-sword-line text-amber-500",
	adventure: "ri-map-line text-emerald-500",
	cars: "ri-car-line text-blue-500",
	comedy: "ri-emotion-happy-line text-yellow-500",
	dementia: "ri-brain-line text-pink-500",
	demons: "ri-fire-line text-red-500",
	mystery: "ri-search-line text-indigo-500",
	drama: "ri-drama-line text-violet-500",
	horror: "ri-ghost-line text-zinc-400",
	fantasy: "ri-magic-line text-purple-500",
	game: "ri-gamepad-line text-cyan-500",
	harem: "ri-heart-2-line text-rose-500",
	martialarts: "ri-sword-fill text-orange-500",
	school: "ri-book-line text-teal-500",
	scifi: "ri-rocket-line text-indigo-400",
	sports: "ri-football-line text-green-500",
	isekai: "ri-portal-line text-purple-400",
	romance: "ri-heart-line text-red-500",
};

export default function TopRatedPage() {
	const [animeList, setAnimeList] = useState([]);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const navigate = useNavigate();

	useEffect(() => {
		async function load() {
			setLoading(true);
			try {
				const data = await getTopAnime(page, 20); // Syncing limit to 20 just like genre page grid
				setAnimeList(data || []);
			} catch (err) {
				console.error("Error loading top-rated anime:", err);
				setAnimeList([]);
			} finally {
				setLoading(false);
			}
		}
		load();
		window.scrollTo(0, 0); // scroll to top when page changes
	}, [page]);

	return (
		<div className="min-h-screen bg-zinc-950 text-white flex select-none">
			
			{/* SIDEBAR (Matches GenrePage.jsx layout) */}
			<aside className="w-64 shrink-0 bg-zinc-900/60 border-r border-zinc-800/80 flex flex-col overflow-y-auto">
				<div className="p-5 border-b border-zinc-800/80">
					<h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">Categories</h2>
					<div className="flex flex-col gap-1.5">
						
						{/* Top Rated Link (Highlight as Active) */}
						<button
							onClick={() => navigate("/toprated")}
							className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 cursor-pointer bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
						>
							<i className="ri-vip-crown-line text-base text-yellow-400 animate-pulse"></i>
							Top Rated Anime
						</button>

						<div className="h-px bg-zinc-800/60 my-2"></div>
						
						<span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2 px-1">Genres</span>
						{Object.keys(genreMap).map((g) => (
							<button
								key={g}
								onClick={() => navigate(`/genre/${g}`)}
								className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 cursor-pointer text-zinc-400 hover:bg-zinc-800/80 hover:text-white"
							>
								<i className={`${genreIcons[g] || "ri-tv-line"} text-base`}></i>
								{g.charAt(0).toUpperCase() + g.slice(1)}
							</button>
						))}
					</div>
				</div>
				
				{/* Info Panel in Sidebar */}
				<div className="p-5 text-zinc-500 text-[10px] uppercase font-black tracking-widest text-center mt-auto">
					<span className="flex items-center justify-center gap-1">
						<i className="ri-shield-check-line text-indigo-400"></i> AniReview Verified Rankings
					</span>
				</div>
			</aside>

			{/* MAIN CONTENT AREA */}
			<div className="flex-1 flex flex-col overflow-y-auto">
				
				{/* Page Header */}
				<div className="px-8 py-8 border-b border-zinc-800/50">
					<div className="flex items-center gap-3">
						<div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-xl shadow-md">
							<i className="ri-vip-crown-line text-yellow-400"></i>
						</div>
						<div>
							<h1 className="text-3xl font-extrabold text-white tracking-tight">
								Top Rated Anime
							</h1>
							<p className="text-zinc-500 text-sm mt-0.5">
								All-time highest rated anime series and films · Page {page}
							</p>
						</div>
					</div>
				</div>

				{/* Grid Container */}
				<div className="flex-1 p-8">
					{loading ? (
						<div className="flex flex-col justify-center items-center py-32 gap-3">
							<div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
							<p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Loading rankings...</p>
						</div>
					) : animeList.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-24 text-zinc-500">
							<i className="ri-search-line text-6xl text-zinc-650 mb-4 animate-pulse"></i>
							<p className="text-lg font-semibold text-zinc-400">No rankings loaded</p>
							<p className="text-sm mt-1">Please try refetching or reload the page.</p>
						</div>
					) : (
						/* Cards Grid (Identical style to GenrePage.jsx) */
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
							{animeList.map((anime, index) => {
								const rank = (page - 1) * 20 + index + 1;
								
								// Medal styling
								const isGold = rank === 1;
								const isSilver = rank === 2;
								const isBronze = rank === 3;

								return (
									<div
										key={anime.mal_id}
										onClick={() => navigate(`/anime/${anime.mal_id}`)}
										className="bg-zinc-900 border border-zinc-800/80 rounded-2xl overflow-hidden hover:scale-[1.03] hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 group flex flex-col cursor-pointer"
									>
										{/* Image Frame */}
										<div className="relative overflow-hidden select-none">
											<img
												src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url}
												alt={anime.title}
												className="w-full h-56 object-cover group-hover:scale-105 transition duration-500"
											/>
											
											{/* Premium Compact Rank Badge */}
											<div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-zinc-950/80 backdrop-blur-md px-2 py-0.5 rounded border border-zinc-800/80">
												{isGold && <i className="ri-vip-crown-fill text-amber-400 text-xs"></i>}
												{isSilver && <i className="ri-medal-fill text-slate-300 text-xs"></i>}
												{isBronze && <i className="ri-medal-fill text-amber-600 text-xs"></i>}
												<span className={`text-[10px] font-black tracking-tight ${
													isGold ? "text-amber-400" :
													isSilver ? "text-slate-300" :
													isBronze ? "text-amber-600" :
													"text-zinc-400"
												}`}>
													#{rank}
												</span>
											</div>

											{/* Score Badge */}
											{anime.score && (
												<div className="absolute top-3 right-3 bg-zinc-950/80 backdrop-blur-md text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded border border-zinc-800/80 flex items-center gap-0.5">
													<i className="ri-star-fill text-amber-500"></i> {anime.score}
												</div>
											)}
										</div>

										{/* Content Box */}
										<div className="p-4 flex flex-col flex-1 justify-between gap-3">
											<div>
												<h2 className="font-bold text-sm line-clamp-2 text-zinc-100 group-hover:text-indigo-400 transition leading-snug min-h-[2.5rem]">
													{anime.title}
												</h2>
												<p className="text-zinc-500 text-xs mt-1.5 line-clamp-2 leading-relaxed">
													{anime.synopsis || "No synopsis available."}
												</p>
											</div>
											<button
												className="w-full bg-indigo-600/10 group-hover:bg-indigo-600 border border-indigo-500/20 group-hover:border-indigo-500 text-indigo-300 group-hover:text-white py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
											>
												View Details
											</button>
										</div>
									</div>
								);
							})}
						</div>
					)}

					{/* PAGINATION (Matches GenrePage.jsx exact style) */}
					{!loading && animeList.length > 0 && (
						<div className="flex justify-center items-center gap-4 mt-12">
							<button
								onClick={() => setPage((p) => Math.max(p - 1, 1))}
								disabled={page === 1}
								className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-sm font-medium transition cursor-pointer"
							>
								← Prev
							</button>
							<div className="flex items-center gap-2">
								{[...Array(3)].map((_, i) => {
									const p = Math.max(1, page - 1) + i;
									return (
										<button
											key={p}
											onClick={() => setPage(p)}
											className={`w-9 h-9 rounded-xl text-sm font-semibold transition cursor-pointer ${
												p === page
													? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-500"
													: "bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300"
											}`}
										>
											{p}
										</button>
									);
								})}
							</div>
							<button
								onClick={() => setPage((p) => p + 1)}
								className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 rounded-xl text-sm font-medium transition cursor-pointer"
							>
								Next →
							</button>
						</div>
					)}
				</div>

			</div>
		</div>
	);
}
