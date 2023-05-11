import React from "react";
import "./HomePage.css";
import Safe from "../images/safe.png";

export default function HomePage() {
	return (
		<div className="home-page">
			<div className="home-content">
				<h1 className="home-title">Budge-It</h1>
				<img className="safe-image" src={Safe} />
				<p className="home-description">
					Start budging your spending habits and saving with Budge-It!
				</p>
			</div>
		</div>
	);
}
