import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const API = "http://localhost:8000/api/users";

/* ── tiny helpers ─────────────────────────────────────────────────────────── */
const InputField = ({ icon, ...props }) => (
    <div className="relative">
        {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm pointer-events-none">
                <i className={icon} />
            </span>
        )}
        <input
            {...props}
            className={`w-full bg-zinc-800/70 border border-zinc-700/60 rounded-xl py-3 pr-4 outline-none text-zinc-200 placeholder-zinc-500 focus:border-violet-500/70 focus:bg-zinc-800 transition-all duration-200 ${icon ? "pl-10" : "pl-4"}`}
        />
    </div>
);

const OtpBoxes = ({ value, onChange }) => {
    const digits = (value + "      ").slice(0, 6).split("");
    const refs = Array.from({ length: 6 }, () => null);
    const handleKey = (i, e) => {
        if (e.key === "Backspace" && !e.target.value && i > 0) refs[i - 1]?.focus();
    };
    const handleInput = (i, e) => {
        const v = e.target.value.replace(/\D/g, "").slice(-1);
        const next = value.slice(0, i) + v + value.slice(i + 1);
        onChange(next.slice(0, 6));
        if (v && i < 5) refs[i + 1]?.focus();
    };
    return (
        <div className="flex gap-2 justify-center">
            {digits.map((d, i) => (
                <input
                    key={i}
                    ref={(el) => (refs[i] = el)}
                    value={d.trim()}
                    onChange={(e) => handleInput(i, e)}
                    onKeyDown={(e) => handleKey(i, e)}
                    maxLength={1}
                    inputMode="numeric"
                    className="w-11 h-13 text-center text-xl font-bold bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:border-violet-500 focus:outline-none transition-all duration-200 focus:scale-105"
                    style={{ lineHeight: "3rem", height: "3.25rem" }}
                />
            ))}
        </div>
    );
};

