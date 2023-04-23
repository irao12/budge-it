import React from "react";
import "./Budget.css";

export default function Budget({ budget }) {
	return (
		<div className="budget-container">
			<div className="budget-content">
				<h3 className="budget-name">{budget.name}</h3>
				{budget.description && (
					<p className="budget-desc">{`Description: ${budget.description}`}</p>
				)}
			</div>
		</div>
	);
}
