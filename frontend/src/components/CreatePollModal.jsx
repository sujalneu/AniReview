import { useState } from "react";

export default function CreatePollModal({ isOpen, onClose, onCreate, currentUser }) {
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState(["", ""]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
    const accountAgeMs = currentUser?.createdAt ? (Date.now() - new Date(currentUser.createdAt).getTime()) : 0;
    const accountAgeDays = Math.floor(accountAgeMs / (1000 * 60 * 60 * 24));
    const isEligible = !currentUser || currentUser.isAdmin || accountAgeMs >= sevenDaysInMs;

    if (!isOpen) return null;

    const handleAddOption = () => {
        if (options.length < 5) {
            setOptions([...options, ""]);
        }
    };

    const handleRemoveOption = (index) => {
        if (options.length > 2) {
            const newOptions = options.filter((_, i) => i !== index);
            setOptions(newOptions);
        }
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!question.trim()) {
            setError("Question is required.");
            return;
        }

        const validOptions = options.map(opt => opt.trim()).filter(opt => opt !== "");
        if (validOptions.length < 2) {
            setError("At least two options are required.");
            return;
        }

        setLoading(true);
        try {
            await onCreate({ question, options: validOptions });
            setQuestion("");
            setOptions(["", ""]);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create poll.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-2xl p-8 shadow-2xl relative animate-in fade-in zoom-in duration-300">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-zinc-500 hover:text-white transition"
                >
                    <i className="ri-close-line text-2xl"></i>
                </button>

                <h2 className="text-2xl font-bold text-white mb-6">Create New Poll</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">Question</label>
                        <input 
                            type="text"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="What's your favorite anime of the season?"
                            className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-zinc-400">Options</label>
                        {options.map((option, index) => (
                            <div key={index} className="flex gap-2">
                                <input 
                                    type="text"
                                    value={option}
                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                    placeholder={`Option ${index + 1}`}
                                    className="flex-1 px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                                />
                                {options.length > 2 && (
                                    <button 
                                        type="button"
                                        onClick={() => handleRemoveOption(index)}
                                        className="p-2 text-zinc-500 hover:text-red-400 transition"
                                    >
                                        <i className="ri-delete-bin-line text-xl"></i>
                                    </button>
                                )}
                            </div>
                        ))}
                        {options.length < 5 && (
                            <button 
                                type="button"
                                onClick={handleAddOption}
                                className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition flex items-center gap-1"
                            >
                                <i className="ri-add-line"></i> Add Option
                            </button>
                        )}
                    </div>

                    {error && <p className="text-red-400 text-sm">{error}</p>}

                    {/* Eligibility warning block */}
                    {!isEligible && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs leading-relaxed flex items-start gap-2.5">
                            <i className="ri-error-warning-line text-lg shrink-0 mt-0.5"></i>
                            <div>
                                <span className="font-bold block mb-1">Eligibility Restriction:</span>
                                Your account age is currently <strong>{accountAgeDays} {accountAgeDays === 1 ? 'day' : 'days'}</strong>. You must be registered for at least <strong>7 days</strong> to create new community polls.
                            </div>
                        </div>
                    )}

                    <button 
                        type="submit"
                        disabled={loading || !isEligible}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition shadow-lg shadow-indigo-600/20 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {loading ? "Creating..." : "Launch Poll"}
                    </button>
                    
                    <p className="text-center text-xs text-zinc-500 italic">
                        Polls run for exactly 7 days from creation.
                    </p>
                </form>
            </div>
        </div>
    );
}
