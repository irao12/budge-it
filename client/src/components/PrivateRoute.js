import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import NotAuthenticatedPage from "../pages/NotAuthenticatedPage";

export default function PrivateRoute({ children }) {
	const auth = useContext(AuthContext);

	if (!auth.isAuthenticated) {
		return <NotAuthenticatedPage />;
	}

	return children;
}
