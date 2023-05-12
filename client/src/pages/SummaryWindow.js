import React, { useEffect, useRef, useState } from "react";
import CloseMenu from "../images/close-black.svg";
import "./SummaryWindow.css";
export default function SummaryWindow({
	setShowSummary,
	expenditures,
	filter,
}) {
	const svgRef = useRef();
	const getAllExpenditures = () => {};
	const [summary, setSummary] = useState("");

	const formatter = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	});

	useEffect(() => {
		let currExpenditures = [];
		expenditures.forEach((expenditure) => {
			if (expenditure.expenditures.length > 0) {
				currExpenditures = currExpenditures.concat(
					expenditure.expenditures
				);
			}
		});

		const categorySummary = {};
		let totalSpent = 0;
		currExpenditures.forEach((expenditure) => {
			totalSpent += Number(expenditure.amount) * 100;
			if (categorySummary[expenditure.category]) {
				categorySummary[expenditure.category] =
					categorySummary[expenditure.category] +
					Number(expenditure.amount) * 100;
			} else {
				categorySummary[expenditure.category] = Number(
					expenditure.amount * 100
				);
			}
		});
		totalSpent = totalSpent / 100;

		const categories = Object.keys(categorySummary);
		let summaryString = `This ${filter}, you spent a total of ${formatter.format(
			totalSpent
		)}\n`;
		const summaryText = (
			<div className="summary-text">
				<p>
					This {filter}, you spent a total of{" "}
					<span className="highlighted">
						{formatter.format(totalSpent)}
					</span>
				</p>

				{categories.map((category) => {
					const amount = formatter.format(
						categorySummary[category] / 100
					);
					return (
						<p>
							You spent{" "}
							<span className="highlighted">{amount}</span> on
							expenditures with the{" "}
							<span className="highlighted">{category}</span>{" "}
							category{" "}
							<span className="highlighted">
								(
								{(
									categorySummary[category] / totalSpent
								).toFixed(2)}
								%)
							</span>
						</p>
					);
				})}
			</div>
		);

		setSummary(summaryText);
	}, []);

	return (
		<div className="summary-window">
			<div className="summary-content">
				<button
					className="close-add-expenditure-button"
					onClick={() => {
						setShowSummary(false);
					}}
				>
					<img src={CloseMenu} alt="close-button"></img>
				</button>
				<h1>{`Summary for this ${filter}`}</h1>
				<p className="summary-text">{summary}</p>
			</div>
		</div>
	);
}
