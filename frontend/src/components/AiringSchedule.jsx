import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTrending } from "../api/jikan";

export default function AiringSchedule() {
	const [airingAnime, setAiringAnime] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		async function fetchAiring() {
			try {
				const data = await getTrending();
				// Filter anime that have a known broadcast string
				const filtered = data.filter(a => a.broadcast?.string && a.broadcast.string !== "Unknown");
				setAiringAnime(filtered.slice(0, 5)); // Limit to 5 for sidebar
			} catch (err) {
				console.error("Failed to fetch airing schedule:", err);
			}
		}
		fetchAiring();
	}, []);

	if (!airingAnime || airingAnime.length === 0) return null;

	return (
		<section className="w-full">
			<div className="bg-zinc-900/40 border border-zinc-850 rounded-3xl p-6 shadow-lg backdrop-blur-md relative overflow-hidden group">
				{/* Top-right subtle glow */}
				<div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl"></div>
				
				{/* Header */}
				<div className="flex items-center gap-2 mb-6">
					<div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm shadow-md">
						<i className="ri-calendar-todo-line"></i>
					</div>
					<div>
						<h2 className="text-sm font-black text-white uppercase tracking-wider">Airing Schedule</h2>
						<p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">Weekly Releases</p>
					</div>
				</div>

				{/* Schedule Timeline */}
				<div className="flex flex-col relative gap-4">
					{airingAnime.map((anime) => {
						const broadcastString = anime.broadcast?.string || "";
						
						// Clean up broadcast string if possible (e.g. "Mondays at 22:30 (JST)" -> "Mondays @ 22:30 JST")
						const displayTime = broadcastString
							.replace("at ", "@ ")
							.replace(" (JST)", " JST")
							.trim() || "Scheduled";

						return (
							<div
								key={anime.mal_id}
								onClick={() => navigate(`/anime/${anime.mal_id}`)}
								className="flex gap-4 p-2 bg-zinc-950/20 hover:bg-zinc-850/50 rounded-2xl border border-transparent hover:border-zinc-800/80 cursor-pointer transition-all duration-300 hover:translate-x-1.5 group/item"
							>
								{/* Thumbnail */}
								<div className="w-12 h-16 rounded-xl overflow-hidden shrink-0 border border-zinc-850 select-none">
									<img
										src={anime.images?.jpg?.image_url || anime.images?.jpg?.large_image_url}
										alt={anime.title}
										className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-500"
									/>
								</div>

								{/* Metadata */}
								<div className="flex flex-col justify-between flex-1 py-0.5 min-w-0">
									<h3 className="text-xs font-bold text-zinc-100 line-clamp-1 group-hover/item:text-indigo-400 transition-colors leading-tight">
										{anime.title}
									</h3>
									
									<div className="flex flex-col gap-1 mt-1.5">
										{/* Time pill badge */}
										<span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-300">
											<i className="ri-time-line text-[11px] text-indigo-400"></i>
											{displayTime}
										</span>
										
										{/* Day details */}
										<span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">
											{anime.broadcast?.day || "Weekly"}
										</span>
									</div>
								</div>
							</div>
						);
					})}
				</div>

				{/* Footnote */}
				<div className="mt-5 pt-3 border-t border-zinc-850 flex justify-between items-center text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
					<span>Auto-sync active</span>
					<span className="text-indigo-400/80">Jikan API v4</span>
				</div>
			</div>
		</section>
	);
}
