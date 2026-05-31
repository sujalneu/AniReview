import { useState, useEffect } from "react";

export default function PointsNotification() {
	const [notifications, setNotifications] = useState([]);

	useEffect(() => {
		const handleShowPopup = (e) => {
			const { points, xp, reason } = e.detail;
			const id = Date.now() + Math.random().toString(36).substr(2, 9);
			
			// Add new notification to queue
			setNotifications((prev) => [...prev, { id, points, xp, reason }]);

			// Automatically remove after 4.5 seconds (allowing fade out)
			setTimeout(() => {
				setNotifications((prev) => prev.filter((n) => n.id !== id));
			}, 4500);
		};

		window.addEventListener("show-points-popup", handleShowPopup);
		return () => {
			window.removeEventListener("show-points-popup", handleShowPopup);
		};
	}, []);

	return (
		<div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm pointer-events-none">
			{notifications.map((n) => (
				<div
					key={n.id}
					className="animate-slide-in pointer-events-auto flex items-center gap-4 bg-zinc-900/90 border border-indigo-500/30 backdrop-blur-xl p-4 rounded-2xl shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all duration-500 relative overflow-hidden"
					style={{
						animation: "slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards, fadeOut 0.5s ease 4s forwards"
					}}
				>
					{/* Particle glow line */}
					<div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-400 via-purple-500 to-pink-500" />
					
					{/* Icon */}
					<div className="w-12 h-12 rounded-full bg-indigo-600/10 flex items-center justify-center border border-indigo-500/20 text-2xl animate-bounce">
						🔥
					</div>

					{/* Content */}
					<div>
						<div className="flex items-baseline gap-1">
							<span className="text-xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
								+{n.points || n.xp || 0}
							</span>
							<span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">
								{n.xp ? "XP" : "Points"}
							</span>
						</div>
						<p className="text-xs text-zinc-400 font-semibold mt-0.5">
							{n.reason || "Activity reward!"}
						</p>
					</div>
				</div>
			))}
			
			{/* CSS Keyframes injected directly for compatibility */}
			<style>{`
				@keyframes slideIn {
					from {
						opacity: 0;
						transform: translateY(20px) scale(0.9);
					}
					to {
						opacity: 1;
						transform: translateY(0) scale(1);
					}
				}
				@keyframes fadeOut {
					from {
						opacity: 1;
						transform: translateY(0);
					}
					to {
						opacity: 0;
						transform: translateY(-10px);
					}
				}
			`}</style>
		</div>
	);
}
