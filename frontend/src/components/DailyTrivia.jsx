import { useEffect, useState } from "react";
import axios from "axios";

const QUESTION_BANK = [
	{
		id: 1,
		question: "Who is Naruto's father?",
		options: ["Minato", "Jiraiya", "Kakashi", "Itachi"],
		answer: "Minato",
	},
	{
		id: 2,
		question: "What is Luffy's dream?",
		options: [
			"Be strongest",
			"Find One Piece",
			"Be King of Pirates",
			"Travel world",
		],
		answer: "Be King of Pirates",
	},
	{
		id: 3,
		question: "Which anime has Titans?",
		options: ["Bleach", "Attack on Titan", "Naruto", "One Piece"],
		answer: "Attack on Titan",
	},
	{
		id: 4,
		question: "Who is Gojo?",
		options: ["Teacher", "Villain", "Curse", "Student"],
		answer: "Teacher",
	},
	{
		id: 5,
		question: "What power does Tanjiro use?",
		options: ["Fire", "Water", "Wind", "Lightning"],
		answer: "Water",
	},
	{
		id: 6,
		question: "Who uses Death Note?",
		options: ["L", "Light", "Near", "Mello"],
		answer: "Light",
	},
];

function getTodayKey() {
	const d = new Date();
	return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function pickRandom() {
	return [...QUESTION_BANK].sort(() => 0.5 - Math.random()).slice(0, 5);
}

export default function DailyTrivia() {
	const [questions, setQuestions] = useState([]);
	const [current, setCurrent] = useState(0);
	const [score, setScore] = useState(0);
	const [answered, setAnswered] = useState([]);
	const [selected, setSelected] = useState(null);

	const todayKey = getTodayKey();

	useEffect(() => {
		const loggedInUsername = localStorage.getItem("username") || "Guest";
		const storageKey = `trivia_${loggedInUsername}`;

		async function checkTriviaStatus() {
			const token = localStorage.getItem("token");
			if (!token || loggedInUsername === "Guest") return;

			try {
				const res = await axios.get(`http://localhost:8000/api/users/${loggedInUsername}`);
				if (res.data.lastTriviaDate === todayKey) {
					setCurrent(5);
					const saved = JSON.parse(localStorage.getItem(storageKey));
					if (saved && saved.date === todayKey) {
						setScore(saved.score);
					} else {
						setScore(5);
					}
				}
			} catch (err) {
				console.error("Failed to check trivia status:", err);
			}
		}

		const saved = JSON.parse(localStorage.getItem(storageKey));

		if (saved && saved.date === todayKey) {
			setQuestions(saved.questions);
			setScore(saved.score);
			setAnswered(saved.answered);
			setCurrent(saved.current);
		} else {
			const newQ = pickRandom();
			const data = {
				date: todayKey,
				questions: newQ,
				score: 0,
				answered: [],
				current: 0,
			};
			localStorage.setItem(storageKey, JSON.stringify(data));
			setQuestions(newQ);
		}

		checkTriviaStatus();
	}, [todayKey]);

	function handleAnswer(opt) {
		if (answered.includes(current) || selected !== null) return;

		setSelected(opt);

		setTimeout(() => {
			let newScore = score;

			if (opt === questions[current].answer) {
				newScore++;
				setScore(newScore);
			}

			const newAnswered = [...answered, current];
			const next = current + 1;

			const loggedInUsername = localStorage.getItem("username") || "Guest";
			const storageKey = `trivia_${loggedInUsername}`;

			localStorage.setItem(
				storageKey,
				JSON.stringify({
					date: todayKey,
					questions,
					score: newScore,
					answered: newAnswered,
					current: next,
				})
			);

			if (next >= questions.length) {
				const token = localStorage.getItem("token");
				if (token) {
					axios.post(
						"http://localhost:8000/api/trivia/claim",
						{ correctCount: newScore, today: todayKey },
						{ headers: { Authorization: `Bearer ${token}` } }
					).then((res) => {
						const pointsEarned = res.data.pointsEarned;
						if (pointsEarned > 0) {
							window.dispatchEvent(new CustomEvent("show-points-popup", {
								detail: { points: pointsEarned, reason: `Completed Daily Trivia! (${newScore}/5 correct)` }
							}));
						}
					}).catch((err) => {
						console.error("Trivia claim error:", err);
					});
				}
			}

			setAnswered(newAnswered);
			setCurrent(next);
			setSelected(null);
		}, 900);
	}

	if (!questions.length) return null;

	if (current >= questions.length) {
		return (
			<div className="w-full text-center bg-zinc-900/60 border border-zinc-800 p-8 rounded-3xl shadow-xl backdrop-blur-md relative overflow-hidden group">
				{/* Background glowing circle for premium accent */}
				<div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl transition-transform group-hover:scale-110"></div>
				
				<div className="relative z-10 py-4 flex flex-col items-center gap-4">
					<div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-3xl shadow-lg shadow-indigo-500/5">
						<i className="ri-award-line animate-bounce"></i>
					</div>
					<div>
						<h2 className="text-2xl font-black text-white tracking-tight">Trivia Completed!</h2>
						<p className="text-zinc-500 text-xs mt-1">Thanks for testing your anime knowledge today.</p>
					</div>
					<div className="my-4 px-6 py-3 bg-zinc-850 rounded-2xl border border-zinc-800 text-center">
						<span className="text-[10px] uppercase font-bold text-zinc-500 block tracking-wider">Your Score</span>
						<span className="text-3xl font-black text-white">{score} <span className="text-lg text-zinc-500 font-medium">/ 5</span></span>
					</div>
					<p className="text-indigo-400 font-semibold text-xs flex items-center gap-1">
						<i className="ri-refresh-line"></i> New trivia resets daily
					</p>
				</div>
			</div>
		);
	}

	const q = questions[current];
	const progress = (current / 5) * 100;

	return (
		<section className="w-full">
			<div className="bg-zinc-900/40 border border-zinc-850 p-6 rounded-3xl shadow-lg backdrop-blur-md relative overflow-hidden group/trivia">
				{/* Background accent glow */}
				<div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl"></div>
				
				{/* Header */}
				<div className="flex justify-between items-center mb-4 relative z-10">
					<div className="flex items-center gap-2">
						<span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
						<h2 className="text-sm font-black text-indigo-400 uppercase tracking-widest">Daily Trivia</h2>
					</div>
					<span className="text-xs font-bold text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded-md border border-zinc-800">
						{current + 1} of 5
					</span>
				</div>

				{/* Progress bar */}
				<div className="w-full h-1.5 bg-zinc-950 rounded-full mb-6 overflow-hidden">
					<div
						className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500 relative"
						style={{ width: `${progress}%` }}
					>
						<span className="absolute inset-0 bg-white/20 animate-pulse"></span>
					</div>
				</div>

				{/* Question */}
				<h3 className="text-base font-bold text-white mb-6 text-center leading-snug min-h-12 flex items-center justify-center px-2">
					{q.question}
				</h3>

				{/* Options */}
				<div className="grid gap-2.5 relative z-10">
					{q.options.map((opt) => {
						const isCorrect = opt === q.answer;
						const isSelected = selected === opt;
						
						// State coloring system
						let btnStyle = "bg-zinc-900/50 hover:bg-zinc-800/80 border-zinc-850 text-zinc-300 hover:text-white";
						
						if (selected !== null) {
							if (isSelected) {
								if (isCorrect) {
									btnStyle = "bg-emerald-600/20 border-emerald-500/50 text-emerald-400 shadow-md shadow-emerald-500/5 font-bold scale-[0.98]";
								} else {
									btnStyle = "bg-rose-600/20 border-rose-500/50 text-rose-400 shadow-md shadow-rose-500/5 font-bold scale-[0.98]";
								}
							} else {
								// Reveal correct answer if selected option was wrong
								if (isCorrect) {
									btnStyle = "bg-emerald-600/10 border-emerald-500/30 text-emerald-500 font-semibold";
								} else {
									btnStyle = "bg-zinc-950/20 border-zinc-950/20 text-zinc-600 pointer-events-none opacity-40";
								}
							}
						}

						return (
							<button
								key={opt}
								onClick={() => handleAnswer(opt)}
								disabled={selected !== null}
								className={`w-full py-3 px-4 rounded-xl border text-sm transition-all duration-300 cursor-pointer ${btnStyle}`}
							>
								<div className="flex items-center justify-between">
									<span className="truncate">{opt}</span>
									{selected !== null && isSelected && (
										<i className={isCorrect ? "ri-checkbox-circle-fill text-emerald-400" : "ri-close-circle-fill text-rose-400"}></i>
									)}
									{selected !== null && !isSelected && isCorrect && (
										<i className="ri-checkbox-circle-line text-emerald-500/80"></i>
									)}
								</div>
							</button>
						);
					})}
				</div>

				{/* Footer */}
				<div className="mt-6 flex justify-between items-center text-[10px] font-bold text-zinc-500 border-t border-zinc-850 pt-4">
					<span className="flex items-center gap-1">
						<i className="ri-star-line text-indigo-400"></i> Score: {score} XP
					</span>
					<span className="flex items-center gap-0.5">
						<i className="ri-shield-user-line text-indigo-400"></i> Single Attempt
					</span>
				</div>
			</div>
		</section>
	);
}
