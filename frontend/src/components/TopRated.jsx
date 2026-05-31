import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getTopAnime } from "../api/jikan";

export default function TopRated({ topRated: initialTopRated, showSeeMore = true }) {
	const [topRated, setTopRated] = useState(initialTopRated || []);
	const scrollRef = useRef();
	const navigate = useNavigate();

	// Fetch if not provided as a prop
	useEffect(() => {
		if (initialTopRated && initialTopRated.length > 0) {
			setTopRated(initialTopRated);
			return;
		}

		const fetchTopRated = async () => {
			try {
				const data = await getTopAnime(1, 10);
				setTopRated(data);
			} catch (err) {
				console.error("Failed to fetch top-rated anime:", err);
			}
		};
		fetchTopRated();
	}, [initialTopRated]);

	const scrollLeft = () => {
		scrollRef.current.scrollBy({ left: -420, behavior: "smooth" });
	};

	const scrollRight = () => {
		scrollRef.current.scrollBy({ left: 420, behavior: "smooth" });
	};

	if (!topRated || topRated.length === 0) return null;

	return (
		<section className="relative w-full py-10">
			{/* Header */}
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
					<i className="ri-vip-crown-line text-indigo-400"></i> Top Rated Anime
				</h2>

				{showSeeMore && (
					<button
						onClick={() => navigate("/toprated")}
						className="group/btn text-sm font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer transition-all duration-300"
					>
						See More
						<i className="ri-arrow-right-line group-hover/btn:translate-x-1 transition-transform"></i>
					</button>
				)}
			</div>

			{/* Container wrapper for horizontal slider */}
			<div className="relative group/slider">
				{/* Scroll controls */}
				<button
					onClick={scrollLeft}
					className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-900/80 hover:bg-indigo-600 hover:text-white border border-zinc-800 text-zinc-400 backdrop-blur-md transition-all duration-300 cursor-pointer z-10 opacity-0 group-hover/slider:opacity-100 shadow-lg hover:scale-105"
					aria-label="Scroll left"
				>
					<i className="ri-arrow-left-s-line text-lg"></i>
				</button>
				<button
					onClick={scrollRight}
					className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-900/80 hover:bg-indigo-600 hover:text-white border border-zinc-800 text-zinc-400 backdrop-blur-md transition-all duration-300 cursor-pointer z-10 opacity-0 group-hover/slider:opacity-100 shadow-lg hover:scale-105"
					aria-label="Scroll right"
				>
					<i className="ri-arrow-right-s-line text-lg"></i>
				</button>

				{/* Horizontal Slider */}
				<div
					ref={scrollRef}
					className="flex gap-5 overflow-x-auto scroll-smooth no-scrollbar py-2"
				>
					{topRated.map((anime, index) => {
						const shortSynopsis =
							anime.synopsis?.length > 100
								? anime.synopsis.slice(0, 100) + "…"
								: anime.synopsis || "An amazing anime worth watching.";

						// Dynamic rank border colors and shadows for top 3
						const isTop1 = index === 0;
						const isTop2 = index === 1;
						const isTop3 = index === 2;

						let borderClass = "border-zinc-800/80 hover:border-zinc-700/80";
						let glowClass = "shadow-zinc-950/20";
						
						if (isTop1) {
							borderClass = "border-amber-500/40 hover:border-amber-400/80";
							glowClass = "shadow-amber-500/5 hover:shadow-amber-500/10";
						} else if (isTop2) {
							borderClass = "border-slate-400/30 hover:border-slate-300/80";
							glowClass = "shadow-slate-400/5 hover:shadow-slate-400/10";
						} else if (isTop3) {
							borderClass = "border-amber-700/30 hover:border-amber-600/80";
							glowClass = "shadow-amber-700/5 hover:shadow-amber-700/10";
						}

						return (
							<div
								key={anime.mal_id}
								onClick={() => navigate(`/anime/${anime.mal_id}`)}
								className={`w-[320px] h-[220px] shrink-0 bg-zinc-900/40 backdrop-blur-xs border ${borderClass} rounded-2xl p-5 flex flex-col justify-between cursor-pointer hover:scale-[1.03] transition-all duration-300 shadow-xl ${glowClass} group`}
							>
								{/* Top Info */}
								<div className="flex gap-4 items-start">
									{/* Rank Indicator */}
									<div className="flex flex-col items-center justify-center shrink-0 w-12 h-14 bg-zinc-850/80 rounded-xl border border-zinc-800/80">
										{isTop1 && <i className="ri-vip-crown-fill text-amber-400 text-sm drop-shadow-[0_0_4px_rgba(245,158,11,0.5)]"></i>}
										{isTop2 && <i className="ri-medal-fill text-slate-300 text-sm"></i>}
										{isTop3 && <i className="ri-medal-fill text-amber-600 text-sm"></i>}
										<span className={`text-xl font-black italic tracking-tighter ${
											isTop1 ? "text-amber-400" :
											isTop2 ? "text-slate-300" :
											isTop3 ? "text-amber-600" :
											"text-zinc-600"
										}`}>
											#{index + 1}
										</span>
									</div>

									{/* Anime Image */}
									<div className="w-16 h-22 rounded-xl overflow-hidden border border-zinc-800 shadow-inner">
										<img
											src={anime.images?.jpg?.image_url || anime.images?.jpg?.large_image_url}
											alt={anime.title}
											className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
										/>
									</div>

									{/* Title & Score */}
									<div className="flex-1 min-w-0">
										<h3 className="text-sm font-bold text-white line-clamp-2 leading-tight group-hover:text-indigo-400 transition-colors">
											{anime.title}
										</h3>
										<div className="mt-2 flex items-center gap-1.5">
											<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">
												<i className="ri-star-fill"></i>
												{anime.score || "N/A"}
											</span>
										</div>
									</div>
								</div>

								{/* Synopsis */}
								<p className="text-zinc-400 text-xs line-clamp-3 leading-relaxed mt-2">
									{shortSynopsis}
								</p>

								{/* Reviews / Footnote */}
								<div className="flex justify-between items-center text-[10px] text-zinc-500 border-t border-zinc-800/60 pt-2 mt-2">
									<span>{Math.floor((anime.mal_id % 3000) + 150)} reviews</span>
									<span className="text-indigo-400/80 font-medium group-hover:underline flex items-center gap-0.5">
										Explore <i className="ri-arrow-right-s-line"></i>
									</span>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
