import { useNavigate } from "react-router-dom";

export default function Footer() {
	const navigate = useNavigate();

	return (
		<footer className="border-t border-zinc-900 bg-zinc-950 text-zinc-400 select-none">
			<div className="max-w-[1600px] mx-auto px-6 md:px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-10 text-sm">
				
				{/* Brand Section */}
				<div className="space-y-4">
					<h3
						className="text-lg font-black text-indigo-400 cursor-pointer tracking-tight"
						onClick={() => navigate("/home")}
					>
						AniReview
					</h3>
					<p className="text-zinc-500 leading-relaxed text-xs">
						Discover new titles, write deep reviews, participate in interactive community polls, and celebrate anime culture on a modern, high-performance platform.
					</p>
					
					{/* Social Handles (Sleek circular frames) */}
					<div className="flex gap-3 pt-2">
						<a href="#discord" className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-indigo-600 hover:text-white border border-zinc-850 hover:border-indigo-500 flex items-center justify-center text-zinc-400 transition-all duration-300">
							<i className="ri-discord-line"></i>
						</a>
						<a href="#twitter" className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-indigo-600 hover:text-white border border-zinc-850 hover:border-indigo-500 flex items-center justify-center text-zinc-400 transition-all duration-300">
							<i className="ri-twitter-x-line"></i>
						</a>
						<a href="#reddit" className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-indigo-600 hover:text-white border border-zinc-850 hover:border-indigo-500 flex items-center justify-center text-zinc-400 transition-all duration-300">
							<i className="ri-reddit-line"></i>
						</a>
					</div>
				</div>

				{/* Explore Column */}
				<div className="space-y-4">
					<h4 className="text-white font-bold tracking-wide uppercase text-xs">Explore</h4>
					<ul className="space-y-2.5 text-xs text-zinc-500">
						<li>
							<button onClick={() => navigate("/home")} className="hover:text-indigo-400 cursor-pointer transition-colors">
								Home Feed
							</button>
						</li>
						<li>
							<button onClick={() => navigate("/reviews")} className="hover:text-indigo-400 cursor-pointer transition-colors">
								Anime Reviews
							</button>
						</li>
						<li>
							<button onClick={() => navigate("/toprated")} className="hover:text-indigo-400 cursor-pointer transition-colors">
								Top Rated List
							</button>
						</li>
					</ul>
				</div>

				{/* Community Column */}
				<div className="space-y-4">
					<h4 className="text-white font-bold tracking-wide uppercase text-xs">Community</h4>
					<ul className="space-y-2.5 text-xs text-zinc-500">
						<li>
							<button onClick={() => navigate("/community")} className="hover:text-indigo-400 cursor-pointer transition-colors">
								Discussions & Feed
							</button>
						</li>
						<li>
							<button onClick={() => navigate("/chat")} className="hover:text-indigo-400 cursor-pointer transition-colors">
								Real-time Chat
							</button>
						</li>
					</ul>
				</div>

				{/* API / Attribution Column */}
				<div className="space-y-4">
					<h4 className="text-white font-bold tracking-wide uppercase text-xs">Credits</h4>
					<p className="text-zinc-500 text-xs leading-relaxed">
						All anime details, trending catalogs, and airing schedules are synced in real-time from the public Jikan API (MyAnimeList database wrapper).
					</p>
					<div className="pt-1.5">
						<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400 text-[10px] font-bold border border-indigo-500/20">
							<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
							API Status: Operational
						</span>
					</div>
				</div>

			</div>

			{/* Copyright Bar */}
			<div className="border-t border-zinc-900/60 py-6 text-center text-xs text-zinc-600 bg-zinc-950 max-w-[1600px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
				<span>© 2026 AniReview. Created for anime enthusiasts worldwide.</span>
				<div className="flex gap-4 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
					<a href="#privacy" className="hover:text-indigo-400 transition-colors">Privacy Policy</a>
					<span>•</span>
					<a href="#terms" className="hover:text-indigo-400 transition-colors">Terms of Service</a>
				</div>
			</div>
		</footer>
	);
}
