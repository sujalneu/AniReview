import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { searchAnime } from "../api/jikan";

export default function SearchPage() {
	const { query } = useParams();
	const [results, setResults] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		async function run() {
			const data = await searchAnime(query);
			setResults(data);
		}
		run();
	}, [query]);

	return (
		<div className="min-h-screen bg-zinc-950 text-white p-10">
			<h1 className="text-3xl mb-8">Search: {query}</h1>

			<div className="grid md:grid-cols-5 gap-6">
				{results.map((anime) => (
					<div
						key={anime.mal_id}
						onClick={() => navigate(`/anime/${anime.mal_id}`)}
						className="cursor-pointer bg-zinc-900 rounded-xl overflow-hidden hover:scale-105 transition"
					>
						<img
							src={anime.images.jpg.image_url}
							className="h-64 w-full object-cover"
						/>
						<div className="p-3">
							<h3 className="font-semibold">{anime.title}</h3>
							<p className="text-yellow-400 text-sm">⭐ {anime.score}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
