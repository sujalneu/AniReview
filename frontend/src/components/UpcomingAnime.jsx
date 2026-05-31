import { useNavigate } from "react-router-dom";
import { useRef } from "react";

export default function UpcomingAnime({ upcoming }) {
	const navigate = useNavigate();
	const scrollRef = useRef();

	const scrollLeft = () => {
		scrollRef.current.scrollBy({ left: -360, behavior: "smooth" });
	};

	const scrollRight = () => {
		scrollRef.current.scrollBy({ left: 360, behavior: "smooth" });
	};

	if (!upcoming || upcoming.length === 0) return null;

	return (
		<section className="relative w-full py-6">
			{/* Header */}
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
					<i className="ri-calendar-todo-line text-indigo-400"></i> Upcoming Anime
				</h2>

				<button
					onClick={() => navigate("/upcoming")}
					className="group/btn text-sm font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer transition-all duration-300"
				>
					See More
					<i className="ri-arrow-right-line group-hover/btn:translate-x-1 transition-transform"></i>
				</button>
			</div>

			{/* Slider row wrapper */}
			<div className="relative group/slider">
				{/* Scroll Buttons */}
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

				{/* Slider row */}
				<div
					ref={scrollRef}
					className="flex gap-5 overflow-x-auto scroll-smooth no-scrollbar py-2"
				>
					{upcoming.map((anime) => (
						<div
							key={anime.mal_id}
							onClick={() => navigate(`/anime/${anime.mal_id}`)}
							className="w-[200px] shrink-0 cursor-pointer bg-zinc-900/40 border border-zinc-850 hover:border-zinc-700/80 rounded-2xl overflow-hidden hover:scale-[1.03] transition-all duration-300 shadow-lg hover:shadow-indigo-500/5 group flex flex-col justify-between"
						>
							{/* Image Container with Release Tag */}
							<div className="relative h-[250px] w-full overflow-hidden">
								<img
									src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url}
									alt={anime.title}
									className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
								/>
								
								{/* Released Date pill overlay */}
								<div className="absolute top-3 left-3 z-10">
									<span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold bg-zinc-950/80 text-indigo-300 border border-zinc-800/80 backdrop-blur-md">
										<i className="ri-time-line mr-0.5"></i>
										{anime.aired?.prop?.from?.year || anime.aired?.string?.split("to")[0]?.trim() || "TBA"}
									</span>
								</div>
							</div>

							{/* Content Description */}
							<div className="p-4 flex flex-col flex-1 justify-between gap-2">
								<h3 className="font-bold text-sm text-zinc-100 line-clamp-2 group-hover:text-indigo-400 transition-colors leading-tight">
									{anime.title}
								</h3>

								<div className="flex justify-between items-center mt-1">
									{/* Rating badge if exists, otherwise show status */}
									{anime.score ? (
										<span className="text-amber-400 text-xs font-bold flex items-center">
											<i className="ri-star-fill text-amber-500 mr-0.5"></i>
											{anime.score}
										</span>
									) : (
										<span className="text-zinc-500 text-[10px] font-semibold tracking-wider uppercase">
											{anime.status || "Upcoming"}
										</span>
									)}
									
									<span className="text-[10px] text-zinc-400 bg-zinc-800/60 px-1.5 py-0.5 rounded border border-zinc-800">
										{anime.type || "TV"}
									</span>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
