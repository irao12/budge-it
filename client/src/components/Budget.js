import React from "react";
import "./Budget.css";
import { useNavigate } from "react-router-dom";

export default function Budget({ budget }) {
	const navigate = useNavigate();

	return (
		<div
			onClick={() => {
				navigate(`/budgets/${budget.id}`);
			}}
			className="budget-container"
		>
			<div className="budget-content">
				<h3 className="budget-name">{budget.name}</h3>
				{budget.description && (
					<p className="budget-desc">{`Description: ${budget.description}`}</p>
				)}
			</div>
		</div>
	);
}
