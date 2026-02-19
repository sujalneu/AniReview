import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAnimeById } from "../api/jikan";

export default function AnimeDetail() {
	const { id } = useParams();
	const [anime, setAnime] = useState(null);
	const [showReviewModal, setShowReviewModal] = useState(false);
	const [reviewText, setReviewText] = useState("");
	const [reviewScore, setReviewScore] = useState("");

	useEffect(() => {
		async function load() {
			const data = await getAnimeById(id);
			setAnime(data);
		}
		load();
	}, [id]);

	if (!anime) return <div className="p-10 text-white">Loading...</div>;

	return (
		<div className="min-h-screen bg-zinc-950 text-white px-6 py-12 flex flex-col md:flex-row gap-10 mx-auto relative">
			{/* Cover Image */}
			<img
				src={anime.images.jpg.large_image_url || anime.images.jpg.image_url}
				alt={anime.title}
				className="w-full md:w-80 rounded-xl border border-zinc-800 shadow-lg object-cover"
			/>

			{/* Details */}
			<div className="flex-1 flex flex-col gap-6">
				{/* Title + Rating */}
				<div>
					<h1 className="text-4xl font-bold text-indigo-400">{anime.title}</h1>
					<p className="text-yellow-400 text-lg mt-2 font-semibold">
						⭐ {anime.score || "N/A"} (
						{anime.scored_by?.toLocaleString() || "N/A"} votes)
					</p>

					{/* Genres */}
					<div className="flex flex-wrap gap-2 mt-3">
						{anime.genres?.map((g) => (
							<span
								key={g.mal_id}
								className="bg-indigo-700 text-indigo-100 px-3 py-1 rounded-full text-xs font-medium"
							>
								{g.name}
							</span>
						))}
					</div>
				</div>

				{/* Synopsis */}
				<p className="text-zinc-300 text-sm md:text-base leading-relaxed">
					{anime.synopsis || "No synopsis available."}
				</p>

				{/* Stats Card */}
				<div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 grid grid-cols-2 md:grid-cols-3 gap-4 text-zinc-400 text-sm">
					<p>📅 Release: {anime.aired?.string || "TBA"}</p>
					<p>🎬 Episodes: {anime.episodes || "N/A"}</p>
					<p>
						🏢 Studio: {anime.studios?.map((s) => s.name).join(", ") || "N/A"}
					</p>
					<p>
						🎭 Genre: {anime.genres?.map((g) => g.name).join(", ") || "N/A"}
					</p>
					<p>📊 Rank: #{anime.rank || "N/A"}</p>
					<p>❤️ Popularity: #{anime.popularity || "N/A"}</p>
				</div>

				{/* Write Review Button */}
				<button
					onClick={() => setShowReviewModal(true)}
					className="mt-4 bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg font-semibold transition w-max"
				>
					Write Review
				</button>
			</div>

			{/* Review Modal */}
			{showReviewModal && (
				<div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
					<div className="bg-zinc-900 rounded-xl p-8 w-full max-w-md relative">
						<h2 className="text-2xl font-bold text-white mb-4">
							Write Your Review
						</h2>

						<textarea
							className="w-full p-3 rounded-lg bg-zinc-800 text-white resize-none mb-4"
							rows={5}
							placeholder="Write your review..."
							value={reviewText}
							onChange={(e) => setReviewText(e.target.value)}
						></textarea>

						<input
							type="number"
							min={0}
							max={10}
							placeholder="Score out of 10"
							className="w-full p-3 rounded-lg bg-zinc-800 text-white mb-4"
							value={reviewScore}
							onChange={(e) => setReviewScore(e.target.value)}
						/>

						<div className="flex justify-end gap-3">
							<button
								onClick={() => setShowReviewModal(false)}
								className="px-4 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 font-semibold transition"
							>
								Cancel
							</button>
							<button
								onClick={() => {
									// Just close modal for now, later will handle add review logic
									setShowReviewModal(false);
									setReviewText("");
									setReviewScore("");
								}}
								className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 font-semibold transition"
							>
								Add Review
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
