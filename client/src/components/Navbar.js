import React, { useContext, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import NavLinks from "./NavLinks";
import "./Navbar.css";
import OpenMenu from "../images/menu.svg";
import CloseMenu from "../images/close.svg";

export default function Navbar() {
	const [showMenu, setShowMenu] = useState(false);

	return (
		<>
			<nav className={showMenu ? "active" : ""}>
				<div className="logo">Budge-It</div>
				<NavLinks showMenu={showMenu} />
				<button
					className="menu-button"
					onClick={() => {
						setShowMenu((oldShowMenu) => !oldShowMenu);
					}}
				>
					<img
						className="menu-icon"
						src={showMenu ? CloseMenu : OpenMenu}
						alt="menu button"
					></img>
				</button>
			</nav>
			{showMenu && <NavLinks />}
		</>
	);
}
