import React from "react";
import { useNavigate } from "react-router-dom";

export default function NotAuthenticatedPage() {
	const navigate = useNavigate();
	return (
		<div className="not-authenticated-page">
			<div className="authentication-msg">
				<h1>You need an account in order to access this page!</h1>
				<button
					type="button"
					className="log-in-button"
					onClick={() => {
						navigate("/login");
					}}
				>
					LOG IN
				</button>
			</div>
		</div>
	);
}
