import { useNavigate } from "react-router-dom";

export default function FirstPage() {
	const navigate = useNavigate();

	return (
		<div
			className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
			style={{
				backgroundImage: "url('/src/assets/anime-bg.jpg')", 
			}}
		>
			{/* dark overlay */}
			<div className="absolute inset-0 bg-black/70"></div>

			{/* center card */}
			<div className="relative z-10 backdrop-blur-xl bg-zinc-900/70 border border-zinc-800 rounded-3xl shadow-2xl p-10 w-[90%] max-w-lg text-center space-y-6">
				<h1 className="text-4xl font-bold text-white tracking-wide">
					Welcome to <span className="text-indigo-400">AniReview</span>
				</h1>

				<p className="text-zinc-400 text-lg">
					Discover. Review. Rate. Join the ultimate anime community.
				</p>

				<button
					onClick={() => navigate("/auth")}
					className="mt-4 w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 transition text-white font-semibold text-lg shadow-lg cursor-pointer"
				>
					Sign In
				</button>
			</div>
		</div>
	);
}
