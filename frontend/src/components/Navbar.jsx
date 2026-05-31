import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
	const [genreDropdownOpen, setGenreDropdownOpen] = useState(false);
	const [user, setUser] = useState({
		loggedIn: false,
		isGuest: false,
		avatar: "https://wallpapercave.com/uwp/uwp4985551.jpeg",
	});
	const navigate = useNavigate();

	// Ref for dropdown to detect clicks outside
	const dropdownRef = useRef(null);

	// All safe genres
	const genres = [
		{ name: "Action", icon: "ri-sword-line" },
		{ name: "Adventure", icon: "ri-map-line" },
		{ name: "Cars", icon: "ri-car-line" },
		{ name: "Comedy", icon: "ri-emotion-happy-line" },
		{ name: "Dementia", icon: "ri-brain-line" },
		{ name: "Demons", icon: "ri-fire-line" },
		{ name: "Mystery", icon: "ri-search-line" },
		{ name: "Drama", icon: "ri-drama-line" },
		{ name: "Horror", icon: "ri-ghost-line" },
		{ name: "Fantasy", icon: "ri-magic-line" },
		{ name: "Game", icon: "ri-gamepad-line" },
		{ name: "Harem", icon: "ri-group-line" },
		{ name: "MartialArts", icon: "ri-shield-line" },
		{ name: "School", icon: "ri-book-line" },
		{ name: "Sci-Fi", icon: "ri-rocket-line" },
		{ name: "Sports", icon: "ri-football-line" },
		{ name: "Isekai", icon: "ri-rocket-line" },
		{ name: "Romance", icon: "ri-heart-line" },
	];

	// Update user info from localStorage
	useEffect(() => {
		const syncUser = () => {
			const token = localStorage.getItem("token");
			const isGuest = localStorage.getItem("isGuest") === "true";
			const avatar =
				localStorage.getItem("avatar") ||
				(token ? "https://wallpapercave.com/uwp/uwp4985551.jpeg" : "");

			setUser({
				loggedIn: !!token,
				isGuest,
				avatar,
			});
		};

		syncUser();

		window.addEventListener("avatarUpdate", syncUser);
		window.addEventListener("storage", syncUser);

		return () => {
			window.removeEventListener("avatarUpdate", syncUser);
			window.removeEventListener("storage", syncUser);
		};
	}, []);

	// Close dropdown when clicking outside
	useEffect(() => {
		function handleClickOutside(event) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setGenreDropdownOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	function handleProfileClick() {
		if (user.loggedIn && !user.isGuest) {
			navigate("/profile");
		} else {
			navigate("/auth");
		}
	}

	function handleLogout() {
		localStorage.removeItem("token");
		localStorage.removeItem("userId");
		localStorage.removeItem("username");
		localStorage.setItem("isGuest", "false");
		navigate("/auth");
	}

	return (
		<nav className="border-b border-zinc-800 bg-zinc-900/90 backdrop-blur-md sticky top-0 z-1000">
			<div className="mx-auto px-6 py-4 flex justify-between items-center gap-6">
				{/* Logo */}
				<h1
					className="text-xl font-bold cursor-pointer text-indigo-400"
					onClick={() => navigate("/home")}
				>
					AniReview
				</h1>

				{/* Search Bar */}
				<div className="flex-1 max-w-lg">
					<input
						type="text"
						placeholder="Search anime..."
						className="w-full px-4 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								const query = e.target.value.trim();
								if (query) navigate(`/search/${encodeURIComponent(query)}`);
							}
						}}
					/>
				</div>

				{/* Navigation Links */}
				<div className="flex items-center gap-6 text-sm text-zinc-400 relative">
					<button
						onClick={() => navigate("/home")}
						className="hover:text-white cursor-pointer transition"
					>
						Home
					</button>
					<button
						onClick={() => navigate("/reviews")}
						className="hover:text-white cursor-pointer transition"
					>
						Reviews
					</button>

					{/* Genres dropdown */}
					<div className="relative" ref={dropdownRef}>
						<button
							onClick={() => setGenreDropdownOpen(!genreDropdownOpen)}
							className="hover:text-white cursor-pointer transition"
						>
							Genres
						</button>
						{genreDropdownOpen && (
							<div className="absolute mt-2 w-48 max-h-64 overflow-y-auto bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg z-50 scrollbar-none">
								{genres.map((g) => (
									<button
										key={g.name}
										onClick={() => {
											navigate(`/genre/${g.name.toLowerCase()}`);
											setGenreDropdownOpen(false);
										}}
										className="w-full text-left px-4 py-2 hover:bg-zinc-800 transition cursor-pointer"
									>
										{g.name}
									</button>
								))}
							</div>
						)}
					</div>

					<button
						onClick={() => navigate("/community")}
						className="hover:text-white cursor-pointer transition"
					>
						Community
					</button>
					<button
						onClick={() => navigate("/toprated")}
						className="hover:text-white cursor-pointer transition"
					>
						Top Rated
					</button>
					{user.loggedIn && !user.isGuest && (
						<button
							onClick={() => navigate("/chat")}
							className="hover:text-white cursor-pointer transition"
						>
							Chat
						</button>
					)}
				</div>

				{/* Profile / Guest */}
				<div className="flex items-center gap-3">
					{user.loggedIn && !user.isGuest ? (
						<>
							<NotificationBell />
							<button
								onClick={handleProfileClick}
								className="cursor-pointer w-10 h-10 rounded-full border border-zinc-700 overflow-hidden hover:border-white transition"
							>
								<img
									src={user.avatar}
									alt="profile"
									className="w-full h-full object-cover"
								/>
							</button>
							<button
								onClick={handleLogout}
								className="px-4 py-1 bg-red-600 text-white rounded-xl hover:bg-red-700 transition cursor-pointer"
							>
								Logout
							</button>
						</>
					) : (
						<button
							onClick={() => navigate("/auth")}
							className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition"
						>
							Sign In
						</button>
					)}
				</div>
			</div>
		</nav>
	);
}
