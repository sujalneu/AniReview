export default function ReviewCard({ review }) {
	return (
		<div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
			<img
				src={review.img}
				alt={review.title}
				className="h-52 w-full object-cover"
			/>
			<div className="p-5 space-y-2">
				<div className="flex justify-between items-center">
					<h3 className="font-semibold">{review.title}</h3>
					<span className="text-yellow-400">⭐ {review.rating}</span>
				</div>
				<p className="text-zinc-400 text-sm">{review.review}</p>
				<div className="text-xs text-zinc-500 pt-2">👤 {review.user}</div>
			</div>
		</div>
	);
}
