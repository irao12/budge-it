import React, { useEffect, useState } from "react";
import "./BudgetPage.css";
import Modal from "../components/Modal";
import { useParams } from "react-router-dom";
import AddExpenditureWindow from "../components/AddExpenditureWindow";
import ExpenditureInfoWindow from "../components/ExpenditureInfoWindow";
import {
	isThisWeek,
	isThisMonth,
	getWeekOfMonth,
	getWeeksInMonth,
	isThisYear,
	getMonth,
	getDay,
} from "date-fns";
import ExpenditureBox from "../components/ExpenditureBox";

export default function BudgetPage() {
	const [showModal, setShowModal] = useState(false);
	const [showExpenditure, setShowExpenditure] = useState(false);
	const [currExpenditure, setCurrExpenditure] = useState({});
	const [filter, setFilter] = useState("week");
	const [allExpenditures, setAllExpenditures] = useState([]);
	const [expenditures, setExpenditures] = useState([]);
	const [budget, setBudget] = useState({});
	const { id } = useParams();
	const formatter = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	});
	const categories = [
		"",
		"entertainment",
		"bills",
		"food",
		"groceries",
		"other",
	];

	useEffect(() => {
		getBudget();
		getExpenditures();
	}, []);

	const getBudget = () => {
		fetch(`/api/budget/${id}`).then((response) => {
			if (!response.ok) {
				response.json().then((error) => {
					alert(error.err);
				});
				return;
			}
			response.json().then((response) => {
				setBudget(response.budget);
			});
		});
	};

	const separateExpendituresByDay = (expenditures) => {
		const daysOfWeek = {
			0: "Monday",
			1: "Tuesday",
			2: "Wednesday",
			3: "Thursday",
			4: "Friday",
			5: "Saturday",
			6: "Sunday",
		};
		const weekSummary = [];
		for (let i = 0; i < 7; i++) {
			weekSummary.push({ name: daysOfWeek[i], expenditures: [] });
		}
		expenditures.forEach((expenditure) => {
			const currDate = new Date(expenditure.date.replace(/-/g, "/"));
			if (!isThisWeek(currDate)) return;
			const currDay = getDay(currDate);
			if (currDay === 0) {
				weekSummary[6].expenditures.push(expenditure);
			} else {
				weekSummary[currDay - 1].expenditures.push(expenditure);
			}
		});

		return weekSummary;
	};

	const separateExpendituresByWeek = (expenditures) => {
		const num_weeks = getWeeksInMonth(new Date());
		const monthSummary = [];
		for (let i = 0; i < num_weeks; i++) {
			monthSummary.push({ name: `Week ${i + 1}`, expenditures: [] });
		}
		expenditures.forEach((expenditure) => {
			const currDate = new Date(expenditure.date.replace(/-/g, "/"));
			if (!isThisMonth(currDate)) return;
			const currWeek = getWeekOfMonth(currDate);
			if (currWeek === 0) {
				monthSummary[num_weeks - 1].expenditures.push(expenditure);
			}
			monthSummary[currWeek - 1].expenditures.push(expenditure);
		});
		return monthSummary;
	};

	const separateExpendituresByMonth = (expenditures) => {
		const monthOfYear = {
			0: "January",
			1: "February",
			2: "March",
			3: "April",
			4: "May",
			5: "June",
			6: "July",
			7: "August",
			8: "September",
			9: "October",
			10: "November",
			11: "December",
		};
		const yearSummary = [];
		for (let i = 0; i < 12; i++) {
			yearSummary.push({ name: monthOfYear[i], expenditures: [] });
		}

		expenditures.forEach((expenditure) => {
			const currDate = new Date(expenditure.date.replace(/-/g, "/"));
			if (!isThisYear(currDate)) return;
			const currMonth = getMonth(currDate);
			if (currMonth === 0) {
				yearSummary[0].expenditures.push(expenditure);
			}
			yearSummary[currMonth].expenditures.push(expenditure);
		});
		console.log(yearSummary);
		return yearSummary;
	};

	const filterExpenditures = (filter) => {
		if (filter === "week") {
			setExpenditures(separateExpendituresByDay(allExpenditures));
		} else if (filter === "month") {
			setExpenditures(separateExpendituresByWeek(allExpenditures));
		} else if (filter === "year") {
			setExpenditures(separateExpendituresByMonth(allExpenditures));
		}
	};

	const getExpenditures = () => {
		if (isNaN(id)) {
			return;
		}
		fetch(`/api/expenditure/budget/${id}`).then((response) => {
			if (!response.ok) {
				response.json().then((error) => {
					alert(error.err);
				});

				return;
			}
			response.json().then((res) => {
				setAllExpenditures(res);
				if (filter === "week") {
					setExpenditures(separateExpendituresByDay(res));
				} else if (filter === "month") {
					setExpenditures(separateExpendituresByWeek(res));
				}
			});
		});
	};

	return (
		<div className="budget-page">
			{showModal && (
				<Modal>
					<AddExpenditureWindow
						setShowModal={setShowModal}
						id={id}
						categories={categories}
						getExpenditures={getExpenditures}
					/>
				</Modal>
			)}
			{showExpenditure && (
				<Modal>
					<ExpenditureInfoWindow
						expenditure={currExpenditure}
						setShowExpenditure={setShowExpenditure}
						categories={categories}
					/>
				</Modal>
			)}
			<div className="budget-page-content">
				<div className="budget-page-top">
					<h1 className="budget-page-name">{budget.name}</h1>
					<select
						name="category"
						value={filter}
						onChange={(e) => {
							if (filter !== e.target.value) {
								filterExpenditures(e.target.value);
							}
							setFilter(e.target.value);
						}}
					>
						<option value="week">This Week</option>
						<option value="month">This Month</option>
						<option value="year">This Year</option>
					</select>
				</div>

				<div className="budget-page-info">
					<div className="budget-page-side">
						<button className="budget-summary-button">
							Show Summary
						</button>
						<AddExpenditureWindow
							setShowModal={setShowModal}
							id={id}
							categories={categories}
							getExpenditures={getExpenditures}
						/>
					</div>
					<div className="budget-page-details">
						<div className="budget-groups">
							{expenditures.map((group) => {
								return (
									<div className="budget-group">
										<h3 className="expenditure-group-heading">
											{group.name}
										</h3>
										{group.expenditures.map(
											(expenditure) => {
												return (
													<ExpenditureBox
														expenditure={
															expenditure
														}
														setCurrExpenditure={
															setCurrExpenditure
														}
														setShowExpenditure={
															setShowExpenditure
														}
														formatter={formatter}
													/>
												);
											}
										)}
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</div>
			<button
				className="add-expenditure-button"
				aria-label="Create a new expenditure"
				onClick={() => {
					setShowModal(true);
				}}
			>
				+
			</button>
		</div>
	);
}
