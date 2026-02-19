import { useState, useEffect } from "react";
import { getTrending } from "../api/jikan";
import { useNavigate } from "react-router-dom";

export default function TrendingSlider({ slide, nextSlide, prevSlide }) {
	const [trendingAnime, setTrendingAnime] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		async function loadTrending() {
			const data = await getTrending();
			// Map the Jikan season data to match your slider structure
			const mapped = data.map((anime) => ({
				id: anime.mal_id,
				title: anime.title,
				img: anime.images.jpg.large_image_url,
				synopsis: anime.synopsis || "No synopsis available",
				trailer: anime.trailer?.url || "#",
			}));
			setTrendingAnime(mapped);
		}
		loadTrending();
	}, []);

	if (!trendingAnime.length)
		return <div className="text-white p-10">Loading trending anime...</div>;

	return (
		<section className="relative">
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-2xl font-semibold text-white">Trending Now</h2>
			</div>

			<div className="relative border border-zinc-900 rounded-2xl overflow-hidden flex flex-col md:flex-row h-125 md:h-130">
				{/* Left Content */}
				<div className="flex-1 p-8 flex flex-col justify-center max-w-2xl z-10">
					<h3 className="text-4xl font-bold text-white mb-4 line-clamp-3">
						{trendingAnime[slide].title}
					</h3>
					<p className="text-zinc-300 text-sm line-clamp-5 mb-6">
						{trendingAnime[slide].synopsis}
					</p>
					<div className="flex gap-4">
						<a
							href={trendingAnime[slide].trailer}
							target="_blank"
							className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg font-semibold transition"
						>
							Watch Trailer
						</a>
						<button
							onClick={() => navigate(`/anime/${trendingAnime[slide].id}`)}
							className="bg-zinc-800 hover:bg-zinc-700 px-6 py-3 rounded-lg font-semibold transition"
						>
							View Details
						</button>
					</div>
				</div>

				{/* Right Image */}
				<div className="flex-1 absolute md:relative top-0 right-0 bottom-0 left-0 md:left-auto md:top-0 md:right-0">
					<img
						src={trendingAnime[slide].img}
						alt={trendingAnime[slide].title}
						className="w-200 h-130 object-cover"
					/>
				</div>

				{/* Navigation Buttons (over image now) */}
				<button
					onClick={prevSlide}
					className="absolute bottom-6 right-24 bg-black/70 hover:bg-white hover:text-black px-4 py-2 rounded-lg transition cursor-pointer z-20"
				>
					<i className="ri-arrow-left-line"></i>
				</button>
				<button
					onClick={nextSlide}
					className="absolute bottom-6 right-6 bg-black/70 hover:bg-white hover:text-black px-4 py-2 rounded-lg transition cursor-pointer z-20"
				>
					<i className="ri-arrow-right-line"></i>
				</button>
			</div>
		</section>
	);
}
