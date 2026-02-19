export default function QuoteOfDay({ quoteOfDay }) {
	return (
		<section>
			<h2 className="text-2xl font-semibold mb-4 ">Quote of the Day</h2>
			<div className="bg-linear-to-r border-zinc-800 rounded-xl p-8 text-center relative overflow-hidden">
				<div className="absolute inset-0 opacity-20 blur-2xl bg-gray-100"></div>
				<div className="relative z-10 max-w-3xl mx-auto">
					<p className="text-xl md:text-2xl font-medium italic text-white leading-relaxed">
						“{quoteOfDay.quote}”
					</p>
					<div className="mt-6 text-zinc-400">
						<span className="text-white font-semibold">
							{quoteOfDay.character}
						</span>{" "}
						• {quoteOfDay.anime}
					</div>
					<p className="text-xs text-zinc-500 mt-3">New quote updates daily</p>
				</div>
			</div>
		</section>
	);
}
