import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
	const auth = useContext(AuthContext);
	const navigate = useNavigate();
	return (
		<nav>
			<div className="logo">Budge-It</div>
			<ul className="nav-links">
				<li>
					<Link to="home">Home</Link>
				</li>
				<li>
					{auth.isAuthenticated ? (
						<Link to="account">Account</Link>
					) : (
						<Link to="login">Log In</Link>
					)}
				</li>
				<li>
					{auth.isAuthenticated && (
						<div
							onClick={() => {
								auth.signout();
								navigate("/");
							}}
						>
							Log Out
						</div>
					)}
				</li>
			</ul>
		</nav>
	);
}
