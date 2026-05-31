import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getByGenre } from "../api/jikan";

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

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1989 }, (_, i) => currentYear - i);

export default function GenrePage() {
	const { genreName } = useParams();
	const [animeList, setAnimeList] = useState([]);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [year, setYear] = useState("");
	const [minScore, setMinScore] = useState("");
	const [appliedYear, setAppliedYear] = useState("");
	const [appliedScore, setAppliedScore] = useState("");
	const navigate = useNavigate();

	const currentGenreId = genreMap[genreName?.toLowerCase()];

	useEffect(() => {
		async function load() {
			if (!currentGenreId) return;
			setLoading(true);
			try {
				let data = await getByGenre(currentGenreId, page, appliedYear, appliedScore);
				setAnimeList(data || []);
			} catch (err) {
				console.error("Failed to load anime for genre:", err);
				setAnimeList([]);
			} finally {
				setLoading(false);
			}
		}
		load();
	}, [currentGenreId, page, appliedYear, appliedScore]);

	const applyFilters = () => {
		setAppliedYear(year);
		setAppliedScore(minScore);
		setPage(1);
	};

	const clearFilters = () => {
		setYear("");
		setMinScore("");
		setAppliedYear("");
		setAppliedScore("");
		setPage(1);
	};

	const hasActiveFilters = appliedYear || appliedScore;

	return (
		<div className="min-h-screen bg-zinc-950 text-white flex">
			{/* SIDEBAR */}
			<aside className="w-64 shrink-0 bg-zinc-900/60 border-r border-zinc-800/80 flex flex-col overflow-y-auto">
				<div className="p-5 border-b border-zinc-800/80">
					<h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">Browse Genres</h2>
					<div className="flex flex-col gap-1">
						{Object.keys(genreMap).map((g) => {
							const isActive = genreName?.toLowerCase() === g;
							return (
								<button
									key={g}
									onClick={() => navigate(`/genre/${g}`)}
									className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
										isActive
											? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
											: "text-zinc-400 hover:bg-zinc-800/80 hover:text-white"
									}`}
								>
									<i className={`${genreIcons[g] || "ri-tv-line"} text-base`}></i>
									{g.charAt(0).toUpperCase() + g.slice(1)}
								</button>
							);
						})}
					</div>
				</div>

				{/* Filters */}
				<div className="p-5 space-y-4 flex-1">
					<h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Filters</h3>

					<div className="space-y-1">
						<label className="text-xs text-zinc-500 font-medium">Release Year</label>
						<select
							value={year}
							onChange={(e) => setYear(e.target.value)}
							className="w-full mt-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
						>
							<option value="">Any Year</option>
							{years.map(y => (
								<option key={y} value={y}>{y}</option>
							))}
						</select>
					</div>

					<div className="space-y-1">
						<label className="text-xs text-zinc-500 font-medium">Min Score</label>
						<select
							value={minScore}
							onChange={(e) => setMinScore(e.target.value)}
							className="w-full mt-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
						>
							<option value="">Any Score</option>
							{[9, 8.5, 8, 7.5, 7, 6.5, 6].map(s => (
								<option key={s} value={s}>{s}+</option>
							))}
						</select>
					</div>

					<button
						onClick={applyFilters}
						className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer shadow-md shadow-indigo-600/20"
					>
						Apply Filters
					</button>

					{hasActiveFilters && (
						<button
							onClick={clearFilters}
							className="w-full text-zinc-500 hover:text-zinc-300 text-xs py-1.5 transition cursor-pointer"
						>
							✕ Clear Filters
						</button>
					)}
				</div>
			</aside>

			{/* MAIN CONTENT */}
			<div className="flex-1 flex flex-col overflow-y-auto">
				{/* Header */}
				<div className="px-8 py-8 border-b border-zinc-800/50">
					<div className="flex items-center gap-3">
						<i className={`${genreIcons[genreName?.toLowerCase()] || "ri-tv-line"} text-4xl`}></i>
						<div>
							<h1 className="text-3xl font-extrabold text-white capitalize tracking-tight">
								{genreName} Anime
							</h1>
							<p className="text-zinc-500 text-sm mt-0.5">
								{hasActiveFilters ? (
									<span className="text-indigo-400">
										Filtered by {appliedYear && `year ${appliedYear}`}{appliedYear && appliedScore && " · "}
										{appliedScore && `score ${appliedScore}+`} · {animeList.length} results
									</span>
								) : (
									`Page ${page} · ${animeList.length} titles`
								)}
							</p>
						</div>
					</div>
				</div>

				{/* Grid */}
				<div className="flex-1 p-8">
					{loading ? (
						<div className="flex justify-center items-center py-24">
							<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
						</div>
					) : animeList.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-24 text-zinc-500">
							<i className="ri-search-line text-6xl text-zinc-650 mb-4 animate-pulse"></i>
							<p className="text-lg font-semibold text-zinc-400">No anime found</p>
							<p className="text-sm mt-1">Try adjusting your filters or select a different genre</p>
							{hasActiveFilters && (
								<button onClick={clearFilters} className="mt-4 text-indigo-400 hover:text-indigo-300 text-sm underline cursor-pointer">
									Clear Filters
								</button>
							)}
						</div>
					) : (
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
							{animeList.map((anime) => (
								<div
									key={anime.mal_id}
									onClick={() => navigate(`/anime/${anime.mal_id}`)}
									className="bg-zinc-900 border border-zinc-800/80 rounded-2xl overflow-hidden hover:scale-[1.03] hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 group flex flex-col cursor-pointer"
								>
									<div className="relative overflow-hidden">
										<img
											src={anime.images.jpg.large_image_url || anime.images.jpg.image_url}
											alt={anime.title}
											className="w-full h-56 object-cover group-hover:scale-105 transition duration-500"
										/>
										{anime.score && (
											<div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-yellow-400 text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
												<i className="ri-star-fill text-amber-400"></i> {anime.score}
											</div>
										)}
										{anime.aired?.from && (
											<div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-zinc-300 text-xs font-medium px-2 py-1 rounded-lg">
												{new Date(anime.aired.from).getFullYear()}
											</div>
										)}
									</div>

									<div className="p-3 flex flex-col flex-1">
										<h2 className="font-semibold text-sm line-clamp-2 text-zinc-100 group-hover:text-indigo-400 transition leading-snug min-h-[2.5rem]">
											{anime.title}
										</h2>
										<p className="text-zinc-500 text-xs mt-1.5 line-clamp-2 leading-relaxed flex-1">
											{anime.synopsis?.slice(0, 80) || "No synopsis available"}
											{anime.synopsis?.length > 80 ? "..." : ""}
										</p>
										<button
											className="mt-3 w-full bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/30 hover:border-indigo-500 text-indigo-300 hover:text-white py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
										>
											View Details
										</button>
									</div>
								</div>
							))}
						</div>
					)}

					{/* PAGINATION */}
					{!loading && animeList.length > 0 && (
						<div className="flex justify-center items-center gap-4 mt-10">
							<button
								onClick={() => setPage((p) => Math.max(p - 1, 1))}
								disabled={page === 1}
								className="flex items-center gap-2 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-sm font-medium transition cursor-pointer"
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
													? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
													: "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
											}`}
										>
											{p}
										</button>
									);
								})}
							</div>
							<button
								onClick={() => setPage((p) => p + 1)}
								className="flex items-center gap-2 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-sm font-medium transition cursor-pointer"
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
