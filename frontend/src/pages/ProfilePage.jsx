import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import Footer from "../components/Footer";

// Level & Rank Calculator
export function getLevelAndRank(xp) {
	if (xp < 100) {
		return { level: 1, rank: "Beginner Otaku", badge: "ri-seedling-line text-emerald-400", currentLevelMin: 0, nextLevelMin: 100 };
	} else if (xp < 500) {
		return { level: 2, rank: "Anime Fan", badge: "ri-star-line text-yellow-400", currentLevelMin: 100, nextLevelMin: 500 };
	} else if (xp < 1500) {
		return { level: 3, rank: "Elite Reviewer", badge: "ri-trophy-line text-indigo-400", currentLevelMin: 500, nextLevelMin: 1500 };
	} else {
		return { level: 4, rank: "Anime Master", badge: "ri-vip-crown-line text-amber-400", currentLevelMin: 1500, nextLevelMin: null };
	}
}

// Cosmetics Shop Config
export const COSMETICS_SHOP = [
	{
		id: "frame-gold",
		name: "Gold Frame",
		type: "avatarFrame",
		cost: 200,
		description: "A shiny metallic gold border with a royal sheen.",
		styleClass: "border-4 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.6)] animate-pulse"
	},
	{
		id: "frame-neon",
		name: "Cyber Neon Frame",
		type: "avatarFrame",
		cost: 350,
		description: "A pulsing neon border straight from Neo-Tokyo.",
		styleClass: "border-4 border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.7),inset_0_0_10px_rgba(236,72,153,0.7)] animate-pulse"
	},
	{
		id: "frame-sakura",
		name: "Sakura Aura Frame",
		type: "avatarFrame",
		cost: 500,
		description: "A soft, glowing border infused with cherry blossoms.",
		styleClass: "border-4 border-pink-300 shadow-[0_0_15px_rgba(244,143,177,0.6)]"
	},
	{
		id: "frame-fire",
		name: "Fire Aura Frame",
		type: "avatarFrame",
		cost: 750,
		description: "An intense, animated fire-like gradient glow.",
		styleClass: "border-4 border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.8)] animate-pulse"
	},
	{
		id: "bg-cyberpunk",
		name: "Cyberpunk Grid",
		type: "profileBg",
		cost: 300,
		description: "A dark cyberpunk background with neon purple-pink gradients.",
		style: {
			background: "linear-gradient(135deg, #180828 0%, #0c0414 50%, #24083c 100%)",
			border: "1px solid rgba(236, 72, 153, 0.3)",
			boxShadow: "0 0 30px rgba(236, 72, 153, 0.1)"
		}
	},
	{
		id: "bg-nebula",
		name: "Cosmic Nebula",
		type: "profileBg",
		cost: 450,
		description: "A deep cosmic purple-to-indigo gradient.",
		style: {
			background: "linear-gradient(135deg, #09092d 0%, #030314 60%, #1e093c 100%)",
			border: "1px solid rgba(99, 102, 241, 0.3)",
			boxShadow: "0 0 30px rgba(99, 102, 241, 0.1)"
		}
	},
	{
		id: "bg-sakura",
		name: "Sakura Blossom",
		type: "profileBg",
		cost: 600,
		description: "A soft cherry blossom gradient background.",
		style: {
			background: "linear-gradient(135deg, #2d0b1a 0%, #14030a 60%, #401026 100%)",
			border: "1px solid rgba(244, 143, 177, 0.3)",
			boxShadow: "0 0 30px rgba(244, 143, 177, 0.1)"
		}
	},
	{
		id: "bg-abyss",
		name: "Dark Abyss",
		type: "profileBg",
		cost: 800,
		description: "A pitch-black theme with dark red outline highlights.",
		style: {
			background: "linear-gradient(135deg, #000000 0%, #0a0000 70%, #1a0000 100%)",
			border: "1px solid rgba(239, 68, 68, 0.3)",
			boxShadow: "0 0 30px rgba(239, 68, 68, 0.1)"
		}
	},
	{
		id: "color-crimson",
		name: "Crimson Fury",
		type: "usernameColor",
		cost: 150,
		description: "Make your name burn with a bright crimson color.",
		styleClass: "text-red-500 font-extrabold drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]"
	},
	{
		id: "color-cyan",
		name: "Cyan Surge",
		type: "usernameColor",
		cost: 150,
		description: "An electric cyan username color.",
		styleClass: "text-cyan-400 font-extrabold drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"
	},
	{
		id: "color-gold",
		name: "Golden Glow",
		type: "usernameColor",
		cost: 300,
		description: "Stand out with a royal golden name.",
		styleClass: "text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 font-extrabold drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]"
	},
	{
		id: "color-emerald",
		name: "Emerald Spark",
		type: "usernameColor",
		cost: 300,
		description: "A bright glowing emerald green username.",
		styleClass: "text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500 font-extrabold drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]"
	},
	{
		id: "color-rainbow",
		name: "Rainbow Shift",
		type: "usernameColor",
		cost: 600,
		description: "An animated rainbow gradient username.",
		styleClass: "text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-green-500 via-blue-500 to-red-500 font-extrabold animate-rainbow-text bg-[length:200%_auto]"
	},
	{
		id: "deco-sakura",
		name: "Sakura Petals",
		type: "profileDecoration",
		cost: 500,
		description: "Slow-falling pink cherry blossom petals on your profile.",
	},
	{
		id: "deco-snow",
		name: "Falling Snow",
		type: "profileDecoration",
		cost: 500,
		description: "Peaceful winter snow falling across your profile card.",
	},
	{
		id: "deco-gold",
		name: "Gold Dust",
		type: "profileDecoration",
		cost: 800,
		description: "A premium gold glitter drifting upwards.",
	},
	{
		id: "avatar-custom",
		name: "Animated Custom Avatar",
		type: "feature",
		cost: 1000,
		description: "Unlock the ability to upload your own custom or animated profile picture from your computer.",
	},
	{
		id: "bg-midnight",
		name: "Midnight Ocean",
		type: "profileBg",
		cost: 400,
		description: "A deep blue night gradient.",
		style: {
			background: "linear-gradient(135deg, #020024 0%, #090979 35%, #00d4ff 100%)",
			border: "1px solid rgba(0, 212, 255, 0.3)",
			boxShadow: "0 0 30px rgba(0, 212, 255, 0.1)"
		}
	},
	{
		id: "bg-aot",
		name: "Attack on Titan Theme",
		type: "profileBg",
		cost: 1500,
		description: "An epic Attack on Titan background for your profile.",
		style: {
			background: "linear-gradient(to bottom, rgba(24, 24, 27, 0.8), rgba(24, 24, 27, 0.95)), url('https://cdn.myanimelist.net/images/anime/10/47347l.jpg') center/cover no-repeat",
			border: "1px solid rgba(220, 38, 38, 0.3)",
			boxShadow: "0 0 30px rgba(220, 38, 38, 0.15)"
		}
	},
	{
		id: "bg-jjk",
		name: "Jujutsu Kaisen Theme",
		type: "profileBg",
		cost: 1500,
		description: "A dark and cursed Jujutsu Kaisen background.",
		style: {
			background: "linear-gradient(to bottom, rgba(24, 24, 27, 0.8), rgba(24, 24, 27, 0.95)), url('https://cdn.myanimelist.net/images/anime/1171/109222l.jpg') center/cover no-repeat",
			border: "1px solid rgba(59, 130, 246, 0.3)",
			boxShadow: "0 0 30px rgba(59, 130, 246, 0.15)"
		}
	},
	{
		id: "bg-demonslayer",
		name: "Demon Slayer Theme",
		type: "profileBg",
		cost: 1500,
		description: "A beautiful Demon Slayer background.",
		style: {
			background: "linear-gradient(to bottom, rgba(24, 24, 27, 0.8), rgba(24, 24, 27, 0.95)), url('https://cdn.myanimelist.net/images/anime/1286/99889l.jpg') center/cover no-repeat",
			border: "1px solid rgba(16, 185, 129, 0.3)",
			boxShadow: "0 0 30px rgba(16, 185, 129, 0.15)"
		}
	},
	{
		id: "bg-sunset",
		name: "Sunset Horizon",
		type: "profileBg",
		cost: 400,
		description: "A warm sunset vibe.",
		style: {
			background: "linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)",
			border: "1px solid rgba(255, 126, 95, 0.3)",
			boxShadow: "0 0 30px rgba(255, 126, 95, 0.1)"
		}
	},
	{
		id: "frame-diamond",
		name: "Diamond Frame",
		type: "avatarFrame",
		cost: 600,
		description: "An icy blue, diamond-like glowing frame.",
		styleClass: "border-4 border-cyan-300 shadow-[0_0_20px_rgba(103,232,249,0.8)]"
	},
	{
		id: "frame-void",
		name: "Void Aura",
		type: "avatarFrame",
		cost: 850,
		description: "A dark purple void energy frame.",
		styleClass: "border-4 border-purple-900 shadow-[0_0_25px_rgba(88,28,135,0.9)] animate-pulse"
	},
	{
		id: "color-amethyst",
		name: "Amethyst Shimmer",
		type: "usernameColor",
		cost: 250,
		description: "A rich purple and pink gradient.",
		styleClass: "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 font-extrabold drop-shadow-[0_0_8px_rgba(192,132,252,0.5)]"
	}
];

