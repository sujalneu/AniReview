import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getByGenre } from "../api/jikan";

const genreMap = {
	action: 1,
	adventure: 2,
	cars: 3,
	comedy: 4,
	dementia: 5,
	demons: 6,
	mystery: 7,
	drama: 8,
	horror: 9,
	fantasy: 10,
	game: 11,
	harem: 12,
	martialarts: 17,
	school: 23,
	scifi: 24,
	sports: 30,
	isekai: 55,
	romance: 22,
};

export default function GenrePage() {
	const { genreName } = useParams();
	const [animeList, setAnimeList] = useState([]);
	const [page, setPage] = useState(1);
	// const [year, setYear] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		async function load() {
			const id = genreMap[genreName.toLowerCase()];
			if (!id) return;

			let data = await getByGenre(id, page);
			setAnimeList(data);
		}
		load();
	}, [genreName, page]);

	return (
		<div className="min-h-screen bg-zinc-950 text-white flex">
			{/* SIDEBAR */}
			<div className="w-64 bg-zinc-900 border-r border-zinc-800 p-6 space-y-6">
				<h2 className="text-xl font-bold text-indigo-400"></h2>

				<div>
					{/* <label className="text-sm text-zinc-400"></label>
					<input
						type="number"
						placeholder="e.g 2020"
						value={year}
						onChange={(e) => setYear(e.target.value)}
						className="w-full mt-2 px-3 py-2 bg-zinc-800 rounded-lg"
					/> */}
				</div>

				{/* <button
					onClick={() => setPage(1)}
					className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded-lg"
				>
					Apply Filters
				</button> */}
			</div>

			{/* MAIN CONTENT */}
			<div className="flex-1 p-10">
				<h1 className="text-4xl font-bold mb-10 text-indigo-400 capitalize">
					{genreName} Anime
				</h1>

				<div className="grid md:grid-cols-4 gap-8">
					{animeList.map((anime) => (
						<div
							key={anime.mal_id}
							className="bg-zinc-900 rounded-2xl overflow-hidden hover:scale-105 transition group flex flex-col h-120"
						>
							{/* IMAGE */}
							<img
								src={anime.images.jpg.image_url}
								className="h-64 w-full object-cover"
							/>

							{/* CONTENT */}
							<div className="p-4 flex flex-col flex-1">
								{/* TITLE */}
								<h2 className="font-semibold text-lg line-clamp-2 min-h-14">
									{anime.title}
								</h2>

								{/* SCORE */}
								<p className="text-yellow-400 text-sm">
									⭐ {anime.score || "N/A"}
								</p>

								{/* RELEASE DATE
								<p className="text-zinc-500 text-xs mt-1">
									📅{" "}
									{anime.aired?.from
										? new Date(anime.aired.from).getFullYear()
										: "Unknown"}
								</p> */}

								{/* SYNOPSIS */}
								<p className="text-zinc-400 text-xs mt-2 line-clamp-3 min-h-15">
									{anime.synopsis || "No synopsis available"}
								</p>

								{/* BUTTON (always bottom) */}
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
				<div className="flex justify-center gap-4 mt-10">
					<button
						onClick={() => setPage((p) => Math.max(p - 1, 1))}
						className="px-4 py-2 bg-zinc-800 rounded-lg cursor-pointer transition hover:bg-zinc-700"
					>
						Prev
					</button>

					<span className="px-4 py-2">Page {page}</span>

					<button
						onClick={() => setPage((p) => p + 1)}
						className="px-4 py-2 bg-zinc-800 rounded-lg cursor-pointer transition hover:bg-zinc-700"
					>
						Next
					</button>
				</div>
			</div>
		</div>
	);
}
