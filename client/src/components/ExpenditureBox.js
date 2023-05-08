import React, { useState } from "react";
import "./ExpenditureBox.css";
import Modal from "./Modal";

export default function ExpenditureBox({
	expenditure,
	formatter,
	setCurrExpenditure,
	setShowExpenditure,
}) {
	return (
		<>
			<div
				className="expenditure-box"
				onClick={() => {
					setCurrExpenditure(expenditure);
					setShowExpenditure(true);
				}}
			>
				{formatter.format(expenditure.amount)}
			</div>
		</>
	);
}