// Profile Canvas Animations
function SakuraDecoration() {
	const canvasRef = useRef(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		let animationFrameId;

		let width = canvas.width = canvas.offsetWidth;
		let height = canvas.height = canvas.offsetHeight;

		const handleResize = () => {
			if (canvas) {
				width = canvas.width = canvas.offsetWidth;
				height = canvas.height = canvas.offsetHeight;
			}
		};
		window.addEventListener("resize", handleResize);

		const petals = [];
		const maxPetals = 20;

		for (let i = 0; i < maxPetals; i++) {
			petals.push({
				x: Math.random() * width,
				y: Math.random() * height - height,
				r: Math.random() * 4 + 3,
				xs: Math.random() * 1.2 - 0.4,
				ys: Math.random() * 0.8 + 0.8,
				opacity: Math.random() * 0.5 + 0.2,
				rotation: Math.random() * 360,
				rotationSpeed: Math.random() * 1.5 - 0.75
			});
		}

		const draw = () => {
			ctx.clearRect(0, 0, width, height);

			petals.forEach((p) => {
				ctx.save();
				ctx.translate(p.x, p.y);
				ctx.rotate((p.rotation * Math.PI) / 180);
				ctx.beginPath();
				ctx.ellipse(0, 0, p.r, p.r / 2, 0, 0, 2 * Math.PI);
				ctx.fillStyle = `rgba(244, 143, 177, ${p.opacity})`;
				ctx.fill();
				ctx.restore();

				p.y += p.ys;
				p.x += p.xs;
				p.rotation += p.rotationSpeed;

				if (p.y > height) {
					p.y = -15;
					p.x = Math.random() * width;
				}
				if (p.x > width) {
					p.x = 0;
				} else if (p.x < 0) {
					p.x = width;
				}
			});

			animationFrameId = requestAnimationFrame(draw);
		};

		draw();

		return () => {
			cancelAnimationFrame(animationFrameId);
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return (
		<canvas
			ref={canvasRef}
			className="absolute inset-0 w-full h-full pointer-events-none z-10"
		/>
	);
}

function SnowDecoration() {
	const canvasRef = useRef(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		let animationFrameId;

		let width = canvas.width = canvas.offsetWidth;
		let height = canvas.height = canvas.offsetHeight;

		const handleResize = () => {
			if (canvas) {
				width = canvas.width = canvas.offsetWidth;
				height = canvas.height = canvas.offsetHeight;
			}
		};
		window.addEventListener("resize", handleResize);

		const flakes = [];
		const maxFlakes = 25;

		for (let i = 0; i < maxFlakes; i++) {
			flakes.push({
				x: Math.random() * width,
				y: Math.random() * height,
				r: Math.random() * 1.5 + 1.2,
				ys: Math.random() * 0.6 + 0.4,
				xs: Math.random() * 0.4 - 0.2,
				opacity: Math.random() * 0.6 + 0.2
			});
		}

		const draw = () => {
			ctx.clearRect(0, 0, width, height);

			flakes.forEach((f) => {
				ctx.fillStyle = `rgba(255, 255, 255, ${f.opacity})`;
				ctx.beginPath();
				ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
				ctx.fill();

				f.y += f.ys;
				f.x += f.xs;

				if (f.y > height) {
					f.y = -10;
					f.x = Math.random() * width;
				}
				if (f.x > width) {
					f.x = 0;
				} else if (f.x < 0) {
					f.x = width;
				}
			});

			animationFrameId = requestAnimationFrame(draw);
		};

		draw();

		return () => {
			cancelAnimationFrame(animationFrameId);
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return (
		<canvas
			ref={canvasRef}
			className="absolute inset-0 w-full h-full pointer-events-none z-10"
		/>
	);
}

function GoldDustDecoration() {
	const canvasRef = useRef(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		let animationFrameId;

		let width = canvas.width = canvas.offsetWidth;
		let height = canvas.height = canvas.offsetHeight;

		const handleResize = () => {
			if (canvas) {
				width = canvas.width = canvas.offsetWidth;
				height = canvas.height = canvas.offsetHeight;
			}
		};
		window.addEventListener("resize", handleResize);

		const particles = [];
		const maxParticles = 25;

		for (let i = 0; i < maxParticles; i++) {
			particles.push({
				x: Math.random() * width,
				y: Math.random() * height + height / 2,
				r: Math.random() * 1.2 + 0.6,
				ys: -(Math.random() * 0.4 + 0.3),
				xs: Math.random() * 0.3 - 0.15,
				opacity: Math.random() * 0.6 + 0.2,
				glow: Math.random() * 3 + 2
			});
		}

		const draw = () => {
			ctx.clearRect(0, 0, width, height);

			particles.forEach((p) => {
				ctx.save();
				ctx.shadowBlur = p.glow;
				ctx.shadowColor = "rgba(251, 191, 36, 0.6)";
				ctx.fillStyle = `rgba(251, 191, 36, ${p.opacity})`;
				ctx.beginPath();
				ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
				ctx.fill();
				ctx.restore();

				p.y += p.ys;
				p.x += p.xs;

				if (p.y < 0) {
					p.y = height + 10;
					p.x = Math.random() * width;
				}
				if (p.x > width) {
					p.x = 0;
				} else if (p.x < 0) {
					p.x = width;
				}
			});

			animationFrameId = requestAnimationFrame(draw);
		};

		draw();

		return () => {
			cancelAnimationFrame(animationFrameId);
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return (
		<canvas
			ref={canvasRef}
			className="absolute inset-0 w-full h-full pointer-events-none z-10"
		/>
	);
}

export default function ProfilePage() {
	const { username: paramUsername } = useParams();
	const navigate = useNavigate();
	const [userData, setUserData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [activeWatchStatus, setActiveWatchStatus] = useState("Watching");
	const [activeTab, setActiveTab] = useState("activity"); // "activity" or "shop"
	const [editing, setEditing] = useState(false);
	const [draftBio, setDraftBio] = useState("");
	const [draftUsername, setDraftUsername] = useState("");
	const [editError, setEditError] = useState("");
	const [editSaving, setEditSaving] = useState(false);
	const [showAvatarModal, setShowAvatarModal] = useState(false);
	const [avatarInput, setAvatarInput] = useState("");
	const [activeAvatarCategory, setActiveAvatarCategory] = useState("Naruto");
	const [draftGenres, setDraftGenres] = useState([]);
	const [isFollowing, setIsFollowing] = useState(false);
	const [friendStatus, setFriendStatus] = useState("none"); // none, pending, friends, received
	const [pendingRequests, setPendingRequests] = useState([]); // incoming friend requests (own profile)
	const [openSections, setOpenSections] = useState({ avatarFrame: true }); // accordion state
	const watchlistRef = useRef(null);

	const loggedInUsername = localStorage.getItem("username");
	const isOwnProfile = !paramUsername || paramUsername === loggedInUsername;
	const currentProfileUsername = paramUsername || loggedInUsername;

	const ALL_GENRES = [
		"Action", "Adventure", "Comedy", "Drama", "Fantasy", 
		"Horror", "Mecha", "Mystery", "Psychological", "Romance", 
		"Sci-Fi", "Slice of Life", "Sports", "Supernatural", "Thriller"
	];

	const AVATAR_PRESETS = {"Naruto":["https://cdn.myanimelist.net/images/characters/9/69275.jpg?s=36c4ad9f4440d77918c34c49870e719c","https://cdn.myanimelist.net/images/characters/7/284129.jpg?s=b0a6b941fd427cbfd85657f316c0e309","https://cdn.myanimelist.net/images/characters/9/131317.jpg?s=9705c17dba36c2edebded3a72dc1a46e","https://cdn.myanimelist.net/images/characters/2/284121.jpg?s=3ebac88ad166bf105d8f04894f3fb469","https://cdn.myanimelist.net/images/characters/3/36355.jpg?s=326e8671faaacb5fe6ce13fb931915a3","https://cdn.myanimelist.net/images/characters/15/103841.jpg?s=c555bc6a75c48a6ab191b9dc75b46805","https://cdn.myanimelist.net/images/characters/16/292449.jpg?s=f7b8f2084a65d22cd9381f25a55f8b2f","https://cdn.myanimelist.net/images/characters/12/104668.jpg?s=13e483e534221000f378d246d704204e"],"Dragon Ball":["https://cdn.myanimelist.net/images/characters/14/280893.jpg?s=2b0fdc4d608cdb9f6ca28d6192cb9251","https://cdn.myanimelist.net/images/characters/2/48517.jpg?s=19014a6433cd36c32f3661b21b38dad3","https://cdn.myanimelist.net/images/characters/6/359001.jpg?s=b0f6c285cdf733f32738264f42ebdd2f","https://cdn.myanimelist.net/images/characters/15/72546.jpg?s=c434a442d8ad1212885a8d02dbcbbee0","https://cdn.myanimelist.net/images/characters/14/126147.jpg?s=c6b311761d167c90d6717a7555efc3ae","https://cdn.myanimelist.net/images/characters/16/112702.jpg?s=feeca34f768d2efaf6f2d64b13d8f841","https://cdn.myanimelist.net/images/characters/16/238743.jpg?s=09baa5c41ad32b26df63a01969bab77e","https://cdn.myanimelist.net/images/characters/8/238181.jpg?s=ede32d41c1247e447d5a423707c2f11c"],"Jujutsu Kaisen":["https://cdn.myanimelist.net/images/characters/2/392689.jpg?s=2395a10b59bb54ec9891c74ef214fea1","https://cdn.myanimelist.net/images/characters/15/422168.jpg?s=7c1dfc26a9b3a6652da616a0fec7af01","https://cdn.myanimelist.net/images/characters/6/467646.jpg?s=9e1cb7b0c6c7f145661e8ee93f32215d","https://cdn.myanimelist.net/images/characters/12/422313.jpg?s=053db48815610ce7fdc280f62a3499ce","https://cdn.myanimelist.net/images/characters/2/566390.jpg?s=74c945aeba3a77b79c11b4fc9ebbe561","https://cdn.myanimelist.net/images/characters/8/524177.jpg?s=91bbde7d801299f3ff1fb5d8388cc133","https://cdn.myanimelist.net/images/characters/3/564915.jpg?s=ffe03656fac00133a212bf5e7d7bc83b","https://cdn.myanimelist.net/images/characters/7/436204.jpg?s=04b60749369f8eed82c3642692b6149f"],"One Piece":["https://cdn.myanimelist.net/images/characters/10/161005.jpg?s=8e3191d4d9691fffe3dafaefaf086014","https://cdn.myanimelist.net/images/characters/13/210053.jpg?s=58f71be3af78384ac43869b8c681efaf","https://cdn.myanimelist.net/images/characters/15/307148.jpg?s=20f8bf1d3a9854be84b67367849b1322","https://cdn.myanimelist.net/images/characters/9/310307.jpg?s=3a27ab33bee665febfba970f24f203ba","https://cdn.myanimelist.net/images/characters/6/59914.jpg?s=302fa4565e9cbd5368b6ca4da51e1a0c","https://cdn.myanimelist.net/images/characters/16/363700.jpg?s=3e7fa6074c0d30c8bede3905680e983c","https://cdn.myanimelist.net/images/characters/3/100534.jpg?s=4a00840eacc26e9ad86bae6f505e4826","https://cdn.myanimelist.net/images/characters/5/136769.jpg?s=52b8fdfc38114a389d83dd5301842556"],"Attack on Titan":["https://cdn.myanimelist.net/images/characters/9/215563.jpg?s=5b0650bb09a7e053afc6bad84ab48947","https://cdn.myanimelist.net/images/characters/8/220267.jpg?s=afa2751e2201aba1f5179544e787ba1a","https://cdn.myanimelist.net/images/characters/10/216895.jpg?s=ccb6539cbfc5462df97d61a48c52af93","https://cdn.myanimelist.net/images/characters/4/329189.jpg?s=9d5b3f38b3b94a872a8a10b187faf579","https://cdn.myanimelist.net/images/characters/11/206391.jpg?s=12136b2bd14eb6d8fbfad22e255f14cd","https://cdn.myanimelist.net/images/characters/15/206389.jpg?s=dc26854a45cdc2a56d852062f77f58bc","https://cdn.myanimelist.net/images/characters/7/206359.jpg?s=c86947918d765381f67f94da4ce0f5d1","https://cdn.myanimelist.net/images/characters/15/206405.jpg?s=a3dc07eb93070c0e403d4b0bc41fb0c5"]};

	useEffect(() => {
		async function fetchProfile() {
			const username = currentProfileUsername || "GuestUser";
			try {
				const [userRes, reviewsRes] = await Promise.all([
					fetch(`http://localhost:8000/api/users/${username}`),
					fetch(`http://localhost:8000/api/reviews/user/${username}`)
				]);
				
				let reviews = [];
				if (reviewsRes.ok) {
					reviews = await reviewsRes.json();
				}

				if (userRes.ok) {
					const data = await userRes.json();
					setUserData({
						name: data.username,
						handle: `@${data.username.toLowerCase()}`,
						avatar: data.avatar || "https://api.dicebear.com/9.x/pixel-art/svg?seed=Guest",
						bio: data.bio || "Anime lover & review writer.",
						favoriteGenres: data.favoriteGenres || [],
						reviews: reviews,
						watchlistItems: data.watchlist || [],
						stats: {
							reviews: reviews.length,
							followers: data.followers?.length || 0,
							following: data.following?.length || 0,
							watchlist: data.watchlist?.length || 0,
						},
						joined: data.createdAt ? new Date(data.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "Unknown",
						accountAge: (() => {
							if (!data.createdAt) return "Unknown age";
							const t = new Date(data.createdAt).getTime();
							if (isNaN(t)) return "Unknown age";
							const diffTime = Math.abs(Date.now() - t);
							const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
							return diffDays === 0 ? "Created today" : diffDays === 1 ? "1 day old" : `${diffDays} days old`;
						})(),
						location: "Unknown",
						points: data.points || 0,
						xp: data.xp || 0,
						loginStreak: data.loginStreak || 0,
						unlockedCosmetics: data.unlockedCosmetics || [],
						equippedCosmetics: data.equippedCosmetics || { avatarFrame: "", profileBg: "", usernameColor: "", profileDecoration: "" },
						badges: [],
					});

					// Populate incoming friend requests on own profile
					if (isOwnProfile) {
						const incoming = (data.friendRequests || []).filter(r => r.status === "pending");
						// Fetch sender info for each request
						const enriched = await Promise.all(incoming.map(async (req) => {
							try {
								const fromId = req.from?._id || req.from;
								if (!fromId) return { ...req, from: null };
								// Try to find the user profile by ID via /api/users endpoint
								// Since we only have ObjectId, fetch all users and find the match
								const allUsersRes = await fetch(`http://localhost:8000/api/users/`);
								if (allUsersRes.ok) {
									const allUsers = await allUsersRes.json();
									const sender = allUsers.find(u => u._id?.toString() === fromId.toString());
									if (sender) {
										return { _id: req._id, from: { _id: sender._id, username: sender.username, avatar: sender.avatar }, status: req.status };
									}
								}
								return { _id: req._id, from: { _id: fromId }, status: req.status };
							} catch { return { ...req }; }
						}));
						setPendingRequests(enriched);
					}

					// Check following status if not own profile
					if (!isOwnProfile && loggedInUsername) {
						let userId = localStorage.getItem("userId");
						if (!userId) {
							const token = localStorage.getItem("token");
							if (token) {
								try {
									const payload = JSON.parse(atob(token.split('.')[1]));
									userId = payload.id;
									localStorage.setItem("userId", userId);
								} catch(e) {
									console.error("Could not decode token", e);
								}
							}
						}
						
						const isFollower = data.followers?.some(id => id && id.toString() === userId);
						setIsFollowing(isFollower);

						const isFriend = data.friends?.some(id => id && id.toString() === userId);
						if (isFriend) {
							setFriendStatus("friends");
						} else {
							// Did I send them a request?
							const iSentRequest = data.friendRequests?.some(req => {
								const fromId = req.from?._id || req.from;
								return fromId && fromId.toString() === userId && req.status === "pending";
							});
							// Did they send me a request? Fetch my own profile's requests
							const myProfileRes = await fetch(`http://localhost:8000/api/users/${loggedInUsername}`);
							if (myProfileRes.ok) {
								const myData = await myProfileRes.json();
								const theysentMe = myData.friendRequests?.find(req => {
									const fromId = req.from?._id || req.from;
									return fromId && fromId.toString() === data._id?.toString() && req.status === "pending";
								});
								if (theysentMe) {
									setFriendStatus("received");
									// store the requestId for responding
									setPendingRequests([{ _id: theysentMe._id, from: { username: data.username, avatar: data.avatar, _id: data._id } }]);
								} else if (iSentRequest) {
									setFriendStatus("pending");
								} else {
									setFriendStatus("none");
								}
							} else if (iSentRequest) {
								setFriendStatus("pending");
							} else {
								setFriendStatus("none");
							}
						}
					}
				} else {
					setError("User not found.");
				}
			} catch (err) {
				console.error("Failed to load profile", err);
				setError("Failed to load profile data.");
			} finally {
				setLoading(false);
			}
		}

		fetchProfile();
	}, [currentProfileUsername, isOwnProfile]);

	const handleFollow = async () => {
		try {
			const token = localStorage.getItem("token");
			const res = await axios.post(`http://localhost:8000/api/users/${currentProfileUsername}/follow`, {}, {
				headers: { Authorization: `Bearer ${token}` }
			});
			setIsFollowing(res.data.isFollowing);
			setUserData(prev => ({
				...prev,
				stats: { ...prev.stats, followers: res.data.followersCount }
			}));
		} catch (err) {
			console.error("Follow error", err);
		}
	};

	const handleFriendRequest = async () => {
		try {
			const token = localStorage.getItem("token");
			await axios.post(`http://localhost:8000/api/users/${currentProfileUsername}/friend-request`, {}, {
				headers: { Authorization: `Bearer ${token}` }
			});
			setFriendStatus("pending");
		} catch (err) {
			console.error("Friend request error", err);
			alert(err.response?.data?.message || "Failed to send request");
		}
	};

	// Accept or ignore a friend request (works from own profile sidebar OR other user's profile)
	const handleRespondToRequest = async (requestId, action) => {
		try {
			const token = localStorage.getItem("token");
			await axios.post(
				"http://localhost:8000/api/users/friend-request/respond",
				{ requestId, action },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			if (isOwnProfile) {
				// Remove from pending list in sidebar
				setPendingRequests(prev => prev.filter(r => r._id !== requestId));
			} else {
				// Update button state on the other user's profile
				setFriendStatus(action === "accept" ? "friends" : "none");
				setPendingRequests([]);
			}
		} catch (err) {
			console.error("Respond to friend request error", err);
			alert(err.response?.data?.message || "Failed to respond");
		}
	};

	const handleReport = async () => {
		const reason = prompt("Enter reason for reporting this user:");
		if (!reason) return;
		try {
			const token = localStorage.getItem("token");
			await axios.post(`http://localhost:8000/api/users/${currentProfileUsername}/report`, { reason }, {
				headers: { Authorization: `Bearer ${token}` }
			});
			alert("User reported. Thank you for helping keep the community safe.");
		} catch (err) {
			console.error("Report error", err);
		}
	};

	const handleUnlockCosmetic = async (item) => {
		if (userData.points < item.cost) {
			alert("Not enough points!");
			return;
		}

		const token = localStorage.getItem("token");
		if (!token) return;

		try {
			const res = await axios.post(
				"http://localhost:8000/api/users/cosmetics/unlock",
				{ cosmeticId: item.id, cost: item.cost },
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			setUserData(prev => ({
				...prev,
				points: res.data.points,
				unlockedCosmetics: res.data.unlockedCosmetics
			}));

			window.dispatchEvent(new CustomEvent("show-points-popup", {
				detail: { points: 0, reason: `Unlocked ${item.name}!` }
			}));
		} catch (err) {
			console.error("Failed to unlock cosmetic", err);
			alert(err.response?.data?.message || "Failed to unlock cosmetic");
		}
	};

	const handleEquipCosmetic = async (itemType, itemId) => {
		const token = localStorage.getItem("token");
		if (!token) return;

		try {
			const res = await axios.post(
				"http://localhost:8000/api/users/cosmetics/equip",
				{ cosmeticType: itemType, cosmeticId: itemId },
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			setUserData(prev => ({
				...prev,
				equippedCosmetics: res.data.equippedCosmetics
			}));
		} catch (err) {
			console.error("Failed to equip cosmetic", err);
			alert(err.response?.data?.message || "Failed to equip cosmetic");
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
				<main className="flex-1 max-w-7xl mx-auto px-6 py-10 flex items-center justify-center">
					<div className="text-center p-10 bg-zinc-900 rounded-2xl border border-zinc-800">
						<i className="ri-error-warning-line text-4xl text-red-500 mb-4 block"></i>
						<h1 className="text-2xl font-bold mb-2">Oops!</h1>
						<p className="text-zinc-400">{error}</p>
						<button 
							onClick={() => navigate("/community")}
							className="mt-6 px-6 py-2 bg-indigo-600 rounded-xl hover:bg-indigo-500 transition font-semibold"
						>
							Back to Community
						</button>
					</div>
				</main>
				<Footer />
			</div>
		);
	}

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

	// Get Level and Rank information
	const { level, rank: levelRank, badge: levelBadge, currentLevelMin, nextLevelMin } = getLevelAndRank(userData.xp || 0);
	const nextLevelText = nextLevelMin !== null ? `${userData.xp || 0} / ${nextLevelMin} XP` : `${userData.xp || 0} XP (MAX)`;
	const xpProgress = nextLevelMin !== null
		? (((userData.xp || 0) - currentLevelMin) / (nextLevelMin - currentLevelMin)) * 100
		: 100;

	// Calculate Dynamic Badges
	const displayBadges = [];
	const isOwner = userData.email === "sujal.neupane.19.sn@gmail.com" || userData.name?.toLowerCase() === "kenya";
	
	if (isOwner) {
		displayBadges.push({ text: "Anime Master", icon: "ri-vip-crown-line text-amber-400" });
		displayBadges.push({ text: "Review Guru", icon: "ri-draft-line text-amber-500" });
		displayBadges.push({ text: "Active Reviewer", icon: "ri-ball-pen-line text-teal-400" });
		displayBadges.push({ text: "Loyal Otaku", icon: "ri-fire-line text-orange-400" });
		displayBadges.push({ text: "Collector", icon: "ri-book-open-line text-blue-400" });
	} else {
		displayBadges.push({ text: levelRank, icon: levelBadge });
		if (userData.stats.reviews >= 10) {
			displayBadges.push({ text: "Review Guru", icon: "ri-draft-line text-amber-500" });
		} else if (userData.stats.reviews >= 5) {
			displayBadges.push({ text: "Active Reviewer", icon: "ri-ball-pen-line text-teal-400" });
		}
		if (userData.loginStreak >= 7) {
			displayBadges.push({ text: "Loyal Otaku", icon: "ri-fire-line text-orange-400" });
		}
		if (userData.watchlistItems?.length >= 10) {
			displayBadges.push({ text: "Collector", icon: "ri-book-open-line text-blue-400" });
		}
	}

	// Determine cosmetics style mappings
	const frameCosmetic = COSMETICS_SHOP.find(c => c.id === userData.equippedCosmetics?.avatarFrame);
	const avatarFrameClass = frameCosmetic ? frameCosmetic.styleClass : "border-4 border-indigo-500 shadow-lg";

	const bgCosmetic = COSMETICS_SHOP.find(c => c.id === userData.equippedCosmetics?.profileBg);
	const equippedBgStyle = bgCosmetic ? bgCosmetic.style : { backgroundColor: "#18181b", border: "1px solid rgba(63, 63, 70, 0.3)" };

	const colorCosmetic = COSMETICS_SHOP.find(c => c.id === userData.equippedCosmetics?.usernameColor);
	const usernameColorClass = colorCosmetic ? colorCosmetic.styleClass : "text-white";

	const equippedDeco = userData.equippedCosmetics?.profileDecoration;

	return (
		<div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
			<main className="flex-1 max-w-7xl mx-auto px-6 py-10 w-full">
				
				{/* Profile Header Card */}
				<div 
					className="rounded-2xl p-8 shadow-2xl mb-8 relative overflow-hidden transition-all duration-500"
					style={equippedBgStyle}
				>
					{/* Particle Decorations Overlay */}
					{equippedDeco === "deco-sakura" && <SakuraDecoration />}
					{equippedDeco === "deco-snow" && <SnowDecoration />}
					{equippedDeco === "deco-gold" && <GoldDustDecoration />}

					<div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-20">
						{/* Avatar Block */}
						<div className="relative group shrink-0">
							<img
								src={userData.avatar}
								alt="avatar"
								onClick={() => {
									if (isOwnProfile) {
										setAvatarInput(userData.avatar);
										setShowAvatarModal(true);
									}
								}}
								className={`w-28 h-28 rounded-full object-cover cursor-pointer hover:opacity-90 transition duration-300 ${avatarFrameClass}`}
							/>
						</div>

						{/* Identity & Stats details */}
						<div className="flex-1 text-center md:text-left">
							<h1 className={`text-3xl font-extrabold flex flex-wrap justify-center md:justify-start items-center gap-2.5 ${usernameColorClass}`}>
								{userData.name}
								<span className="text-xs font-semibold py-1 px-3 bg-zinc-950/80 border border-zinc-800 text-zinc-300 rounded-full flex items-center gap-1.5 shadow-md">
									<i className={levelBadge}></i> Lvl {level} • {levelRank}
								</span>
							</h1>
							<p className="text-zinc-400 text-sm mt-1">{userData.handle}</p>
							<p className="text-xs text-zinc-500 mt-1">
								Joined {userData.joined} ({userData.accountAge}) • {userData.location}
							</p>

							{/* XP Progress Bar */}
							<div className="mt-4 max-w-md mx-auto md:mx-0">
								<div className="flex justify-between text-xs text-zinc-400 font-semibold mb-1">
									<span>XP Progress</span>
									<span>{nextLevelText}</span>
								</div>
								<div className="w-full h-3 bg-zinc-950/90 rounded-full overflow-hidden border border-zinc-800/80 p-[1px]">
									<div
										className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"
										style={{ width: `${xpProgress}%` }}
									/>
								</div>
							</div>

							<div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4 text-xs font-semibold">
								<span className="bg-indigo-600/20 text-indigo-300 border border-indigo-500/20 px-3 py-1.5 rounded-xl flex items-center gap-1">
									<i className="ri-fire-fill text-orange-500 mr-1 animate-pulse"></i> <strong className="text-white">{userData.points}</strong> Points
								</span>
								<span className="bg-purple-600/20 text-purple-300 border border-purple-500/20 px-3 py-1.5 rounded-xl flex items-center gap-1">
									<i className="ri-repeat-2-fill text-purple-400 mr-1"></i> <strong className="text-white">{userData.loginStreak}</strong> Day Streak
								</span>
							</div>

							<p className="text-sm text-zinc-300 mt-4 leading-relaxed max-w-2xl">{userData.bio}</p>
						</div>

						{/* Action Buttons */}
						{isOwnProfile ? (
							<button
								onClick={() => {
									setDraftBio(userData.bio);
									setDraftUsername(userData.name);
									setDraftGenres(userData.favoriteGenres || []);
									setEditError("");
									setEditing(true);
								}}
								className="md:ml-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all duration-300 font-semibold shadow-lg shadow-indigo-600/20 hover:scale-[1.02] cursor-pointer"
							>
								Edit Profile
							</button>
						) : (
							<div className="md:ml-auto flex flex-wrap justify-center gap-3">
								<button
									onClick={handleFollow}
									className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] ${
										isFollowing 
											? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700" 
											: "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20"
									}`}
								>
									{isFollowing ? "Unfollow" : "Follow"}
								</button>
								{friendStatus === "received" ? (
									<div className="flex gap-2">
										<button
											onClick={() => handleRespondToRequest(pendingRequests[0]?._id, "accept")}
											className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all duration-300 font-semibold flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 hover:scale-[1.02] cursor-pointer"
										>
											<i className="ri-user-add-line" /> Accept
										</button>
										<button
											onClick={() => handleRespondToRequest(pendingRequests[0]?._id, "reject")}
											className="px-5 py-2.5 bg-zinc-800 hover:bg-red-900/40 border border-zinc-700 hover:border-red-500/40 text-zinc-300 hover:text-red-400 rounded-xl transition-all duration-300 font-semibold flex items-center gap-1.5 hover:scale-[1.02] cursor-pointer"
										>
											<i className="ri-user-forbid-line" /> Ignore
										</button>
									</div>
								) : (
									<button
										onClick={handleFriendRequest}
										disabled={friendStatus !== "none"}
										className={`px-6 py-2.5 rounded-xl transition-all duration-300 font-semibold disabled:opacity-60 hover:scale-[1.02] flex items-center gap-1.5 ${
											friendStatus === "friends"
												? "bg-emerald-700/30 text-emerald-400 border border-emerald-500/30"
												: friendStatus === "pending"
												? "bg-zinc-800 text-zinc-400 border border-zinc-700"
												: "bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 cursor-pointer"
										}`}
									>
										{friendStatus === "pending" ? (<><i className="ri-time-line" /> Request Sent</>) :
										 friendStatus === "friends" ? (<><i className="ri-user-follow-line" /> Friends</>) :
										 (<><i className="ri-user-add-line" /> Add Friend</>)}
									</button>
								)}
								<button 
									onClick={handleReport}
									className="p-3 bg-zinc-800 hover:bg-red-500/20 hover:text-red-500 border border-zinc-700 hover:border-red-500/30 rounded-xl transition-all duration-300 text-zinc-500"
									title="Report User"
								>
									<i className="ri-flag-line text-lg"></i>
								</button>
							</div>
						)}
					</div>
				</div>

				{/* Profile Columns */}
				<div className="grid md:grid-cols-4 gap-8">
					
					{/* Left Sidebar */}
					<div className="space-y-6">
						<div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-md">
							<h2 className="font-bold text-zinc-100 mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
								📊 Profile Stats
							</h2>
							<div className="space-y-3 text-sm text-zinc-400">
								<div className="flex justify-between border-b border-zinc-800/50 pb-2">
									<span>Reviews:</span>
									<strong className="text-zinc-200">{userData.stats.reviews}</strong>
								</div>
								<div className="flex justify-between border-b border-zinc-800/50 pb-2">
									<span>Followers:</span>
									<strong className="text-zinc-200">{userData.stats.followers}</strong>
								</div>
								<div className="flex justify-between border-b border-zinc-800/50 pb-2">
									<span>Following:</span>
									<strong className="text-zinc-200">{userData.stats.following}</strong>
								</div>
								<div className="flex justify-between">
									<span>Watchlist:</span>
									<strong className="text-zinc-200">{userData.stats.watchlist}</strong>
								</div>
							</div>
						</div>

						<div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-md">
							<h2 className="font-bold text-zinc-100 mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
								❤️ Favorite Genres
							</h2>
							<div className="flex flex-wrap gap-2">
								{userData.favoriteGenres && userData.favoriteGenres.length > 0 ? (
									userData.favoriteGenres.map((genre) => (
										<span
											key={genre}
											className="px-3 py-1 text-xs font-semibold bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 rounded-full"
										>
											{genre}
										</span>
									))
								) : (
									<span className="text-zinc-500 text-sm">No genres selected.</span>
								)}
							</div>
						</div>

						{/* Friend Requests — own profile only */}
						{isOwnProfile && pendingRequests.length > 0 && (
							<div
								className="rounded-2xl p-5 shadow-md"
								style={{
									background: "linear-gradient(135deg, #1e1b2e, #18181b)",
									border: "1px solid rgba(167,139,250,0.25)",
									boxShadow: "0 0 20px rgba(124,58,237,0.08)"
								}}
							>
								<h2 className="font-bold text-zinc-100 mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
									<i className="ri-user-add-line text-violet-400" />
									Friend Requests
									<span className="ml-auto px-2 py-0.5 rounded-full text-xs font-bold bg-violet-600/20 text-violet-300 border border-violet-500/20">
										{pendingRequests.length}
									</span>
								</h2>
								<div className="flex flex-col gap-3">
									{pendingRequests.map((req) => {
										const senderId = req.from?._id || req.from;
										const senderUsername = req.from?.username;
										const senderAvatar = req.from?.avatar || `https://api.dicebear.com/9.x/pixel-art/svg?seed=${senderId}`;
										return (
											<div
												key={req._id}
												className="flex items-center gap-3 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/60"
											>
												<img
													src={senderAvatar}
													alt="avatar"
													className="w-9 h-9 rounded-full object-cover border border-zinc-700 cursor-pointer hover:border-violet-400 transition flex-shrink-0"
													onClick={() => senderUsername && navigate(`/profile/${senderUsername}`)}
												/>
												<div className="flex-1 min-w-0">
													{senderUsername ? (
														<p
															className="text-sm font-semibold text-zinc-200 truncate cursor-pointer hover:text-violet-300 transition"
															onClick={() => navigate(`/profile/${senderUsername}`)}
														>
															{senderUsername}
														</p>
													) : (
														<p className="text-xs text-zinc-500">Unknown user</p>
													)}
													<p className="text-xs text-zinc-500">wants to be friends</p>
												</div>
												<div className="flex gap-1.5 flex-shrink-0">
													<button
														onClick={() => handleRespondToRequest(req._id, "accept")}
														className="w-8 h-8 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/30 text-emerald-400 hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer"
														title="Accept"
													>
														<i className="ri-check-line text-sm" />
													</button>
													<button
														onClick={() => handleRespondToRequest(req._id, "reject")}
														className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-red-900/40 border border-zinc-700 hover:border-red-500/30 text-zinc-400 hover:text-red-400 flex items-center justify-center transition-all duration-200 cursor-pointer"
														title="Ignore"
													>
														<i className="ri-close-line text-sm" />
													</button>
												</div>
											</div>
										);
									})}
								</div>
							</div>
						)}

						{/* Dynamic Achievements & Badges */}
						<div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-md">
							<h2 className="font-bold text-zinc-100 mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
								<i className="ri-award-line text-indigo-400 text-lg mr-1"></i> Achievements & Badges
							</h2>
							<div className="flex flex-col gap-2.5">
								{displayBadges.map((badge, idx) => (
									<div
										key={idx}
										className="px-3 py-2 bg-zinc-950 border border-zinc-800/80 rounded-xl text-xs font-bold text-zinc-300 flex items-center gap-2 shadow-sm animate-fadeIn"
									>
										<i className={`${badge.icon} text-sm`}></i>
										<span>{badge.text}</span>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Main Column */}
					<div className="md:col-span-3 space-y-6">
						
						{/* Tab Switches (Only for own profile) */}
						{isOwnProfile ? (
							<div className="flex gap-6 border-b border-zinc-800 pb-px mb-6">
								<button
									onClick={() => setActiveTab("activity")}
									className={`pb-3 text-sm font-semibold tracking-wider transition-all duration-300 relative cursor-pointer ${
										activeTab === "activity"
											? "text-indigo-400"
											: "text-zinc-400 hover:text-zinc-200"
									}`}
								>
									Activity & Watchlist
									{activeTab === "activity" && (
										<div className="absolute bottom-0 left-0 w-full h-[2.5px] bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
									)}
								</button>
								<button
									onClick={() => setActiveTab("shop")}
									className={`pb-3 text-sm font-semibold tracking-wider transition-all duration-300 relative flex items-center gap-1.5 cursor-pointer ${
										activeTab === "shop"
											? "text-indigo-400"
											: "text-zinc-400 hover:text-zinc-200"
									}`}
								>
									✨ Rewards Shop & Wardrobe
									{activeTab === "shop" && (
										<div className="absolute bottom-0 left-0 w-full h-[2.5px] bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
									)}
								</button>
							</div>
						) : null}

						{/* ACTIVITY TAB CONTENT */}
						{(activeTab === "activity" || !isOwnProfile) && (
							<>
								<h2 className="text-xl font-bold mb-4 flex items-center gap-2">
									📝 Reviews
								</h2>

								{userData.reviews.length === 0 ? (
									<div className="p-8 text-center text-zinc-500 bg-zinc-900 border border-zinc-850 rounded-2xl text-sm">
										No reviews posted yet.
									</div>
								) : (
									<div className="space-y-4">
										{userData.reviews.map((review, index) => (
											<div
												key={index}
												className="bg-zinc-900 border border-zinc-850 rounded-xl p-6 hover:bg-zinc-850 hover:border-zinc-800 transition duration-300"
											>
												<div className="flex justify-between items-center mb-2">
													<h3 className="font-bold text-zinc-100">{review.animeTitle}</h3>
													<div className="flex items-center gap-1">
														<div className="flex gap-0.5">
															{[...Array(5)].map((_, i) => (
																<i key={i} className={`ri-star-fill text-[13px] ${i < Math.round(review.score / 2) ? "text-amber-400" : "text-zinc-800"}`}></i>
															))}
														</div>
														<span className="text-zinc-500 text-xs ml-1">({review.score}/10)</span>
													</div>
												</div>
												<div className="text-zinc-450 text-sm prose-markdown mt-2">
													<ReactMarkdown
														components={{
															p: ({node, ...props}) => <p className="mb-1 last:mb-0" {...props} />,
															img: ({ node, src, alt, ...props }) => <img src={src} alt={alt} referrerPolicy="no-referrer" className="rounded-xl max-w-full md:max-w-sm max-h-72 object-contain mt-3 mb-1 border border-zinc-700 shadow-lg block" {...props} />
														}}
													>
														{review.text}
													</ReactMarkdown>
												</div>
											</div>
										))}
									</div>
								)}

								{/* WATCHLIST SECTION */}
								<h2 className="text-xl font-bold mt-10 mb-4 flex items-center gap-2">
									📺 Watchlist
								</h2>

								<div className="flex gap-2 flex-wrap mb-4 bg-zinc-900/60 border border-zinc-800/60 p-1.5 rounded-2xl max-w-max">
									{WATCH_STATUSES.map((status) => (
										<button
											key={status}
											onClick={() => setActiveWatchStatus(status)}
											className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
												activeWatchStatus === status
													? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
													: "text-zinc-400 hover:text-zinc-200"
											}`}
										>
											{status}
										</button>
									))}
								</div>

								{filteredWatchlist.length === 0 ? (
									<div className="p-8 text-center text-zinc-500 bg-zinc-900 border border-zinc-850 rounded-2xl text-sm">
										No anime in this list yet.
									</div>
								) : (
									<div className="relative group">
										<button
											onClick={() => watchlistRef.current.scrollBy({ left: -300, behavior: "smooth" })}
											className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 p-2 rounded-full cursor-pointer text-white opacity-0 group-hover:opacity-100 transition duration-300"
										>
											<i className="ri-arrow-left-s-line text-xl"></i>
										</button>
										<button
											onClick={() => watchlistRef.current.scrollBy({ left: 300, behavior: "smooth" })}
											className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 p-2 rounded-full cursor-pointer text-white opacity-0 group-hover:opacity-100 transition duration-300"
										>
											<i className="ri-arrow-right-s-line text-xl"></i>
										</button>

										<div 
											ref={watchlistRef}
											className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar pb-4"
										>
											{filteredWatchlist.map((item, i) => (
												<div key={i} className="w-40 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col hover:border-indigo-500 transition duration-300 cursor-pointer shrink-0">
													<img src={item.image || "https://via.placeholder.com/150"} alt={item.title} className="w-full h-48 object-cover shrink-0" />
													<div className="p-3 text-xs font-bold truncate text-center text-zinc-200" title={item.title}>
														{item.title}
													</div>
												</div>
											))}
										</div>
									</div>
								)}
							</>
						)}

						{/* REWARDS SHOP & WARDROBE TAB CONTENT */}
						{isOwnProfile && activeTab === "shop" && (
							<div className="space-y-8">
								<div className="bg-linear-to-br from-indigo-950/20 to-purple-950/20 border border-indigo-500/20 p-6 rounded-2xl flex items-center justify-between">
									<div>
										<h3 className="text-lg font-bold text-indigo-400">Activity Rewards</h3>
										<p className="text-zinc-400 text-xs mt-1">Unlock premium cosmetics and profile enhancements with points earned from reviews, likes, polls, check-ins, and trivia.</p>
									</div>
									<div className="text-right shrink-0">
										<span className="text-2xl font-black text-white flex items-center gap-1.5 justify-end">
											🔥 {userData.points}
										</span>
										<span className="text-xs font-semibold text-zinc-400">Available Points</span>
									</div>
								</div>

								{/* Shop sections */}
								{["avatarFrame", "usernameColor", "profileBg", "profileDecoration"].map((cosmeticType) => {
									let sectionTitle = "";
									let items = [];
									if (cosmeticType === "avatarFrame") {
										sectionTitle = "🖼️ Avatar Frames";
										items = COSMETICS_SHOP.filter(c => c.type === "avatarFrame");
									} else if (cosmeticType === "usernameColor") {
										sectionTitle = "🎨 Username Colors";
										items = COSMETICS_SHOP.filter(c => c.type === "usernameColor");
									} else if (cosmeticType === "profileBg") {
										sectionTitle = "✨ Profile Backgrounds";
										items = COSMETICS_SHOP.filter(c => c.type === "profileBg");
									} else if (cosmeticType === "profileDecoration") {
										sectionTitle = "🌌 Profile Animations";
										items = COSMETICS_SHOP.filter(c => c.type === "profileDecoration");
									}

									return (
										<div key={cosmeticType} className="space-y-4">
											<div className="flex items-center justify-between border-b border-zinc-800 pb-2">
												<h4 className="font-bold text-zinc-200 text-base">{sectionTitle}</h4>
												{userData.equippedCosmetics?.[cosmeticType] && (
													<button
														onClick={() => handleEquipCosmetic(cosmeticType, "")}
														className="text-xs font-bold text-zinc-500 hover:text-red-400 transition cursor-pointer"
													>
														Unequip Current
													</button>
												)}
											</div>

											<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
												{items.map((item) => {
													const isOwner = userData.email === "sujal.neupane.19.sn@gmail.com" || userData.name?.toLowerCase() === "kenya";
													const isUnlocked = isOwner || userData.unlockedCosmetics?.includes(item.id);
													const isEquipped = item.type === "feature" ? false : userData.equippedCosmetics?.[item.type] === item.id;
													const canAfford = isOwner || userData.points >= item.cost;

													return (
														<div 
															key={item.id} 
															className={`bg-zinc-900 border backdrop-blur-md rounded-2xl p-5 flex flex-col justify-between hover:border-indigo-500/40 transition duration-300 ${
																isEquipped ? "border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.15)]" : "border-zinc-800/80"
															}`}
														>
															<div>
																{/* Preview Visual */}
																<div className="h-28 rounded-xl bg-zinc-950 flex items-center justify-center relative overflow-hidden mb-4 border border-zinc-800/50">
																	{item.type === "avatarFrame" && (
																		<img 
																			src={userData.avatar} 
																			alt="preview" 
																			className={`w-14 h-14 rounded-full object-cover ${item.styleClass}`} 
																		/>
																	)}

																	{item.type === "usernameColor" && (
																		<span className={`text-base font-extrabold ${item.styleClass}`}>
																			{userData.name}
																		</span>
																	)}

																	{item.type === "profileBg" && (
																		<div 
																			className="absolute inset-0 w-full h-full" 
																			style={item.style}
																		/>
																	)}

																	{item.type === "profileDecoration" && (
																		<div className="text-center p-4">
																			<div className="text-2xl mb-1">
																				{item.id === "deco-sakura" ? "🌸" : item.id === "deco-snow" ? "❄️" : "✨"}
																			</div>
																			<span className="text-xs font-bold text-zinc-500">Particle Overlay</span>
																		</div>
																	)}
																</div>

																<h5 className="font-bold text-zinc-200 text-sm">{item.name}</h5>
																<p className="text-zinc-500 text-xs mt-1 leading-normal">{item.description}</p>
															</div>

															<div className="mt-5 pt-3 border-t border-zinc-800/40 flex items-center justify-between">
																{isUnlocked ? (
																	isEquipped ? (
																		<span className="text-xs font-bold text-indigo-400 flex items-center gap-1">
																			✅ Equipped
																		</span>
																	) : (
																		<button
																			onClick={() => handleEquipCosmetic(item.type, item.id)}
																			className="w-full py-1.5 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/20 text-xs font-bold rounded-xl transition cursor-pointer"
																		>
																			Equip
																		</button>
																	)
																) : (
																	<button
																		onClick={() => handleUnlockCosmetic(item)}
																		disabled={!canAfford}
																		className={`w-full py-1.5 text-xs font-bold rounded-xl transition cursor-pointer flex justify-center items-center gap-1.5 ${
																			canAfford 
																				? "bg-zinc-800 hover:bg-white text-zinc-200 hover:text-zinc-950 border border-zinc-700" 
																				: "bg-zinc-950 text-zinc-600 border border-zinc-900 cursor-not-allowed"
																		}`}
																	>
																		Unlock • 🔥 {item.cost}
																	</button>
																)}
															</div>
														</div>
													);
												})}
											</div>
										</div>
									);
								})}
								
								{/* Features Section */}
								<div className="space-y-4 mt-8">
									<div className="flex items-center justify-between border-b border-zinc-800 pb-2">
										<h4 className="font-bold text-zinc-200 text-base">⭐ Special Features</h4>
									</div>
									<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
										{COSMETICS_SHOP.filter(c => c.type === "feature").map((item) => {
											const isOwner = userData.email === "sujal.neupane.19.sn@gmail.com" || userData.name?.toLowerCase() === "kenya";
											const isUnlocked = isOwner || userData.unlockedCosmetics?.includes(item.id);
											const canAfford = isOwner || userData.points >= item.cost;
											return (
												<div key={item.id} className="bg-zinc-900 border border-zinc-800/80 backdrop-blur-md rounded-2xl p-5 flex flex-col justify-between hover:border-indigo-500/40 transition duration-300">
													<div>
														<div className="h-28 rounded-xl bg-zinc-950 flex flex-col items-center justify-center relative overflow-hidden mb-4 border border-zinc-800/50 p-4 text-center">
															<i className="ri-image-edit-line text-4xl text-indigo-400 mb-2"></i>
															<span className="text-xs font-bold text-zinc-500">Custom Upload Unlock</span>
														</div>
														<h5 className="font-bold text-zinc-200 text-sm">{item.name}</h5>
														<p className="text-zinc-500 text-xs mt-1 leading-normal">{item.description}</p>
													</div>
													<div className="mt-5 pt-3 border-t border-zinc-800/40 flex items-center justify-between">
														{isUnlocked ? (
															<span className="text-xs font-bold text-indigo-400 flex items-center gap-1">
																✅ Unlocked
															</span>
														) : (
															<button
																onClick={() => handleUnlockCosmetic(item)}
																disabled={!canAfford}
																className={`w-full py-1.5 text-xs font-bold rounded-xl transition cursor-pointer flex justify-center items-center gap-1.5 ${
																	canAfford ? "bg-zinc-800 hover:bg-white text-zinc-200 hover:text-zinc-950 border border-zinc-700" : "bg-zinc-950 text-zinc-600 border border-zinc-900 cursor-not-allowed"
																}`}
															>
																Unlock • 🔥 {item.cost}
															</button>
														)}
													</div>
												</div>
											);
										})}
									</div>
								</div>
							</div>
						)}
					</div>
				</div>

				{/* EDIT MODAL */}
				{editing && (
					<div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={(e) => { if (e.target === e.currentTarget) setEditing(false); }}>
						<div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-xl font-bold text-indigo-400">Edit Profile</h2>
								<button onClick={() => setEditing(false)} className="text-zinc-500 hover:text-zinc-200 transition cursor-pointer">
									<i className="ri-close-line text-xl" />
								</button>
							</div>

							{/* Username */}
							<h3 className="font-semibold text-zinc-300 mb-1 text-sm">Username</h3>
							<p className="text-zinc-500 text-xs mb-2">3–20 characters · letters, numbers, underscores only</p>
							<div className="relative mb-5">
								<span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm pointer-events-none">@</span>
								<input
									type="text"
									value={draftUsername}
									onChange={(e) => { setDraftUsername(e.target.value); setEditError(""); }}
									maxLength={20}
									className="w-full pl-7 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-200 transition"
									placeholder="your_username"
								/>
								<span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 text-xs">
									{draftUsername.length}/20
								</span>
							</div>

							{/* Bio */}
							<h3 className="font-semibold text-zinc-300 mb-2 text-sm">Bio</h3>
							<textarea
								value={draftBio}
								onChange={(e) => setDraftBio(e.target.value)}
								className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl mb-5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-200"
								rows={3}
							/>

							{/* Favorite Genres */}
							<h3 className="font-semibold text-zinc-300 mb-2 text-sm">Favorite Genres</h3>
							<div className="flex flex-wrap gap-2 mb-5">
								{ALL_GENRES.map(g => {
									const isSelected = draftGenres.includes(g);
									return (
										<button
											key={g}
											onClick={() => {
												if (isSelected) {
													setDraftGenres(draftGenres.filter(x => x !== g));
												} else {
													setDraftGenres([...draftGenres, g]);
												}
											}}
											className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
												isSelected ? "bg-indigo-600 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
											}`}
										>
											{g}
										</button>
									)
								})}
							</div>

							{/* Inline error */}
							{editError && (
								<div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5 mb-4">
									<i className="ri-error-warning-line" />
									{editError}
								</div>
							)}

							<div className="flex gap-4">
								<button
									onClick={() => setEditing(false)}
									className="flex-1 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl hover:bg-zinc-700 font-semibold cursor-pointer transition text-zinc-300"
								>
									Cancel
								</button>
								<button
									disabled={editSaving}
									onClick={async () => {
										const oldUsername = localStorage.getItem("username");
										if (!oldUsername) return;
										setEditSaving(true);
										setEditError("");
										try {
											const payload = { bio: draftBio, favoriteGenres: draftGenres };
											const usernameChanged = draftUsername.trim() !== oldUsername;
											if (usernameChanged) payload.newUsername = draftUsername.trim();

											const res = await fetch(`http://localhost:8000/api/users/${oldUsername}`, {
												method: "PUT",
												headers: { "Content-Type": "application/json" },
												body: JSON.stringify(payload),
											});

											if (!res.ok) {
												const data = await res.json();
												setEditError(data.message || "Failed to save");
												return;
											}

											const saved = await res.json();
											const newName = saved.username;

											setUserData(prev => ({
												...prev,
												name: newName,
												handle: `@${newName.toLowerCase()}`,
												bio: draftBio,
												favoriteGenres: draftGenres,
											}));

											if (usernameChanged) {
												localStorage.setItem("username", newName);
												setEditing(false);
												navigate("/profile");
											} else {
												setEditing(false);
											}
										} catch (err) {
											console.error(err);
											setEditError("Network error. Please try again.");
										} finally {
											setEditSaving(false);
										}
									}}
									className="flex-1 py-2.5 bg-indigo-600 rounded-xl cursor-pointer hover:bg-indigo-500 transition font-semibold disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
								>
									{editSaving ? (<><i className="ri-loader-4-line animate-spin" /> Saving…</>) : "Save Changes"}
								</button>
							</div>
						</div>
					</div>
				)}

				{/* AVATAR PRESET SELECTOR MODAL */}
				{showAvatarModal && (
					<div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
						<div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl w-full max-w-lg shadow-2xl">
							<h2 className="text-xl font-bold mb-2 text-indigo-400">Edit Profile Picture</h2>
							<p className="text-zinc-400 text-sm mb-4">Select a preset avatar to update your profile.</p>
							
							<div className="flex flex-wrap gap-2 mb-6">
								{Object.keys(AVATAR_PRESETS).map(category => (
									<button 
										key={category}
										onClick={() => setActiveAvatarCategory(category)}
										className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${activeAvatarCategory === category ? "bg-indigo-600 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`}
									>
										{category}
									</button>
								))}
							</div>

							{ (userData.email === "sujal.neupane.19.sn@gmail.com" || userData.name?.toLowerCase() === "kenya" || userData.unlockedCosmetics?.includes("avatar-custom")) && (
								<div className="mb-6 p-4 bg-zinc-950 border border-indigo-500/30 rounded-xl">
									<h3 className="text-sm font-bold text-indigo-400 mb-2 flex items-center gap-2">
										<i className="ri-vip-crown-line"></i> Custom Avatar Upload
									</h3>
									<input 
										type="file" 
										accept="image/*"
										onChange={(e) => {
											const file = e.target.files[0];
											if (file) {
												const reader = new FileReader();
												reader.onloadend = () => {
													setAvatarInput(reader.result);
												};
												reader.readAsDataURL(file);
											}
										}}
										className="text-xs text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-indigo-600/20 file:text-indigo-400 hover:file:bg-indigo-600/30 cursor-pointer"
									/>
								</div>
							)}

							<div className="grid grid-cols-4 gap-3 mb-6">
								{AVATAR_PRESETS[activeAvatarCategory].map((src, idx) => (
									<img 
										key={idx} 
										src={src} 
										alt={`Preset ${idx}`} 
										className={`w-16 h-16 object-cover rounded-full cursor-pointer border-2 transition ${avatarInput === src ? "border-indigo-500 opacity-100" : "border-transparent opacity-60 hover:opacity-100"}`}
										onClick={() => setAvatarInput(src)}
									/>
								))}
							</div>

							<div className="flex gap-4">
								<button
									onClick={() => setShowAvatarModal(false)}
									className="flex-1 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl hover:bg-zinc-700 font-semibold cursor-pointer transition text-zinc-350"
								>
									Cancel
								</button>
								<button
									onClick={async () => {
										const username = localStorage.getItem("username");
										if (!username) return;
										try {
											await fetch(`http://localhost:8000/api/users/${username}`, {
												method: "PUT",
												headers: { "Content-Type": "application/json" },
												body: JSON.stringify({ avatar: avatarInput }),
											});
											setUserData({ ...userData, avatar: avatarInput });
											localStorage.setItem("avatar", avatarInput);
											window.dispatchEvent(new Event("avatarUpdate")); // Broadcast change
											setShowAvatarModal(false);
										} catch(err) {
											console.error("Error updating avatar", err);
										}
									}}
									className="flex-1 py-2.5 bg-indigo-600 rounded-xl hover:bg-indigo-500 font-semibold cursor-pointer transition"
								>
									Save Avatar
								</button>
							</div>
						</div>
					</div>
				)}
			</main>

			<Footer />
		</div>
	);
}
