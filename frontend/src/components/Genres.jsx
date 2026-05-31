import { useNavigate } from "react-router-dom";

export default function Genres({ genres }) {
	const navigate = useNavigate();

	return (
		<section className="w-full py-16 bg-zinc-950/20 border-t border-zinc-900">
			<div className="max-w-[1600px] mx-auto px-6 md:px-8">
				
				{/* Section Header */}
				<div className="text-center max-w-xl mx-auto mb-12">
					<span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full backdrop-blur-md">
						Explore Categories
					</span>
					<h2 className="text-3xl font-black text-white mt-4 tracking-tight">
						Browse by Genre
					</h2>
					<p className="text-zinc-500 text-sm mt-2 leading-relaxed">
						Find comprehensive ratings, reviews, and detailed watchlists for your favorite anime styles.
					</p>
				</div>

				{/* Grid Container */}
				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
					{genres.map((g) => (
						<div
							key={g.name}
							onClick={() => navigate(`/genre/${g.name.toLowerCase()}`)}
							className="cursor-pointer bg-zinc-900/30 border border-zinc-850 hover:border-indigo-500/40 hover:bg-zinc-900/60 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.03] shadow-md hover:shadow-indigo-500/5 hover:shadow-xl text-center flex flex-col items-center justify-center gap-4 relative overflow-hidden group"
						>
							{/* Subtle background glow card gradient */}
							<div className="absolute inset-0 bg-radial from-indigo-500/0 hover:from-indigo-500/5 to-transparent transition-all duration-500"></div>

							{/* Icon Frame */}
							<div className="w-14 h-14 flex items-center justify-center bg-zinc-950/80 group-hover:bg-indigo-600 border border-zinc-800 group-hover:border-indigo-500 rounded-full text-indigo-400 group-hover:text-white text-2xl transition-all duration-500 shadow-inner group-hover:scale-105 group-hover:rotate-6">
								<i className={`${g.icon} group-hover:animate-pulse`}></i>
							</div>

							{/* Text Label */}
							<div>
								<span className="font-bold text-sm text-zinc-200 group-hover:text-white transition-colors block">
									{g.name}
								</span>
								<span className="text-[10px] text-zinc-500 group-hover:text-indigo-400 transition-colors uppercase font-bold tracking-widest mt-0.5 block">
									View All
								</span>
							</div>
						</div>
					))}
				</div>

			</div>
		</section>
	);
}
