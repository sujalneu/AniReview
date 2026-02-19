import React, { useEffect } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Authentication from "./pages/Authentication";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import GenrePage from "./pages/GenrePage";
import AnimeDetail from "./pages/AnimeDetail";
import SearchPage from "./pages/SearchPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import UpcomingAnimePage from "./pages/UpcomingAnimePage";
import TopRated from "./pages/TopRated";
import AdminDashboard from "./pages/AdminDashboard";

// Layout wrapper
const Layout = ({ children }) => (
	<>
		<Navbar />
		{children}
	</>
);

// Temporary placeholder pages
const PlaceholderPage = ({ text }) => (
	<div className="p-10 text-white">{text} coming soon!</div>
);

const App = () => {
	useEffect(() => {
		async function getData() {
			try {
				const res = await axios.get("http://localhost:8000/test");
				console.log(res.data);
			} catch (err) {
				console.error("API error:", err.message);
			}
		}
		getData();
	}, []);

	return (
		<BrowserRouter>
			<Routes>
				{/* Root redirect to auth */}
				<Route path="/" element={<Navigate to="/auth" />} />

				{/* Authentication page */}
				<Route path="/auth" element={<Authentication />} />

				{/* Protected Home */}
				<Route
					path="/home"
					element={
						<ProtectedRoute>
							<Layout>
								<HomePage />
							</Layout>
						</ProtectedRoute>
					}
				/>

				{/* Protected profile page */}
				<Route
					path="/profile"
					element={
						<ProtectedRoute>
							<Layout>
								<ProfilePage />
							</Layout>
						</ProtectedRoute>
					}
				/>

				{/* Genre pages */}
				<Route
					path="/genre/:genreName"
					element={
						<ProtectedRoute>
							<Layout>
								<GenrePage />
							</Layout>
						</ProtectedRoute>
					}
				/>

				{/* Anime detail page */}
				<Route
					path="/anime/:id"
					element={
						<ProtectedRoute>
							<Layout>
								<AnimeDetail />
							</Layout>
						</ProtectedRoute>
					}
				/>

				{/* Search page */}
				<Route
					path="/search/:query"
					element={
						<ProtectedRoute>
							<Layout>
								<SearchPage />
							</Layout>
						</ProtectedRoute>
					}
				/>
				{/* Upcoming Anime Page */}
				<Route
					path="/upcoming"
					element={
						<ProtectedRoute>
							<Layout>
								<UpcomingAnimePage />
							</Layout>
						</ProtectedRoute>
					}
				/>
				{/* TOPRATED Anime Page */}
				<Route
					path="/toprated"
					element={
						<ProtectedRoute>
							<Layout>
								<TopRated />
							</Layout>
						</ProtectedRoute>
					}
				/>
				{/* Review pages */}
				<Route
					path="/reviews/:reviewId"
					element={<PlaceholderPage text="Review Page" />}
				/>

				{/* Catch-all 404 */}
				<Route
					path="*"
					element={<div className="p-10 text-white">404 - Page not found</div>}
				/>

				{/* Admin Dashboard page */}
				<Route path="/admin" element={<AdminDashboard />} />
			</Routes>
		</BrowserRouter>
	);
};

export default App;
