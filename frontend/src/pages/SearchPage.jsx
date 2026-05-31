import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { searchAnime } from "../api/jikan";

export default function SearchPage() {
	const { query } = useParams();
	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		async function run() {
			setLoading(true);
			try {
				const data = await searchAnime(query);
				setResults(data || []);
			} catch (err) {
				console.error("Search failed:", err);
				setResults([]);
			} finally {
				setLoading(false);
			}
		}
		run();
	}, [query]);

	return (
		<div className="min-h-screen bg-zinc-950 text-white py-10 px-6 md:px-8 select-none">
			<div className="max-w-[1600px] mx-auto space-y-8">
				
				{/* Search Result Header */}
				<div className="flex items-center gap-3 border-b border-zinc-900 pb-6">
					<div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-xl shadow-md">
						<i className="ri-search-2-line animate-pulse"></i>
					</div>
					<div>
						<h1 className="text-2xl font-black text-white tracking-tight">Search Results</h1>
						<p className="text-zinc-500 text-xs mt-0.5 font-bold uppercase tracking-wider">
							Query: <span className="text-indigo-400 font-black">{decodeURIComponent(query)}</span>
							{!loading && ` · ${results.length} titles found`}
						</p>
					</div>
				</div>

				{/* Results Content */}
				{loading ? (
					<div className="flex flex-col justify-center items-center py-32 gap-3">
						<div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
						<p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Searching catalog...</p>
					</div>
				) : results.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-24 text-zinc-500">
						<div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800/80 flex items-center justify-center text-3xl mb-4 text-zinc-650">
							<i className="ri-file-search-line"></i>
						</div>
						<p className="text-base font-bold text-zinc-400">No results found</p>
						<p className="text-xs text-zinc-500 mt-1 max-w-xs text-center">
							We couldn't find any anime matching "{decodeURIComponent(query)}". Check spelling or search popular genres instead.
						</p>
						<button
							onClick={() => navigate("/home")}
							className="mt-6 px-5 py-2.5 bg-zinc-900 hover:bg-indigo-600 border border-zinc-800 hover:border-indigo-500 rounded-xl text-xs font-bold text-zinc-300 hover:text-white transition cursor-pointer"
						>
							Back to Homepage
						</button>
					</div>
				) : (
					/* Cards Grid */
					<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
						{results.map((anime) => (
							<div
								key={anime.mal_id}
								onClick={() => navigate(`/anime/${anime.mal_id}`)}
								className="bg-zinc-900/30 border border-zinc-850 hover:border-indigo-500/40 rounded-2xl overflow-hidden hover:scale-[1.03] hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 group flex flex-col cursor-pointer"
							>
								{/* Image with overlay tags */}
								<div className="relative h-64 overflow-hidden select-none">
									<img
										src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url}
										alt={anime.title}
										className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
									/>
									{anime.score && (
										<div className="absolute top-3 right-3 bg-zinc-950/80 backdrop-blur-md text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded border border-zinc-800/80 flex items-center gap-0.5">
											<i className="ri-star-fill text-amber-500"></i> {anime.score}
										</div>
									)}
									{anime.type && (
										<div className="absolute top-3 left-3 bg-zinc-950/80 backdrop-blur-md text-zinc-300 text-[10px] font-bold px-2 py-0.5 rounded border border-zinc-800/80">
											{anime.type}
										</div>
									)}
								</div>

								{/* Details body */}
								<div className="p-4 flex flex-col flex-1 justify-between gap-3">
									<div>
										<h3 className="font-bold text-sm text-zinc-100 group-hover:text-indigo-400 transition-colors line-clamp-2 leading-tight min-h-[2.5rem]">
											{anime.title}
										</h3>
										<p className="text-zinc-500 text-xs mt-1.5 line-clamp-2 leading-relaxed">
											{anime.synopsis || "No synopsis available."}
										</p>
									</div>
									<button
										className="w-full bg-indigo-600/10 group-hover:bg-indigo-600 border border-indigo-500/20 group-hover:border-indigo-500 text-indigo-300 group-hover:text-white py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
									>
										View Details
									</button>
								</div>
							</div>
						))}
					</div>
				)}

			</div>
		</div>
	);
}
