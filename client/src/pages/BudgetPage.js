import React, { useEffect, useState } from "react";
import "./BudgetPage.css";
import Modal from "../components/Modal";
import { useParams } from "react-router-dom";
import AddExpenditureWindow from "../components/AddExpenditureWindow";
import ExpenditureInfoWindow from "../components/ExpenditureInfoWindow";
import { isThisWeek, getDay } from "date-fns";
import ExpenditureBox from "../components/ExpenditureBox";

export default function BudgetPage() {
	const [showModal, setShowModal] = useState(false);
	const [showExpenditure, setShowExpenditure] = useState(false);
	const [currExpenditure, setCurrExpenditure] = useState({});
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
			const currDay = getDay(
				new Date(expenditure.date.replace(/-/g, "/"))
			);
			if (currDay === 0) {
				weekSummary[6].expenditures.push(expenditure);
			} else {
				weekSummary[currDay - 1].expenditures.push(expenditure);
			}
		});

		return weekSummary;
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
				res = res.filter((expenditure) => {
					const currDate = new Date(expenditure.date);
					return isThisWeek(currDate, { weekStartsOn: 0 });
				});
				setExpenditures(separateExpendituresByDay(res));
			});
		});
	};
	console.log(expenditures);
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
				<h1 className="budget-page-name">{budget.name}</h1>
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
