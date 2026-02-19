import { useState } from "react";

export default function AdminDashboard() {
	const [activeTab, setActiveTab] = useState("anime");

	return (
		<div className="flex min-h-screen bg-zinc-950 text-white">
			{/* SIDEBAR */}
			<div className="w-64 bg-zinc-900 border-r border-zinc-800 p-6">
				<h1 className="text-2xl font-bold text-indigo-500 mb-10">
					AniReview Admin
				</h1>

				<nav className="space-y-3">
					<button
						onClick={() => setActiveTab("anime")}
						className={`block w-full text-left px-4 py-2 rounded-lg ${
							activeTab === "anime" ? "bg-indigo-600" : "hover:bg-zinc-800"
						}`}
					>
						Manage Anime
					</button>

					<button
						onClick={() => setActiveTab("reviews")}
						className={`block w-full text-left px-4 py-2 rounded-lg ${
							activeTab === "reviews" ? "bg-indigo-600" : "hover:bg-zinc-800"
						}`}
					>
						Moderate Reviews
					</button>

					<button
						onClick={() => setActiveTab("analytics")}
						className={`block w-full text-left px-4 py-2 rounded-lg ${
							activeTab === "analytics" ? "bg-indigo-600" : "hover:bg-zinc-800"
						}`}
					>
						Analytics
					</button>
				</nav>
			</div>

			{/* MAIN */}
			<div className="flex-1 p-10">
				{/* HEADER */}
				<div className="flex justify-between items-center mb-10">
					<h2 className="text-3xl font-bold">Admin Dashboard</h2>

					<button className="bg-indigo-600 px-5 py-2 rounded-lg hover:bg-indigo-500">
						+ Add Anime
					</button>
				</div>

				{/* ========== ANALYTICS ========== */}
				{activeTab === "analytics" && (
					<div className="grid md:grid-cols-4 gap-6">
						<div className="bg-zinc-900 p-6 rounded-xl">
							<p className="text-zinc-400">Total Users</p>
							<h3 className="text-3xl font-bold mt-2">1,240</h3>
						</div>

						<div className="bg-zinc-900 p-6 rounded-xl">
							<p className="text-zinc-400">Total Anime</p>
							<h3 className="text-3xl font-bold mt-2">320</h3>
						</div>

						<div className="bg-zinc-900 p-6 rounded-xl">
							<p className="text-zinc-400">Reviews</p>
							<h3 className="text-3xl font-bold mt-2">5,430</h3>
						</div>

						<div className="bg-zinc-900 p-6 rounded-xl">
							<p className="text-zinc-400">Active Users</p>
							<h3 className="text-3xl font-bold mt-2">210</h3>
						</div>
					</div>
				)}

				{/* ========== MANAGE ANIME ========== */}
				{activeTab === "anime" && (
					<div className="bg-zinc-900 rounded-xl p-6">
						<h3 className="text-xl font-bold mb-6">Manage Anime</h3>

						<table className="w-full text-sm">
							<thead className="text-zinc-400 border-b border-zinc-700">
								<tr>
									<th className="text-left py-3">Title</th>
									<th className="text-left">Year</th>
									<th className="text-left">Rating</th>
									<th className="text-left">Actions</th>
								</tr>
							</thead>

							<tbody>
								{/* Example rows */}
								<tr className="border-b border-zinc-800">
									<td className="py-4">Attack on Titan</td>
									<td>2013</td>
									<td>9.0</td>
									<td className="space-x-3">
										<button className="px-3 py-1 bg-blue-600 rounded">
											Edit
										</button>
										<button className="px-3 py-1 bg-red-600 rounded">
											Delete
										</button>
									</td>
								</tr>

								<tr className="border-b border-zinc-800">
									<td className="py-4">Jujutsu Kaisen</td>
									<td>2020</td>
									<td>8.7</td>
									<td className="space-x-3">
										<button className="px-3 py-1 bg-blue-600 rounded">
											Edit
										</button>
										<button className="px-3 py-1 bg-red-600 rounded">
											Delete
										</button>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				)}

				{/* ========== MODERATE REVIEWS ========== */}
				{activeTab === "reviews" && (
					<div className="bg-zinc-900 rounded-xl p-6">
						<h3 className="text-xl font-bold mb-6">Moderate Reviews</h3>

						<div className="space-y-4">
							<div className="bg-zinc-800 p-4 rounded-lg flex justify-between">
								<p>"This anime is trash"</p>
								<button className="bg-red-600 px-3 py-1 rounded">Delete</button>
							</div>

							<div className="bg-zinc-800 p-4 rounded-lg flex justify-between">
								<p>"Best anime ever"</p>
								<button className="bg-red-600 px-3 py-1 rounded">Delete</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
