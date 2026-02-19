 	import { useNavigate } from "react-router-dom";
	import { useRef } from "react";

	export default function UpcomingAnime({ upcoming }) {
		const navigate = useNavigate();
		const scrollRef = useRef();

		const scrollLeft = () => {
			scrollRef.current.scrollBy({ left: -400, behavior: "smooth" });
		};

		const scrollRight = () => {
			scrollRef.current.scrollBy({ left: 400, behavior: "smooth" });
		};

		if (!upcoming || upcoming.length === 0) return null;

		return (
			<section className="relative">
				{/* header */}
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-2xl font-semibold">Upcoming Anime</h2>

					<button
						onClick={() => navigate("/upcoming")}
						className="text-sm font-semibold text-indigo-400 hover:text-indigo-200 cursor-pointer transition"
					>
						See More →
					</button>
				</div>

				{/* left button */}
				<button
					onClick={scrollLeft}
					className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 px-3 py-2 rounded-full"
				>
					<i className="ri-arrow-left-s-line text-xl"></i>
				</button>

				{/* right button */}
				<button
					onClick={scrollRight}
					className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 px-3 py-2 rounded-full"
				>
					<i className="ri-arrow-right-s-line text-xl"></i>
				</button>

				{/* slider row */}
				<div
					ref={scrollRef}
					className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar"
				>
					{upcoming.map((anime) => (
						<div
							key={anime.mal_id}
							onClick={() => navigate(`/anime/${anime.mal_id}`)}
							className="min-w-55 cursor-pointer bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:scale-105 transition"
						>
							<img
								src={anime.images.jpg.image_url}
								alt={anime.title}
								className="h-64 w-full object-cover"
							/>

							<div className="p-3">
								<h3 className="font-semibold text-sm line-clamp-1">
									{anime.title}
								</h3>

								<p className="text-yellow-400 text-xs mt-1">
									⭐ {anime.score || "N/A"}
								</p>

								<p className="text-zinc-400 text-xs mt-1">
									{anime.aired?.string || "TBA"}
								</p>
							</div>
						</div>
					))}
				</div>
			</section>
		);
	}
