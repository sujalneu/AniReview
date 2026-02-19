import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TrendingSlider from "../components/TrendingSlider";
import QuoteOfDay from "../components/QuoteOfDay";
import TrendingReviews from "../components/TrendingReviews";
import TopReviewers from "../components/TopReviewers";
import TopRated from "../components/TopRated";
import Genres from "../components/Genres";
import Footer from "../components/Footer";
import UpcomingAnime from "../components/UpcomingAnime"; // <-- new import

import { getUpcomingAnime } from "../api/jikan";
import { getTopAnime } from "../api/jikan";
import { getTrending } from "../api/jikan";
import "remixicon/fonts/remixicon.css";

const trendingReviews = [
	{
		title: "Demon Slayer",
		img: "https://wallpapercave.com/uwp/uwp4700274.jpeg",
		review: "A masterpiece of animation and storytelling.",
		rating: "9.5",
		user: "John Doe",
	},
	{
		title: "Jujutsu Kaisen",
		img: "https://wallpapercave.com/uwp/uwp4651247.jpeg",
		review: "Incredible fight choreography and characters.",
		rating: "9.1",
		user: "Sarah Lee",
	},
	{
		title: "One Piece",
		img: "https://wallpapercave.com/uwp/uwp4958623.jpeg",
		review: "Legendary adventure with emotional depth.",
		rating: "8.9",
		user: "Mike Chen",
	},
	{
		title: "Attack on Titan",
		img: "https://wallpapercave.com/uwp/uwp4891368.jpeg",
		review: "Epic battles and a gripping storyline that keeps you on edge.",
		rating: "9.4",
		user: "Emily Davis",
	},
	{
		title: "My Hero Academia",
		img: "https://wallpapercave.com/uwp/uwp4493589.jpeg",
		review: "Heartwarming characters and electrifying hero moments.",
		rating: "9.0",
		user: "Alex Kim",
	},
];

const topReviewers = [
	{
		name: "Akira",
		stats: "320 reviews • 12k likes",
		img: "https://randomuser.me/api/portraits/men/32.jpg",
	},
	{
		name: "Mina",
		stats: "280 reviews • 10k likes",
		img: "https://randomuser.me/api/portraits/women/44.jpg",
	},
	{
		name: "Ren",
		stats: "250 reviews • 9k likes",
		img: "https://randomuser.me/api/portraits/men/55.jpg",
	},
];

const genres = [
	{ name: "Action", icon: "ri-sword-line" },
	{ name: "Romance", icon: "ri-heart-line" },
	{ name: "Isekai", icon: "ri-rocket-line" },
	{ name: "Adventure", icon: "ri-map-line" },
	{ name: "Fantasy", icon: "ri-magic-line" },
	{ name: "Sci-Fi", icon: "ri-home-heart-line" },
];

const quoteOfDay = {
	anime: "Naruto",
	character: "Itachi Uchiha",
	quote:
		"People live their lives bound by what they accept as correct and true.",
};

export default function HomePage() {
	const [slide, setSlide] = useState(0);
	const navigate = useNavigate();
	const [upcomingAnime, setUpcomingAnime] = useState([]);
	const [topRated, setTopRated] = useState([]);
	const [trendingAnime, setTrendingAnime] = useState([]);
	// const [user] = useState({
	// 	loggedIn: !!localStorage.getItem("token"),
	// 	isGuest: localStorage.getItem("isGuest") === "true",
	// 	avatar: "https://i.pravatar.cc/100",
	// });
	useEffect(() => {
		async function loadUpcoming() {
			const data = await getUpcomingAnime();
			setUpcomingAnime(data.slice(0, 15)); // show only 6 on homepage
		}
		loadUpcoming();
	}, []);

	useEffect(() => {
		async function loadTrending() {
			try {
				const data = await getTrending();
				// map the data to match your slider structure
				const mapped = data.map((anime) => ({
					id: anime.mal_id,
					title: anime.title,
					img: anime.images.jpg.large_image_url, // use large image to avoid blurriness
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
				const data = await getTopAnime(); // fetch top anime from Jikan
				setTopRated(data);
			} catch (err) {
				console.error("Failed to fetch top rated anime:", err);
			}
		};

		fetchTopRated();
	}, []);

	useEffect(() => {
		const token = localStorage.getItem("token");
		const isGuest = localStorage.getItem("isGuest") === "true";

		if (!token && !isGuest) {
			navigate("/auth");
		}
	}, [navigate]);

	const nextSlide = () => setSlide((prev) => (prev + 1) % trendingAnime.length);
	const prevSlide = () =>
		setSlide((prev) => (prev === 0 ? trendingAnime.length - 1 : prev - 1));

	return (
		<div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
			<main className="flex-1 w-full mx-auto px-6 py-10 space-y-16">
				{/* Trending Slider */}
				<TrendingSlider
					trendingAnime={trendingAnime}
					slide={slide}
					nextSlide={nextSlide}
					prevSlide={prevSlide}
				/>
				{/* Quote of the Day */}
				<QuoteOfDay quoteOfDay={quoteOfDay} />
				{/* Trending Reviews */}
				<TrendingReviews trendingReviews={trendingReviews} />
				{/* Top Reviewers */}
				<TopReviewers topReviewers={topReviewers} />
				{/* Top Rated Anime */}
				<TopRated topRated={topRated} />
				{/* Upcoming Anime */}
				<UpcomingAnime upcoming={upcomingAnime} />
				{/* Genres */}
				<Genres
					genres={genres}
					onGenreClick={(name) => navigate(`/genre/${name.toLowerCase()}`)}
				/>
			</main>
			<Footer />
		</div>
	);
}
