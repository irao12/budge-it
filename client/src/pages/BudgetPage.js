import React, { useEffect, useState } from "react";
import "./BudgetPage.css";
import Modal from "../components/Modal";
import { useParams } from "react-router-dom";
import AddExpenditureWindow from "../components/AddExpenditureWindow";
import ExpenditureInfoWindow from "../components/ExpenditureInfoWindow";
import {
	separateExpendituresByDay,
	separateExpendituresByWeek,
	separateExpendituresByMonth,
} from "../util/filterFunctions.js";
import ExpenditureBox from "../components/ExpenditureBox";
import SummaryWindow from "../components/SummaryWindow";

export default function BudgetPage() {
	const [showModal, setShowModal] = useState(false);
	const [showExpenditure, setShowExpenditure] = useState(false);
	const [showSummary, setShowSummary] = useState(false);

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
				} else if (filter === "year") {
					setExpenditures(separateExpendituresByMonth(res));
				}
			});
		});
	};

	const getTotal = (expenditures) => {
		let total = 0;
		expenditures.forEach((expenditure) => {
			total += Number(expenditure.amount);
		});
		return total;
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
						getExpenditures={getExpenditures}
					/>
				</Modal>
			)}
			{showSummary && (
				<Modal>
					<SummaryWindow
						setShowSummary={setShowSummary}
						filter={filter}
						expenditures={expenditures}
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
						<button
							className="budget-summary-button"
							onClick={() => {
								setShowSummary(true);
							}}
						>
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
							{expenditures.map((group, index) => {
								const group_index = index;
								const total = getTotal(group.expenditures);

								return (
									<>
										<div
											key={`group-${index}`}
											className="budget-group"
										>
											<h3 className="expenditure-group-heading">
												{group.name}
											</h3>
											<div className="group-info">
												<div className="group-expenditures">
													{group.expenditures.map(
														(
															expenditure,
															index
														) => {
															return (
																<ExpenditureBox
																	key={`group-${group_index}-box-${index}`}
																	expenditure={
																		expenditure
																	}
																	setCurrExpenditure={
																		setCurrExpenditure
																	}
																	setShowExpenditure={
																		setShowExpenditure
																	}
																	formatter={
																		formatter
																	}
																/>
															);
														}
													)}
												</div>
												<h2 className="total">
													Total: <br />
													{formatter.format(total)}
												</h2>
											</div>
										</div>
									</>
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
