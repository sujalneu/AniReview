import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TrendingSlider from "../components/TrendingSlider";
import QuoteOfDay from "../components/QuoteOfDay";
import TrendingReviews from "../components/TrendingReviews";
import TopRated from "../components/TopRated";
import Genres from "../components/Genres";
import Footer from "../components/Footer";
import UpcomingAnime from "../components/UpcomingAnime";
import AiringSchedule from "../components/AiringSchedule";
import DailyTrivia from "../components/DailyTrivia";

import { getUpcomingAnime, getTopAnime, getTrending } from "../api/jikan";
import "remixicon/fonts/remixicon.css";

const genres = [
	{ name: "Action", icon: "ri-sword-line" },
	{ name: "Romance", icon: "ri-heart-line" },
	{ name: "Isekai", icon: "ri-rocket-line" },
	{ name: "Adventure", icon: "ri-map-line" },
	{ name: "Fantasy", icon: "ri-magic-line" },
	{ name: "Sci-Fi", icon: "ri-rocket-line" }, // Changed sci-fi to rocket or similar standard icon
];

export default function HomePage() {
	const navigate = useNavigate();
	const [upcomingAnime, setUpcomingAnime] = useState([]);
	const [topRated, setTopRated] = useState([]);
	const [trendingAnime, setTrendingAnime] = useState([]);
	const [trendingReviews, setTrendingReviews] = useState([]);
	const [personalizedRecommendations, setPersonalizedRecommendations] = useState([]);
	const [loadingRecommendations, setLoadingRecommendations] = useState(true);
	const [quoteOfDay, setQuoteOfDay] = useState({
		anime: "Loading...",
		character: "Loading...",
		quote: "Fetching today's quote...",
	});

	useEffect(() => {
		async function fetchTrendingReviews() {
			try {
				const res = await fetch("http://localhost:8000/api/reviews/trending");
				const data = await res.json();
				setTrendingReviews(data);
			} catch (err) {
				console.error("Failed to fetch trending reviews:", err);
			}
		}
		fetchTrendingReviews();
	}, []);

	useEffect(() => {
		async function fetchQuote() {
			try {
				const res = await fetch("http://localhost:8000/api/quotes/daily");
				const data = await res.json();
				if (data && data.text) {
					setQuoteOfDay({
						anime: data.anime,
						character: data.character,
						quote: data.text,
					});
				}
			} catch (err) {
				console.error("Failed to fetch daily quote", err);
			}
		}
		fetchQuote();
	}, []);

	useEffect(() => {
		async function loadUpcoming() {
			const data = await getUpcomingAnime();
			setUpcomingAnime(data.slice(0, 15));
		}
		loadUpcoming();
	}, []);

	useEffect(() => {
		async function loadTrending() {
			try {
				const data = await getTrending();
				const mapped = data.map((anime) => ({
					id: anime.mal_id,
					title: anime.title,
					img: anime.images.jpg.large_image_url,
					synopsis: anime.synopsis || "No synopsis available",
					trailer: anime.trailer?.url || "#",
				}));
				setTrendingAnime(mapped);
			} catch (err) {
				console.error("Failed to fetch trending anime:", err);
			}
		}
		loadTrending();
	}, []);

	useEffect(() => {
		const fetchTopRated = async () => {
			try {
				const data = await getTopAnime();
				setTopRated(data);
			} catch (err) {
				console.error("Failed to fetch top rated anime:", err);
			}
		};
		fetchTopRated();
	}, []);

	useEffect(() => {
		async function fetchRecommendations() {
			const token = localStorage.getItem("token");
			const isGuest = localStorage.getItem("isGuest") === "true";

			if (!token || isGuest) {
				try {
					const data = await getTopAnime();
					setPersonalizedRecommendations(data.slice(6, 18).map(a => ({
						mal_id: a.mal_id,
						title: a.title,
						image: a.images?.jpg?.large_image_url || a.images?.jpg?.image_url,
						score: a.score,
						reason: "Popular hit on AniReview"
					})));
				} catch (err) {
					console.error("Failed fetching guest recommendations:", err);
				} finally {
					setLoadingRecommendations(false);
				}
				return;
			}

			try {
				const res = await fetch("http://localhost:8000/api/users/recommendations/personalized", {
					headers: { Authorization: `Bearer ${token}` }
				});
				if (res.ok) {
					const data = await res.json();
					setPersonalizedRecommendations(data);
				}
			} catch (err) {
				console.error("Failed fetching personalized recommendations:", err);
			} finally {
				setLoadingRecommendations(false);
			}
		}

		fetchRecommendations();
	}, []);

	useEffect(() => {
		const token = localStorage.getItem("token");
		const isGuest = localStorage.getItem("isGuest") === "true";

		if (!token && !isGuest) {
			navigate("/auth");
		}
	}, [navigate]);

	useEffect(() => {
		const token = localStorage.getItem("token");
		const isGuest = localStorage.getItem("isGuest") === "true";
		const checkInRan = sessionStorage.getItem("checkInRan") === "true";

		if (!token || isGuest || checkInRan) return;

		// Set sessionStorage so we don't trigger it again in this tab session
		sessionStorage.setItem("checkInRan", "true");

		const getTodayStr = () => {
			const d = new Date();
			return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
		};
		const getYesterdayStr = () => {
			const d = new Date();
			d.setDate(d.getDate() - 1);
			return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
		};

		async function runCheckIn() {
			try {
				const res = await axios.post(
					"http://localhost:8000/api/users/auth/check-in",
					{ today: getTodayStr(), yesterday: getYesterdayStr() },
					{ headers: { Authorization: `Bearer ${token}` } }
				);

				const { streakUpdated, streakPoints, streakMessage, pollPoints, wonPollsCount } = res.data;

				if (streakUpdated) {
					setTimeout(() => {
						window.dispatchEvent(new CustomEvent("show-points-popup", {
							detail: { points: streakPoints, reason: streakMessage }
						}));
					}, 1500); // 1.5 seconds delay so it pops up after main content mount animations finish
				}

				if (pollPoints > 0) {
					setTimeout(() => {
						window.dispatchEvent(new CustomEvent("show-points-popup", {
							detail: { points: pollPoints, reason: `Won ${wonPollsCount} poll prediction(s)!` }
						}));
					}, streakUpdated ? 5500 : 1500);
				}
			} catch (err) {
				console.error("Check-in error:", err);
			}
		}

		// Delay slightly on mount so the user experiences the homepage fade-in first
		const timeoutId = setTimeout(runCheckIn, 2000);
		return () => clearTimeout(timeoutId);
	}, []);

	return (
		<div 
			className="min-h-screen text-zinc-100 flex flex-col relative"
			style={{
				backgroundImage: "linear-gradient(to bottom, rgba(9, 9, 11, 0.85), rgba(9, 9, 11, 0.98)), url('https://cdn.myanimelist.net/images/anime/5/87048l.jpg')",
				backgroundSize: "cover",
				backgroundPosition: "center",
				backgroundAttachment: "fixed"
			}}
		>
			
			{/* Main Content Area */}
			<main className="flex-1 w-full mx-auto px-4 md:px-8 py-8 max-w-[1600px] space-y-12">
				
				{/* Hero Slider Section */}
				<TrendingSlider trendingAnime={trendingAnime} />

				{/* Two Column Layout Grid */}
				<div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-10">
					
					{/* Left Main Content Stream */}
					<div className="space-y-12 min-w-0">
						
						{/* Personalized Recommendations */}
						{personalizedRecommendations.length > 0 && (
							<section className="space-y-6">
								<div className="flex items-center justify-between border-b border-zinc-900 pb-4">
									<div>
										<h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
											<i className="ri-magic-line text-indigo-400"></i> Recommended for You
										</h2>
										<p className="text-zinc-500 text-xs mt-1">
											{localStorage.getItem("isGuest") === "true"
												? "Sign in to unlock fully personalized recommendations!"
												: "Custom recommendations tailored to your genres & watchlist."}
										</p>
									</div>
								</div>

								{/* Grid of clean premium cards */}
								<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
									{personalizedRecommendations.slice(0, 5).map((anime) => (
										<div
											key={anime.mal_id}
											onClick={() => navigate(`/anime/${anime.mal_id}`)}
											className="bg-zinc-900/40 border border-zinc-850 hover:border-zinc-700/80 rounded-2xl overflow-hidden hover:scale-[1.03] transition-all duration-300 shadow-md hover:shadow-indigo-500/5 group flex flex-col cursor-pointer"
										>
											<div className="relative h-60 w-full overflow-hidden select-none">
												<img
													src={anime.image}
													alt={anime.title}
													className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
												/>
												<div className="absolute inset-0 bg-gradient-to-t from-zinc-950/20 to-transparent"></div>
											</div>
											
											{/* Card Details Box */}
											<div className="p-4 flex flex-col justify-between flex-1 gap-2.5">
												<h3 className="font-bold text-sm text-zinc-200 group-hover:text-indigo-400 transition-colors line-clamp-2 leading-tight" title={anime.title}>
													{anime.title}
												</h3>
												<div className="flex justify-between items-center mt-auto pt-1.5 border-t border-zinc-900/40 text-xs">
													{anime.score ? (
														<span className="text-amber-400 font-bold flex items-center">
															<i className="ri-star-fill text-amber-500 mr-0.5"></i>
															{anime.score}
														</span>
													) : (
														<span className="text-zinc-500">N/A</span>
													)}
													
													{anime.reason && (
														<span className="text-[9px] uppercase tracking-wider bg-indigo-500/10 text-indigo-400 font-black px-1.5 py-0.5 rounded border border-indigo-500/20 max-w-[100px] truncate">
															{anime.reason.replace("on AniReview", "")}
														</span>
													)}
												</div>
											</div>
										</div>
									))}
								</div>
							</section>
						)}

						{/* Top Rated Horizontal Slider */}
						<TopRated topRated={topRated} />
						
						{/* Upcoming Horizontal Slider */}
						<UpcomingAnime upcoming={upcomingAnime} />
						
					</div>

					{/* Right Sidebar Stream */}
					<div className="space-y-8 xl:pl-6 xl:border-l xl:border-zinc-900/60">
						{/* Daily Trivia Dashboard */}
						<DailyTrivia />
						
						{/* Quote of the Day Board */}
						<QuoteOfDay quoteOfDay={quoteOfDay} />
						
						{/* Airing Schedule Timeline */}
						<AiringSchedule />
					</div>

				</div>
			</main>
			
			{/* Bottom Full-width Components */}
			<div className="mt-12 space-y-0">
				{/* Trending Reviews Slider */}
				<TrendingReviews trendingReviews={trendingReviews} />
				
				{/* Category Browse Board */}
				<Genres genres={genres} />
			</div>

			<Footer />
		</div>
	);
}
