import { useEffect, useState } from "react";
import { getUpcomingAnime } from "../api/jikan";
import { useNavigate } from "react-router-dom";

export default function UpcomingPage() {
	const [animeList, setAnimeList] = useState([]);
	const [page, setPage] = useState(1);
	const navigate = useNavigate();

	useEffect(() => {
		async function load() {
			try {
				const data = await getUpcomingAnime(page);
				setAnimeList(data);
			} catch (err) {
				console.log("Error loading upcoming anime", err);
			}
		}
		load();
	}, [page]);

	return (
		<div className="min-h-screen bg-zinc-950 text-white flex">
			{/* SIDEBAR */}
			<div className="w-64 bg-zinc-900 border-r border-zinc-800 p-6 space-y-6">
				<h2 className="text-xl font-bold text-indigo-400"></h2>
				{/* Blank for now, content to be added later */}
			</div>

			{/* MAIN CONTENT */}
			<div className="flex-1 p-10">
				<h1 className="text-4xl font-bold mb-10 text-indigo-400">UPCOMING</h1>

				<div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{animeList.map((anime) => (
						<div
							key={anime.mal_id}
							className="bg-zinc-900 rounded-2xl overflow-hidden hover:scale-105 transition group flex flex-col min-h-112"
						>
							{/* IMAGE */}
							<div className="relative">
								<img
									src={anime.images.jpg.image_url}
									alt={anime.title}
									className="h-70 w-full object-cover"
								/>
								<span className="absolute top-2 left-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded-md">
									{anime.type || "TBA"}
								</span>
								<span className="absolute bottom-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-md">
									Preview
								</span>
							</div>

							{/* CONTENT */}
							<div className="p-5 flex flex-col flex-1">
								<h3 className="font-semibold text-sm line-clamp-2">
									{anime.title}
								</h3>
								<div className="mt-2">
									<p className="text-yellow-400 text-sm flex items-center">
										<i className="ri-star-fill text-amber-400 mr-1"></i> {anime.score || "N/A"}
									</p>
									<p className="text-zinc-400 text-xs mt-1 line-clamp-2">
										{anime.aired?.string || "TBA"}
									</p>
								</div>

								{/* VIEW DETAILS BUTTON */}
								<div className="mt-auto pt-4">
									<button
										onClick={() => navigate(`/anime/${anime.mal_id}`)}
										className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded-lg text-sm cursor-pointer transition"
									>
										View Details
									</button>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* PAGINATION */}
				<div className="flex justify-center gap-4 mt-12">
					<button
						onClick={() => setPage((p) => Math.max(p - 1, 1))}
						className="px-5 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition"
					>
						Prev
					</button>

					<span className="px-4 py-2">Page {page}</span>

					<button
						onClick={() => setPage((p) => p + 1)}
						className="px-5 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition"
					>
						Next
					</button>
				</div>
			</div>
		</div>
	);
}
