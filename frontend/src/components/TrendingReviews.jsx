import { useRef } from "react";

export default function TrendingReviews({ trendingReviews }) {
	const scrollRef = useRef();

	const scrollLeft = () => {
		scrollRef.current.scrollBy({ left: -400, behavior: "smooth" });
	};

	const scrollRight = () => {
		scrollRef.current.scrollBy({ left: 400, behavior: "smooth" });
	};

	if (!trendingReviews || trendingReviews.length === 0) return null;

	return (
		<section className="w-full py-10 relative">
			{/* FULL WIDTH BACKGROUND BOX */}
			<div className="w-full bg-zinc-900/60 border-y border-zinc-800 backdrop-blur-sm py-16 relative">
				{/* CENTER CONTENT */}
				<div className="max-w-7xl mx-auto px-5">
					<h2 className="text-3xl font-semibold text-center mb-2 text-indigo-100">
						Trending Reviews
					</h2>

					<p className="mb-10 text-zinc-500 text-center">
						Top anime reviews of the week
					</p>

					{/* LEFT ARROW */}
					<button
						onClick={scrollLeft}
						className="absolute left-9 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 px-3 py-2 rounded-full"
					>
						<i className="ri-arrow-left-s-line text-xl"></i>
					</button>

					{/* RIGHT ARROW */}
					<button
						onClick={scrollRight}
						className="absolute right-9 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 px-3 py-2 rounded-full"
					>
						<i className="ri-arrow-right-s-line text-xl"></i>
					</button>

					{/* HORIZONTAL SCROLL CONTAINER */}
					<div
						ref={scrollRef}
						className="flex gap-8 overflow-x-auto scroll-smooth no-scrollbar"
					>
						{trendingReviews.map((r) => (
							<div
								key={r.title}
								className="min-w-75 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:scale-105 shrink-0 transition"
							>
								<img
									src={r.img}
									alt={r.title}
									className="h-56 w-full object-cover"
								/>

								<div className="p-6 space-y-3">
									<div className="flex justify-between items-center">
										<h3 className="font-semibold text-lg">{r.title}</h3>
										<span className="text-yellow-400 font-medium">
											⭐ {r.rating}
										</span>
									</div>

									<p className="text-zinc-400 text-sm">{r.review}</p>

									<div className="text-xs text-zinc-500 pt-2">👤 {r.user}</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
