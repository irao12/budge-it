import React, { useState } from "react";
import "./BudgetsPage.css";

export default function BudgetsPage() {
	const budgets = useState([]);

	return (
		<div className="budgets-page">
			<div className="budgets-content">
				<h1 className="budgets-heading">Budgets</h1>
				<div className="budgets-list"></div>
			</div>
			<button
				className="create-budget-button"
				aria-label="Create a new budget"
			>
				Create Budget
			</button>
		</div>
	);
}
