import { useEffect, useState } from "react";
import Footer from "../components/Footer";

export default function ProfilePage() {
	const [userData, setUserData] = useState(null);
	const [activeWatchStatus, setActiveWatchStatus] = useState("Watching");
	const [editing, setEditing] = useState(false);

	useEffect(() => {
		const username = localStorage.getItem("username") || "GuestUser";

		setUserData({
			name: username,
			handle: `@${username.toLowerCase()}`,
			location: "Tokyo, Japan",
			joined: "March 2026",
			avatar: "https://wallpapercave.com/uwp/uwp4985551.jpeg",
			bio: "Anime lover & review writer.",
			points: 3200,
			loginStreak: 7,
			badges: ["Top Reviewer", "100 Reviews"],
			stats: {
				reviews: 247,
				followers: 1842,
				following: 326,
				watchlist: 89,
			},
			favoriteGenres: ["Action", "Romance", "Sci-Fi"],
			reviews: [
				{
					title: "Attack on Titan Final Season",
					rating: 9.5,
					description:
						"An absolute masterpiece that concludes the epic saga with stunning animation and heart-wrenching storytelling.",
				},
				{
					title: "Demon Slayer: Swordsmith Village Arc",
					rating: 8.8,
					description:
						"Beautiful animation and intense fights. The new characters shine.",
				},
				{
					title: "Jujutsu Kaisen Season 2",
					rating: 9.2,
					description:
						"Dark, emotional, and visually stunning. MAPPA delivers again.",
				},
			],
			watchlistItems: [
				{ title: "Demon Slayer", status: "Watching" },
				{ title: "Jujutsu Kaisen", status: "Completed" },
				{ title: "Chainsaw Man", status: "Plan to Watch" },
				{ title: "Spy x Family", status: "On-Hold" },
				{ title: "Tokyo Ghoul", status: "Dropped" },
			],
		});
	}, []);

	if (!userData) return null;

	const WATCH_STATUSES = [
		"Watching",
		"Completed",
		"Dropped",
		"On-Hold",
		"Plan to Watch",
	];

	const filteredWatchlist = userData.watchlistItems.filter(
		(item) => item.status === activeWatchStatus
	);

	const animatedUnlocked = userData.points >= 5000;

	return (
		<div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
			<main className="flex-1 max-w-7xl mx-auto px-6 py-10">
				{/* Header */}
				<div className="bg-zinc-900 rounded-2xl p-8 shadow-lg mb-8">
					<div className="flex items-center gap-6">
						<img
							src={userData.avatar}
							alt="avatar"
							className={`w-24 h-24 rounded-full border-4 border-indigo-500 ${
								animatedUnlocked ? "animate-pulse" : ""
							}`}
						/>

						<div>
							<h1 className="text-3xl font-bold">{userData.name}</h1>
							<p className="text-zinc-400">{userData.handle}</p>
							<p className="text-sm text-zinc-500 mt-1">
								Joined {userData.joined} • {userData.location}
							</p>
							<p className="text-sm text-indigo-400 mt-1">
								🔥 {userData.points} Points • 🔁 {userData.loginStreak} Day
								Streak
							</p>
							<p className="text-sm text-zinc-400 mt-2">{userData.bio}</p>
						</div>

						<button
							onClick={() => setEditing(true)}
							className="ml-auto px-4 py-2 bg-indigo-600 rounded-xl hover:bg-indigo-500"
						>
							Edit
						</button>
					</div>
				</div>

				<div className="grid md:grid-cols-4 gap-8">
					{/* Left Sidebar */}
					<div className="space-y-6">
						<div className="bg-zinc-900 rounded-xl p-6">
							<h2 className="font-semibold mb-4">Profile Stats</h2>
							<div className="space-y-2 text-sm text-zinc-400">
								<p>Reviews: {userData.stats.reviews}</p>
								<p>Followers: {userData.stats.followers}</p>
								<p>Following: {userData.stats.following}</p>
								<p>Watchlist: {userData.stats.watchlist}</p>
							</div>
						</div>

						<div className="bg-zinc-900 rounded-xl p-6">
							<h2 className="font-semibold mb-4">Favorite Genres</h2>
							<div className="flex flex-wrap gap-2">
								{userData.favoriteGenres.map((genre) => (
									<span
										key={genre}
										className="px-3 py-1 text-xs bg-indigo-600 rounded-full"
									>
										{genre}
									</span>
								))}
							</div>
						</div>

						{/* Badges */}
						<div className="bg-zinc-900 rounded-xl p-6">
							<h2 className="font-semibold mb-4">Badges</h2>
							<div className="flex flex-wrap gap-2 text-sm">
								{userData.badges.map((badge) => (
									<span
										key={badge}
										className="px-3 py-1 bg-zinc-800 rounded-full"
									>
										🏅 {badge}
									</span>
								))}
							</div>
						</div>
					</div>

					{/* Reviews + Watchlist */}
					<div className="md:col-span-3 space-y-6">
						<h2 className="text-xl font-semibold mb-4">Reviews</h2>

						{userData.reviews.map((review, index) => (
							<div
								key={index}
								className="bg-zinc-900 rounded-xl p-6 hover:bg-zinc-800 transition"
							>
								<div className="flex justify-between items-center mb-2">
									<h3 className="font-semibold">{review.title}</h3>
									<span className="bg-indigo-600 px-3 py-1 rounded-lg text-sm">
										⭐ {review.rating}
									</span>
								</div>
								<p className="text-zinc-400 text-sm">{review.description}</p>
							</div>
						))}

						{/* WATCHLIST SECTION */}
						<h2 className="text-xl font-semibold mt-10 mb-4">Watchlist</h2>

						<div className="flex gap-4 flex-wrap mb-4">
							{WATCH_STATUSES.map((status) => (
								<button
									key={status}
									onClick={() => setActiveWatchStatus(status)}
									className={`px-3 py-1 rounded-lg text-sm ${
										activeWatchStatus === status
											? "bg-indigo-600"
											: "bg-zinc-800"
									}`}
								>
									{status}
								</button>
							))}
						</div>

						{filteredWatchlist.map((item, i) => (
							<div key={i} className="bg-zinc-900 p-4 rounded-lg text-sm">
								{item.title}
							</div>
						))}
					</div>
				</div>

				{/* EDIT MODAL */}
				{editing && (
					<div className="fixed inset-0 bg-black/70 flex items-center justify-center">
						<div className="bg-zinc-900 p-8 rounded-xl w-96">
							<h2 className="text-lg font-semibold mb-4">Edit bio</h2>

							<textarea
								defaultValue={userData.bio}
								className="w-full p-2 bg-zinc-800 rounded mb-4"
							/>

							<button
								onClick={() => setEditing(false)}
								className="w-full bg-indigo-600 py-2 rounded-lg"
							>
								Save Changes
							</button>
						</div>
					</div>
				)}
			</main>

			<Footer />
		</div>
	);
}
