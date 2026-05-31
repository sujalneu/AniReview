import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
	const token = localStorage.getItem("token");
	const isGuest = localStorage.getItem("isGuest") === "true";

	if (!token && !isGuest) {
		return <Navigate to="/auth" />;
	}

	return children;
}
