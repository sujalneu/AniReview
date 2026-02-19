import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getTopAnime } from "../api/jikan";

export default function TopRated({ showSeeMore = true }) {
	const [topRated, setTopRated] = useState([]);
	const scrollRef = useRef();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchTopRated = async () => {
			try {
				const data = await getTopAnime();
				setTopRated(data);
			} catch (err) {
				console.error("Failed to fetch top-rated anime:", err);
			}
		};
		fetchTopRated();
	}, []);

	const scrollLeft = () => {
		scrollRef.current.scrollBy({ left: -400, behavior: "smooth" });
	};

	const scrollRight = () => {
		scrollRef.current.scrollBy({ left: 400, behavior: "smooth" });
	};

	if (!topRated || topRated.length === 0) return null;

	return (
		<section className="relative w-full py-16 bg-zinc-900 border-t border-b border-zinc-800">
			<div className="max-w-7xl mx-auto px-6">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-3xl font-bold text-indigo-400">
						Top Rated Anime
					</h2>

					{/* SEE MORE BUTTON */}
					{showSeeMore && (
						<button
							onClick={() => navigate("/toprated")}
							className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm transition"
						>
							See More
						</button>
					)}
				</div>

				{/* left button */}
				<button
					onClick={scrollLeft}
					className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 px-3 py-2 rounded-full cursor-pointer"
				>
					<i className="ri-arrow-left-s-line text-xl"></i>
				</button>

				{/* right button */}
				<button
					onClick={scrollRight}
					className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 px-3 py-2 rounded-full cursor-pointer"
				>
					<i className="ri-arrow-right-s-line text-xl"></i>
				</button>

				{/* Horizontal Slider */}
				<div
					ref={scrollRef}
					className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar"
				>
					{topRated.map((anime, index) => {
						const shortSynopsis =
							anime.synopsis?.length > 100
								? anime.synopsis.slice(0, 100) + "…"
								: anime.synopsis || "An amazing anime worth watching.";

						return (
							<div
								key={anime.mal_id}
								onClick={() => navigate(`/anime/${anime.mal_id}`)}
								className="min-w-[18rem] max-w-100 h-72 shrink-0 bg-zinc-800 border border-zinc-700 rounded-2xl p-4 flex flex-col gap-3 cursor-pointer hover:scale-105 transition-transform duration-300"
							>
								<div className="flex items-start gap-4">
									<div className="text-3xl font-bold text-indigo-400">
										{index + 1}
									</div>
									<img
										src={anime.images.jpg.image_url}
										alt={anime.title}
										className="w-24 h-24 rounded-xl object-cover border border-zinc-700"
									/>
									<div className="flex-1">
										<h3 className="text-lg font-semibold line-clamp-2">
											{anime.title}
										</h3>
										<p className="text-yellow-400 font-medium mt-1">
											⭐ {anime.score || "N/A"}
										</p>
									</div>
								</div>

								<p className="text-zinc-300 text-sm mt-2 flex-1">
									{shortSynopsis}
								</p>

								<div className="text-zinc-500 text-xs mt-auto">
									{Math.floor(Math.random() * 5000 + 100).toLocaleString()}{" "}
									reviews
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
