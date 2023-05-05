import React, { useEffect, useState } from "react";
import "./BudgetPage.css";
import Modal from "../components/Modal";
import { useParams } from "react-router-dom";
import AddExpenditureWindow from "../components/AddExpenditureWindow";
import { isThisWeek, getDay } from "date-fns";

export default function BudgetPage() {
	const [showModal, setShowModal] = useState(false);
	const [expenditures, setExpenditures] = useState([]);
	const { id } = useParams();
	const categories = [
		"",
		"entertainment",
		"bills",
		"food",
		"groceries",
		"other",
	];

	useEffect(() => {
		getExpenditures();
	}, []);

	const separateExpendituresByDay = (expenditures) => {
		const daysOfWeek = {
			0: "Sunday",
			1: "Monday",
			2: "Tuesday",
			3: "Wednesday",
			4: "Thursday",
			5: "Friday",
			6: "Saturday",
		};
		const weekSummary = [];
		for (let i = 0; i < 7; i++) {
			weekSummary.push({ day: daysOfWeek[i], expenditures: [] });
		}
		expenditures.forEach((expenditure) => {
			const currDay = getDay(new Date(expenditure.date));
			weekSummary[currDay].expenditures.push(expenditure);
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
					return isThisWeek(currDate);
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
			<div className="budget-page-content">
				<h1>Ivan's Budget</h1>
				<div className="budget-page-info">
					<div className="budget-page-side">
						<button>Show Summary</button>
					</div>
					<div className="budget-page-details">
						<div className="budget-groups">
							{expenditures.map((group) => {
								return (
									<div>
										<h3>{group.day}</h3>
										{group.expenditures.map(
											(expenditure) => {
												return (
													<p>{expenditure.amount}</p>
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
