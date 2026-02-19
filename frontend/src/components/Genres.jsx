import { useNavigate } from "react-router-dom";

export default function Genres({ genres }) {
	const navigate = useNavigate();

	return (
		<section>
			<h2 className="text-2xl mt-25 font-semibold text-center">Browse by Genre</h2>
			<p className="text-zinc-500 mb-4 text-center">
				Find Reviews for your favorite anime genre
			</p>
			<div className="flex flex-wrap gap-20 mb-6 justify-center">
				{genres.map((g) => (
					<div
						key={g.name}
						onClick={() => navigate(`/genre/${g.name.toLowerCase()}`)}
						className="cursor-pointer w-32 h-40 flex flex-col items-center justify-start gap-3 p-4 rounded-xl border-0.4 hover:bg-zinc-800 transition"
					>
						<div className="w-16 h-16 flex items-center justify-center bg-zinc-800 rounded-full text-3xl">
							<i className={g.icon}></i>
						</div>
						<span className="mt-2 font-semibold text-center">{g.name}</span>
					</div>
				))}
			</div>
		</section>
	);
}
