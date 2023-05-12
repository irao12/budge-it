import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function NavLinks({ showMenu }) {
	const auth = useContext(AuthContext);
	const navigate = useNavigate();
	return (
		<div className={showMenu ? "nav-links active" : "nav-links"}>
			<Link to="/">Home</Link>
			{auth.isAuthenticated ? (
				<Link to="budgets">Budgets</Link>
			) : (
				<Link to="login">Log In</Link>
			)}
			{auth.isAuthenticated && (
				<div
					className="log-out-button"
					onClick={() => {
						auth.signout();
						navigate("/login");
					}}
				>
					Log Out
				</div>
			)}
		</div>
	);
}
