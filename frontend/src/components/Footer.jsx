export default function Footer() {
	return (
		<footer className="border-t border-zinc-800 bg-zinc-900 text-zinc-400">
			<div className="max-w-7xl mx-auto px-6 py-8 grid md:grid-cols-3 gap-6 text-sm">
				<div>
					<h3 className="text-white font-semibold mb-2">AniReview</h3>
					<p>
						Discover, review, and celebrate anime culture with a modern
						community platform.
					</p>
				</div>

				<div>
					<h3 className="text-white font-semibold mb-2">Explore</h3>
					<p>Reviews</p>
					<p>Genres</p>
					<p>Community</p>
				</div>

				<div>
					<h3 className="text-white font-semibold mb-2">Community</h3>
					<p>Top Reviewers</p>
					<p>Trending Anime</p>
					<p>Events & Discussions</p>
				</div>
			</div>

			<div className="text-center text-xs py-4 border-t border-zinc-800">
				© 2026 AniReview — Built for anime fans.
			</div>
		</footer>
	);
}
