import { useRef } from "react";

export default function TrendingReviews({ trendingReviews }) {
	const scrollRef = useRef();

	const scrollLeft = () => {
		scrollRef.current.scrollBy({ left: -380, behavior: "smooth" });
	};

	const scrollRight = () => {
		scrollRef.current.scrollBy({ left: 380, behavior: "smooth" });
	};

	if (!trendingReviews || trendingReviews.length === 0) return null;

	return (
		<section className="w-full bg-zinc-950 border-t border-b border-zinc-900 py-16">
			<div className="max-w-[1600px] mx-auto px-6 md:px-8">
				
				{/* Section Header with Controls */}
				<div className="flex justify-between items-end mb-8">
					<div>
						<h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
							<i className="ri-discuss-line text-indigo-400 animate-pulse"></i> Trending Reviews
						</h2>
						<p className="text-zinc-500 text-sm mt-1">
							Top-rated thoughts and scores from our community
						</p>
					</div>

					{/* Navigation Arrow buttons */}
					<div className="flex gap-2.5">
						<button
							onClick={scrollLeft}
							className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-indigo-600 hover:text-white hover:border-indigo-500 transition-all duration-300 cursor-pointer shadow-md hover:scale-105"
							aria-label="Scroll reviews left"
						>
							<i className="ri-arrow-left-s-line text-lg"></i>
						</button>
						<button
							onClick={scrollRight}
							className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-indigo-600 hover:text-white hover:border-indigo-500 transition-all duration-300 cursor-pointer shadow-md hover:scale-105"
							aria-label="Scroll reviews right"
						>
							<i className="ri-arrow-right-s-line text-lg"></i>
						</button>
					</div>
				</div>

				{/* Horizontal Scroll Container */}
				<div
					ref={scrollRef}
					className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar py-2"
				>
					{trendingReviews.map((r) => {
						const finalRating = r.score || r.rating || 0;
						return (
							<div
								key={r._id || r.title}
								className="w-[360px] shrink-0 bg-zinc-900/40 border border-zinc-850 hover:border-zinc-700/80 rounded-2xl overflow-hidden hover:scale-[1.02] hover:shadow-indigo-500/5 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
							>
								{/* Cover Image & Rating Badge */}
								<div className="relative h-44 w-full overflow-hidden select-none">
									<img
										src={r.animeImage || r.img || "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500"}
										alt={r.animeTitle || r.title}
										className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent"></div>
									
									{/* Anime Title overlaid on image bottom */}
									<div className="absolute bottom-3 left-4 right-4">
										<h3 className="font-bold text-base text-white truncate drop-shadow-md">
											{r.animeTitle || r.title}
										</h3>
									</div>
								</div>

								{/* Text Review Box */}
								<div className="p-5 flex flex-col justify-between flex-1 gap-4">
									{/* Rating score row */}
									<div className="flex justify-between items-center">
										<span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
											User Review
										</span>
										<span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">
											<i className="ri-star-fill"></i>
											{finalRating}/10
										</span>
									</div>

									{/* Content Snippet */}
									<p className="text-zinc-300 text-sm line-clamp-3 leading-relaxed flex-1 italic">
										"{r.text || r.review}"
									</p>

									{/* Reviewer Profile Details */}
									<div className="flex items-center justify-between border-t border-zinc-850 pt-3 text-xs">
										<div className="flex items-center gap-2">
											<div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-zinc-800 flex items-center justify-center text-[10px] text-indigo-400 font-bold uppercase select-none">
												{(r.username || r.user || "U").slice(0, 2)}
											</div>
											<span className="font-semibold text-zinc-400">
												{r.username || r.user || "Anonymous"}
											</span>
										</div>
										<span className="text-zinc-500 text-[10px]">
											Active Member
										</span>
									</div>
								</div>
							</div>
						);
					})}
				</div>

			</div>
		</section>
	);
}
