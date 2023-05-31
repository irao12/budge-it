import React, { useEffect, useState } from "react";
import CloseMenu from "../images/close-black.svg";
import PieChart from "./PieChart";
import "./SummaryWindow.css";
import { Pie } from "react-chartjs-2";
export default function SummaryWindow({
	setShowSummary,
	expenditures,
	filter,
}) {
	const [summary, setSummary] = useState("");
	const [data, setData] = useState({});

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

		const summaryText = (
			<div className="summary-text">
				<p>
					This {filter}, you spent a total of{" "}
					<span className="highlighted">
						{formatter.format(totalSpent)}
					</span>
				</p>

				{categories.map((category, index) => {
					const amount = formatter.format(
						categorySummary[category] / 100
					);
					return (
						<p key={`summary-${index}`}>
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
		setData(categorySummary);
	}, []);

	return (
		<div className="summary-window">
			<button
				className="close-add-expenditure-button"
				onClick={() => {
					setShowSummary(false);
				}}
			>
				<img src={CloseMenu} alt="close-button"></img>
			</button>
			<div className="summary-content">
				<h1>{`Summary for this ${filter}`}</h1>
				{summary}
				<div className="summary-pie-chart">
					<h1>Pie Chart</h1>
					<button
						className="reset-colors-button"
						onClick={() => {
							setData({ ...data });
						}}
					>
						Reset Colors
					</button>
					<PieChart categoryData={data} />
				</div>
			</div>
		</div>
	);
}