/* ── main component ──────────────────────────────────────────────────────── */
export default function Authentication() {
    // mode: "login" | "signup" | "forgot" | "forgot-otp" | "forgot-newpass"
    const [mode, setMode] = useState("login");
    const [otpMode, setOtpMode] = useState(false);         // registration OTP
    const [otp, setOtp] = useState("");
    const [resetToken, setResetToken] = useState("");
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        newPassword: "",
        confirmNewPassword: "",
        forgotEmail: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const navigate = useNavigate();
    const location = useLocation();

    /* ── handle OAuth callback (token in URL hash — avoids HTTP 431) ─── */
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const oauthError = params.get("oauth_error");

        if (oauthError) {
            setError(decodeURIComponent(oauthError.replace(/\+/g, " ")));
            window.history.replaceState({}, "", "/auth");
            return;
        }

        const hashParams = new URLSearchParams(location.hash.replace(/^#/, ""));
        const token = hashParams.get("token") || params.get("token");
        if (!token) return;

        let cancelled = false;

        (async () => {
            try {
                localStorage.setItem("token", token);
                localStorage.setItem("isGuest", "false");

                const { data } = await axios.get(`${API}/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (cancelled) return;

                localStorage.setItem("userId", data.id);
                localStorage.setItem("username", data.username);
                if (data.avatar) localStorage.setItem("avatar", data.avatar);

                setSuccess("Logged in successfully! Redirecting…");
                window.history.replaceState({}, "", "/auth");
                setTimeout(() => navigate("/home"), 1000);
            } catch {
                if (cancelled) return;
                localStorage.removeItem("token");
                setError("OAuth login failed. Please try again.");
                window.history.replaceState({}, "", "/auth");
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [location.search, location.hash, navigate]);

    /* ── reset form when switching mode ──────────────────────────────── */
    useEffect(() => {
        setError("");
        setSuccess("");
        setOtp("");
    }, [mode, otpMode]);

    const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

    const finishLogin = (data) => {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.id);
        localStorage.setItem("username", data.username);
        localStorage.setItem("isGuest", "false");
        setSuccess("Logged in! Redirecting…");
        setTimeout(() => navigate("/home"), 1200);
    };

    /* ── SUBMIT HANDLERS ──────────────────────────────────────────────── */
    const handleSubmit = async () => {
        setError("");
        setLoading(true);
        try {
            // ── Registration OTP verify ────────────────────────────────
            if (otpMode) {
                const res = await axios.post(`${API}/verify-otp`, { email: form.email, otp });
                finishLogin(res.data);
                return;
            }

            // ── Login ──────────────────────────────────────────────────
            if (mode === "login") {
                const res = await axios.post(`${API}/login`, { email: form.email, password: form.password });
                finishLogin(res.data);
                return;
            }

            // ── Sign-up ────────────────────────────────────────────────
            if (mode === "signup") {
                if (form.password !== form.confirmPassword) {
                    setError("Passwords do not match");
                    return;
                }
                const res = await axios.post(`${API}/register`, {
                    username: form.username,
                    email: form.email,
                    password: form.password,
                });
                if (res.data.requireOtp) {
                    setOtpMode(true);
                    setSuccess("OTP sent to your email! Check your inbox.");
                    return;
                }
                finishLogin(res.data);
                return;
            }

            // ── Forgot — send OTP ──────────────────────────────────────
            if (mode === "forgot") {
                if (!form.forgotEmail) { setError("Enter your email"); return; }
                await axios.post(`${API}/forgot-password`, { email: form.forgotEmail });
                setSuccess("OTP sent! Check your inbox (and spam folder).");
                setMode("forgot-otp");
                return;
            }

            // ── Forgot — verify OTP ────────────────────────────────────
            if (mode === "forgot-otp") {
                if (otp.length < 6) { setError("Enter the full 6-digit OTP"); return; }
                const res = await axios.post(`${API}/verify-reset-otp`, { email: form.forgotEmail, otp });
                setResetToken(res.data.resetToken);
                setSuccess("OTP verified! Set your new password below.");
                setMode("forgot-newpass");
                return;
            }

            // ── Forgot — set new password ──────────────────────────────
            if (mode === "forgot-newpass") {
                if (form.newPassword.length < 6) { setError("Password must be at least 6 characters"); return; }
                if (form.newPassword !== form.confirmNewPassword) { setError("Passwords do not match"); return; }
                await axios.post(`${API}/reset-password`, { resetToken, newPassword: form.newPassword });
                setSuccess("Password reset! You can now log in.");
                setTimeout(() => { setMode("login"); setForm((f) => ({ ...f, newPassword: "", confirmNewPassword: "" })); }, 1800);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleGuestLogin = () => {
        localStorage.setItem("isGuest", "true");
        localStorage.removeItem("token");
        localStorage.setItem("username", "Guest");
        setSuccess("Logging in as guest…");
        setTimeout(() => navigate("/home"), 900);
    };

    const handleOAuth = (provider) => {
        window.location.href = `${API}/oauth/${provider}`;
    };

    /* ── LABEL HELPERS ──────────────────────────────────────────────── */
    const modeLabel = () => {
        if (otpMode) return "Verify Your Email";
        if (mode === "login") return "Welcome back";
        if (mode === "signup") return "Create your anime identity";
        if (mode === "forgot") return "Reset Password";
        if (mode === "forgot-otp") return "Enter OTP";
        if (mode === "forgot-newpass") return "Set New Password";
    };

    const btnLabel = () => {
        if (loading) return "Please wait…";
        if (otpMode) return "Verify & Continue";
        if (mode === "login") return "Login";
        if (mode === "signup") return "Create Account";
        if (mode === "forgot") return "Send Reset OTP";
        if (mode === "forgot-otp") return "Verify OTP";
        if (mode === "forgot-newpass") return "Reset Password";
    };

    const showOAuth = !otpMode && (mode === "login" || mode === "signup");
    const showModeSwitch = !otpMode && (mode === "login" || mode === "signup");
    const showGuest = !otpMode && (mode === "login" || mode === "signup");
    const showForgotLink = !otpMode && mode === "login";
    const showBackToLogin =
        mode === "forgot" || mode === "forgot-otp" || mode === "forgot-newpass";

    /* ── RENDER ──────────────────────────────────────────────────────── */
    return (
        <div
            className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
            style={{ background: "radial-gradient(ellipse at 60% 0%, #1e1025 0%, #0c0c12 60%, #080810 100%)" }}
        >
            {/* Ambient blobs */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        "radial-gradient(circle at 20% 80%, rgba(139,92,246,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(59,130,246,0.06) 0%, transparent 50%)",
                }}
            />

            {/* Anime-style grid lines */}
            <div
                className="absolute inset-0 pointer-events-none opacity-5"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(139,92,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.5) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                }}
            />

            {/* Card */}
            <div
                className="relative w-full max-w-md z-10"
                style={{
                    background: "rgba(15,15,22,0.85)",
                    border: "1px solid rgba(139,92,246,0.18)",
                    borderRadius: "24px",
                    boxShadow: "0 0 60px rgba(139,92,246,0.1), 0 32px 64px rgba(0,0,0,0.6)",
                    backdropFilter: "blur(24px)",
                    padding: "40px",
                }}
            >
                {/* Logo & title */}
                <div className="text-center mb-8">
                    <div
                        className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
                        style={{
                            background: "rgba(139,92,246,0.12)",
                            border: "1px solid rgba(139,92,246,0.25)",
                            color: "#a78bfa",
                        }}
                    >
                        <i className="ri-sword-fill" />
                        AniReview
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-1">{modeLabel()}</h1>
                    <p className="text-zinc-500 text-sm">
                        {mode === "login" && "Your anime journey continues here"}
                        {mode === "signup" && "Join the community of anime enthusiasts"}
                        {mode === "forgot" && "We'll send an OTP to your email"}
                        {mode === "forgot-otp" && `OTP sent to ${form.forgotEmail}`}
                        {mode === "forgot-newpass" && "Choose a strong new password"}
                        {otpMode && `OTP sent to ${form.email}`}
                    </p>
                </div>

                {/* OAuth Buttons */}
                {showOAuth && (
                    <div className="space-y-3 mb-6">
                        <button
                            onClick={() => handleOAuth("google")}
                            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl font-medium text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                            style={{
                                background: "rgba(255,255,255,0.05)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                color: "#e4e4e7",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.09)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                        >
                            {/* Google "G" icon via SVG */}
                            <svg width="18" height="18" viewBox="0 0 18 18">
                                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
                                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
                                <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/>
                                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"/>
                            </svg>
                            Continue with Google
                        </button>

                        <button
                            onClick={() => handleOAuth("discord")}
                            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl font-medium text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                            style={{
                                background: "rgba(88,101,242,0.12)",
                                border: "1px solid rgba(88,101,242,0.3)",
                                color: "#e4e4e7",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(88,101,242,0.22)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(88,101,242,0.12)")}
                        >
                            {/* Discord logo SVG */}
                            <svg width="20" height="15" viewBox="0 0 20 15" fill="#5865F2">
                                <path d="M16.93 1.24A16.4 16.4 0 0 0 12.86 0c-.18.33-.4.77-.54 1.12a15.24 15.24 0 0 0-4.63 0C7.54.77 7.31.33 7.13 0A16.35 16.35 0 0 0 3.06 1.25C.44 5.2-.27 9.05.08 12.84a16.62 16.62 0 0 0 5.06 2.57c.41-.56.77-1.15 1.08-1.78a10.72 10.72 0 0 1-1.7-.82c.14-.1.28-.21.42-.32a11.84 11.84 0 0 0 10.12 0c.14.11.28.22.42.32-.54.32-1.12.6-1.71.83.31.63.67 1.22 1.08 1.78a16.56 16.56 0 0 0 5.07-2.58c.42-4.37-.71-8.17-2.99-11.6zM6.68 10.5c-1 0-1.82-.93-1.82-2.07 0-1.13.8-2.07 1.82-2.07 1.01 0 1.84.94 1.82 2.07 0 1.14-.81 2.07-1.82 2.07zm6.64 0c-1 0-1.82-.93-1.82-2.07 0-1.13.8-2.07 1.82-2.07 1.01 0 1.84.94 1.82 2.07 0 1.14-.8 2.07-1.82 2.07z"/>
                            </svg>
                            Continue with Discord
                        </button>

                        {/* Divider */}
                        <div className="flex items-center gap-3 mt-1">
                            <div className="flex-1 h-px bg-zinc-800" />
                            <span className="text-xs text-zinc-600 font-medium">or with email</span>
                            <div className="flex-1 h-px bg-zinc-800" />
                        </div>
                    </div>
                )}

                {/* ── FORMS ──────────────────────────────────────────────── */}
                <form autoComplete="off" className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                    <input type="text" name="fakeuser" style={{ display: "none" }} />
                    <input type="password" name="fakepass" style={{ display: "none" }} />

                    {/* ── Registration OTP boxes ─────────────────────── */}
                    {otpMode && (
                        <div className="space-y-4">
                            <p className="text-center text-zinc-400 text-sm">Enter the 6-digit code sent to your email</p>
                            <OtpBoxes value={otp} onChange={setOtp} />
                        </div>
                    )}

                    {/* ── Sign-up fields ─────────────────────────────── */}
                    {!otpMode && mode === "signup" && (
                        <InputField icon="ri-user-line" name="username" autoComplete="off" value={form.username} onChange={set("username")} placeholder="Username" />
                    )}

                    {/* ── Login / Signup email + password ─────────────── */}
                    {!otpMode && (mode === "login" || mode === "signup") && (
                        <>
                            <InputField icon="ri-mail-line" name="email" type="email" autoComplete="off" value={form.email} onChange={set("email")} placeholder="Email address" />
                            <InputField icon="ri-lock-line" name="password" type="password" autoComplete="new-password" value={form.password} onChange={set("password")} placeholder="Password" />
                            {mode === "signup" && (
                                <InputField icon="ri-lock-2-line" name="confirmPassword" type="password" autoComplete="new-password" value={form.confirmPassword} onChange={set("confirmPassword")} placeholder="Confirm password" />
                            )}
                        </>
                    )}

                    {/* ── Forgot — email step ──────────────────────────── */}
                    {mode === "forgot" && (
                        <InputField icon="ri-mail-line" name="forgotEmail" type="email" autoComplete="off" value={form.forgotEmail} onChange={set("forgotEmail")} placeholder="Your account email" />
                    )}

                    {/* ── Forgot — OTP step ────────────────────────────── */}
                    {mode === "forgot-otp" && (
                        <div className="space-y-4">
                            <p className="text-center text-zinc-400 text-sm">Enter the 6-digit reset code</p>
                            <OtpBoxes value={otp} onChange={setOtp} />
                        </div>
                    )}

                    {/* ── Forgot — new password step ───────────────────── */}
                    {mode === "forgot-newpass" && (
                        <>
                            <InputField icon="ri-lock-line" name="newPassword" type="password" autoComplete="new-password" value={form.newPassword} onChange={set("newPassword")} placeholder="New password (min 6 chars)" />
                            <InputField icon="ri-lock-2-line" name="confirmNewPassword" type="password" autoComplete="new-password" value={form.confirmNewPassword} onChange={set("confirmNewPassword")} placeholder="Confirm new password" />
                        </>
                    )}

                    {/* Error / Success */}
                    {error && (
                        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
                            <i className="ri-error-warning-line" />
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2.5">
                            <i className="ri-checkbox-circle-line" />
                            {success}
                        </div>
                    )}

                    {/* Primary action button */}
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                        style={{
                            background: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)",
                            boxShadow: "0 4px 20px rgba(124,58,237,0.35)",
                            color: "#fff",
                        }}
                        onMouseEnter={(e) => { if (!loading) e.currentTarget.style.boxShadow = "0 4px 28px rgba(124,58,237,0.55)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(124,58,237,0.35)"; }}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <i className="ri-loader-4-line animate-spin" />
                                Please wait…
                            </span>
                        ) : btnLabel()}
                    </button>

                    {/* Guest button */}
                    {showGuest && (
                        <button
                            type="button"
                            onClick={handleGuestLogin}
                            className="w-full py-2.5 rounded-xl font-medium text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                            style={{
                                background: "transparent",
                                border: "1px solid rgba(113,113,122,0.35)",
                                color: "#71717a",
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = "#a1a1aa"; e.currentTarget.style.borderColor = "rgba(161,161,170,0.45)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = "#71717a"; e.currentTarget.style.borderColor = "rgba(113,113,122,0.35)"; }}
                        >
                            <i className="ri-ghost-line mr-2" />
                            Continue as Guest
                        </button>
                    )}
                </form>

                {/* ── Footer links ───────────────────────────────────────── */}
                <div className="mt-6 flex flex-col items-center gap-2 text-xs text-zinc-600">
                    {showForgotLink && (
                        <button
                            onClick={() => setMode("forgot")}
                            className="hover:text-violet-400 transition-colors cursor-pointer"
                        >
                            Forgot password?
                        </button>
                    )}

                    {showModeSwitch && (
                        <button
                            onClick={() => { setOtpMode(false); setMode(mode === "login" ? "signup" : "login"); }}
                            className="hover:text-zinc-400 transition-colors cursor-pointer"
                        >
                            {mode === "login" ? "Don't have an account? Sign up" : "Already have an account? Log in"}
                        </button>
                    )}

                    {showBackToLogin && (
                        <button
                            onClick={() => { setMode("login"); setOtp(""); setResetToken(""); }}
                            className="flex items-center gap-1 hover:text-zinc-400 transition-colors cursor-pointer"
                        >
                            <i className="ri-arrow-left-line" />
                            Back to login
                        </button>
                    )}

                    {otpMode && (
                        <button
                            onClick={() => setOtpMode(false)}
                            className="flex items-center gap-1 hover:text-zinc-400 transition-colors cursor-pointer"
                        >
                            <i className="ri-arrow-left-line" />
                            Back
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
