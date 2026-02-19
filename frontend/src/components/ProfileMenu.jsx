export default function ProfileMenu({ user }) {
	function handleProfileClick() {
		if (user.loggedIn) alert("Navigate to profile page");
		else alert("Please login or sign up first");
	}

	return (
		<button
			onClick={handleProfileClick}
			className="w-10 h-10 rounded-full border border-zinc-700 overflow-hidden hover:border-white transition"
		>
			<img
				src={
					user.loggedIn ? user.avatar : "https://via.placeholder.com/40?text=G"
				}
				alt="profile"
				className="w-full h-full object-cover"
			/>
		</button>
	);
}
