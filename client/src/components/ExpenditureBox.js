import React from "react";
import "./ExpenditureBox.css";

export default function ExpenditureBox({ expenditure, formatter }) {
	return (
		<div className="expenditure-box">
			{formatter.format(expenditure.amount)}
		</div>
	);
}
