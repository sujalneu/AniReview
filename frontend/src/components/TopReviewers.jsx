export default function TopReviewers({ topReviewers }) {
	return (
		<section className="bg-zinc-900 p-8 border border-zinc-800">
			<h2 className="text-3xl font-semibold mb-6 text-indigo-100 text-center">
				Top Reviewers
			</h2>

			<div className="grid md:grid-cols-3 gap-8">
				{topReviewers.map((u) => (
					<div
						key={u.name}
						className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex items-center gap-5 
						transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 hover:border-indigo-100/20"
					>
						{/* profile image */}
						<img
							src={u.img}
							alt={u.name}
							className="w-16 h-16 rounded-full object-cover border-2 border-indigo-400"
						/>

						{/* info */}
						<div className="flex-1">
							<h3 className="font-semibold text-lg">{u.name}</h3>
							<p className="text-zinc-400 text-sm mb-2">{u.stats}</p>

							{/* extra context */}
							<div className="flex gap-4 text-xs text-zinc-500">
								<span>⭐ Top Critic</span>
								<span>📝 Active Reviewer</span>
							</div>
						</div>

						{/* optional badge */}
						<div className="text-xs bg-indigo-600/20 text-indigo-400 px-3 py-1 rounded-full">
							Elite
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
