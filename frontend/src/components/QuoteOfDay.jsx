export default function QuoteOfDay({ quoteOfDay }) {
	return (
		<section className="w-full">
			{/* Widget container */}
			<div className="relative overflow-hidden bg-zinc-900/40 border border-zinc-850 rounded-3xl p-6 shadow-xl backdrop-blur-md group">
				
				{/* Elegant Radial Gradient Glow behind Quote */}
				<div className="absolute inset-0 opacity-15 bg-radial from-indigo-500 via-purple-500 to-transparent blur-xl transition-transform duration-500 group-hover:scale-110"></div>
				
				{/* Decorative Quotation Marks */}
				<span className="absolute top-2 left-4 text-6xl text-indigo-500/10 font-serif select-none pointer-events-none">
					“
				</span>
				<span className="absolute bottom-2 right-4 text-6xl text-indigo-500/10 font-serif select-none pointer-events-none">
					”
				</span>

				{/* Content wrapper */}
				<div className="relative z-10 flex flex-col items-center text-center">
					{/* Small Header Tag */}
					<div className="flex items-center gap-1.5 mb-4 text-[10px] uppercase tracking-widest font-black text-indigo-400">
						<i className="ri-double-quotes-l"></i>
						<span>Quote of the Day</span>
					</div>

					{/* Quote text */}
					<p className="text-zinc-100 font-medium italic text-base leading-relaxed tracking-wide mb-5">
						“{quoteOfDay.quote}”
					</p>

					{/* Attribution */}
					<div className="flex flex-col items-center gap-0.5">
						<span className="text-sm font-bold text-white tracking-wide">
							{quoteOfDay.character}
						</span>
						<span className="text-xs text-indigo-300/80 font-medium">
							{quoteOfDay.anime}
						</span>
					</div>

					{/* Small Footer caption */}
					<div className="w-full border-t border-zinc-850 mt-5 pt-3 flex justify-center items-center text-[9px] font-bold text-zinc-500 uppercase tracking-widest gap-1">
						<i className="ri-time-line"></i>
						<span>Resets every 24 hours</span>
					</div>
				</div>

			</div>
		</section>
	);
}
