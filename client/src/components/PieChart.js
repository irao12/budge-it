import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Colors } from "chart.js";

import { Pie } from "react-chartjs-2";

export default function PieChart({ categoryData }) {
	ChartJS.register(ArcElement, Tooltip, Legend);
	ChartJS.register(Colors);

	const updatePie = () => {};

	const data = {
		labels: [],
		datasets: [
			{
				label: "Amount Spent ($)",
				data: [],
				borderWidth: 2,
				backgroundColor: [],
				borderColor: "white",
			},
		],
	};

	Object.keys(categoryData).forEach((key) => {
		data.labels.push(key[0].toUpperCase() + key.slice(1));
		data.datasets[0].data.push(categoryData[key] / 100);
		data.datasets[0].backgroundColor.push(
			`#${Math.floor(Math.random() * 16777215).toString(16)}`
		);
	});

	return <Pie data={data} />;
}
