import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function TrendingSlider({ trendingAnime = [] }) {
	const [slide, setSlide] = useState(0);
	const navigate = useNavigate();

	// Auto-play the slider every 6 seconds
	useEffect(() => {
		if (trendingAnime.length === 0) return;
		const interval = setInterval(() => {
			setSlide((prev) => (prev + 1) % trendingAnime.length);
		}, 6000);
		return () => clearInterval(interval);
	}, [trendingAnime.length]);

	const nextSlide = () => {
		setSlide((prev) => (prev + 1) % trendingAnime.length);
	};

	const prevSlide = () => {
		setSlide((prev) => (prev === 0 ? trendingAnime.length - 1 : prev - 1));
	};

	if (!trendingAnime.length || !trendingAnime[slide]) {
		return (
			<div className="w-full h-[400px] md:h-[480px] bg-zinc-900/30 border border-zinc-800/80 rounded-3xl flex items-center justify-center animate-pulse">
				<div className="flex flex-col items-center gap-3">
					<div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
					<p className="text-zinc-500 text-sm font-medium">Curating trending anime...</p>
				</div>
			</div>
		);
	}

	const currentAnime = trendingAnime[slide];

	return (
		<section className="relative group/slider w-full">
			<div className="relative w-full h-[450px] md:h-[500px] bg-zinc-950 border border-zinc-800/80 rounded-3xl overflow-hidden shadow-2xl transition-all duration-500">
				
				{/* Background Cover Image with radial/linear fade */}
				<div className="absolute inset-0 select-none">
					<img
						src={currentAnime.img}
						alt={currentAnime.title}
						className="w-full h-full object-cover object-top opacity-50 md:opacity-75 transition-all duration-700 scale-105 group-hover/slider:scale-100"
					/>
					{/* Dark overlay systems for maximum readability */}
					<div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-950/30"></div>
					<div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent hidden md:block"></div>
				</div>

				{/* Left Content Area (Glass/Overlay hybrid) */}
				<div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-16 max-w-3xl z-10">
					{/* Hot Tag badge */}
					<div className="mb-4">
						<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 backdrop-blur-md shadow-sm shadow-indigo-500/5">
							<i className="ri-fire-fill text-amber-500 animate-pulse"></i>
							🔥 Trending #{slide + 1}
						</span>
					</div>

					{/* Title with sleek shadows */}
					<h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 leading-tight tracking-tight drop-shadow-md">
						{currentAnime.title}
					</h3>

					{/* Synopsis */}
					<p className="text-zinc-300 text-sm md:text-base line-clamp-4 md:line-clamp-5 mb-8 leading-relaxed max-w-xl">
						{currentAnime.synopsis}
					</p>

					{/* Actions */}
					<div className="flex flex-wrap gap-4 items-center">
						<button
							onClick={() => navigate(`/anime/${currentAnime.id}`)}
							className="group/btn flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 cursor-pointer shadow-lg shadow-indigo-600/30 hover:scale-103"
						>
							<i className="ri-play-circle-line text-lg group-hover/btn:rotate-12 transition-transform"></i>
							View Details
						</button>
					</div>
				</div>

				{/* Controls (Sleek backdrop blur circles) */}
				<button
					onClick={prevSlide}
					className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-2xl bg-zinc-900/60 hover:bg-indigo-600 hover:text-white border border-zinc-800/80 hover:border-indigo-500 text-zinc-300 backdrop-blur-md transition-all duration-300 cursor-pointer z-20 opacity-0 group-hover/slider:opacity-100 hover:scale-105"
					aria-label="Previous slide"
				>
					<i className="ri-arrow-left-s-line text-xl"></i>
				</button>
				<button
					onClick={nextSlide}
					className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-2xl bg-zinc-900/60 hover:bg-indigo-600 hover:text-white border border-zinc-800/80 hover:border-indigo-500 text-zinc-300 backdrop-blur-md transition-all duration-300 cursor-pointer z-20 opacity-0 group-hover/slider:opacity-100 hover:scale-105"
					aria-label="Next slide"
				>
					<i className="ri-arrow-right-s-line text-xl"></i>
				</button>

				{/* Indicator Dots / Pills */}
				<div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20 bg-zinc-950/40 backdrop-blur-xs px-3 py-1.5 rounded-full border border-zinc-800/40">
					{trendingAnime.map((_, idx) => (
						<button
							key={idx}
							onClick={() => setSlide(idx)}
							className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
								idx === slide ? "w-6 bg-indigo-500" : "w-2 bg-zinc-600/70 hover:bg-zinc-400"
							}`}
							aria-label={`Go to slide ${idx + 1}`}
						/>
					))}
				</div>

			</div>
		</section>
	);
}
