import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Authentication() {
	useEffect(() => {
		setForm({
			username: "",
			email: "",
			password: "",
			confirmPassword: "",
		});
	}, []);

	const [mode, setMode] = useState("login");
	const [form, setForm] = useState({
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async () => {
		setError("");

		if (mode === "signup" && form.password !== form.confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		try {
			let res;

			if (mode === "login") {
				// LOGIN
				res = await axios.post("http://localhost:8000/api/users/login", {
					email: form.email,
					password: form.password,
				});
			} else {
				// SIGNUP
				res = await axios.post("http://localhost:8000/api/users/register", {
					username: form.username,
					email: form.email,
					password: form.password,
				});
			}

			// Save token & username in localStorage
			localStorage.setItem("token", res.data.token);
			localStorage.setItem("username", res.data.username);
			localStorage.setItem("isGuest", "false");

			navigate("/home");
		} catch (err) {
			console.error(err.response?.data || err.message);
			setError(err.response?.data?.message || "Server error");
		}
	};

	const handleGuestLogin = () => {
		// Save guest status
		localStorage.setItem("isGuest", "true");
		localStorage.removeItem("token");
		localStorage.setItem("username", "Guest");
		navigate("/home");
	};

	return (
		<div
			className="min-h-screen flex items-center justify-center p-6 bg-cover bg-center"
			style={{
				backgroundImage: "url('/src/assets/anime-bg.jpg')",
			}}
		>
			<div className="absolute inset-0 bg-black/70"></div>

			<div className="relative w-full max-w-md bg-zinc-900/90 border border-zinc-800 rounded-2xl shadow-xl p-8 space-y-6 backdrop-blur">
				<div className="text-center space-y-2">
					<h1 className="text-2xl font-bold text-zinc-400">AniReview</h1>
					<p className="text-zinc-400 text-sm">
						{mode === "login"
							? "Welcome back — continue your journey"
							: "Create your anime identity"}
					</p>
				</div>

				{/* FORM START */}
				<form autoComplete="off" className="space-y-4">
					{/* hidden autofill killers */}
					<input type="text" name="fakeuser" style={{ display: "none" }} />
					<input type="password" name="fakepass" style={{ display: "none" }} />

					{mode === "signup" && (
						<input
							name="username"
							autoComplete="off"
							value={form.username}
							onChange={handleChange}
							placeholder="Username"
							className="text-zinc-400 w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 outline-none"
						/>
					)}

					<input
						name="email"
						type="email"
						autoComplete="off"
						value={form.email}
						onChange={handleChange}
						placeholder="Email"
						className="text-zinc-400 w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 outline-none"
					/>

					<input
						name="password"
						type="password"
						autoComplete="new-password"
						value={form.password}
						onChange={handleChange}
						placeholder="Password"
						className="text-zinc-400 w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 outline-none"
					/>

					{mode === "signup" && (
						<input
							name="confirmPassword"
							type="password"
							autoComplete="new-password"
							value={form.confirmPassword}
							onChange={handleChange}
							placeholder="Confirm password"
							className="text-zinc-400 w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 outline-none"
						/>
					)}

					{error && <p className="text-red-500 text-sm">{error}</p>}

					<button
						type="button"
						onClick={handleSubmit}
						className="w-full rounded-xl bg-zinc-100 text-zinc-900 py-2 font-medium"
					>
						{mode === "login" ? "Login" : "Create Account"}
					</button>

					<button
						type="button"
						onClick={handleGuestLogin}
						className="w-full rounded-xl border border-zinc-700 text-zinc-100 py-2 font-medium hover:bg-zinc-800 transition"
					>
						Continue as Guest
					</button>
				</form>
				{/* FORM END */}

				<div className="flex justify-between text-sm text-zinc-400">
					<button
						onClick={() => setMode(mode === "login" ? "signup" : "login")}
						className="hover:text-zinc-200"
					>
						{mode === "login" ? "Create account" : "Already have an account?"}
					</button>
				</div>
			</div>
		</div>
	);
}
