import React, { useState } from "react";
import "./BudgetPage.css";
import Modal from "../components/Modal";
import { useParams } from "react-router-dom";
import CloseMenu from "../images/close-black.svg";

export default function BudgetPage() {
	const [dailySpendings, setDailySpendings] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const { id } = useParams();
	const categories = [
		"",
		"entertainment",
		"bills",
		"food",
		"groceries",
		"other",
	];

	const AddExpenditureWindow = () => {
		const [otherInput, setOtherInput] = useState("");
		const [expenditureInfo, setExpenditureInfo] = useState({
			amount: "",
			category: "",
			date: "",
		});

		const updateValue = (e) => {
			if (e.target.name === "amount") {
				if (isNaN(e.target.value)) return;
				const decimalIndex = e.target.value.indexOf(".");
				if (
					decimalIndex !== -1 &&
					decimalIndex < e.target.value.length - 3
				) {
					return;
				}
			}
			setExpenditureInfo({
				...expenditureInfo,
				[e.target.name]: e.target.value,
			});
		};

		const validateInput = () => {
			if (
				expenditureInfo.amount.trim() === "" ||
				expenditureInfo.category.trim() === "" ||
				expenditureInfo.date.trim() === ""
			) {
				return false;
			}
			return true;
		};

		const addExpenditure = () => {
			if (!validateInput()) return;

			const body = {
				budgetId: id,
				...expenditureInfo,
			};
			console.log(body);
			fetch(`/api/expenditure/${id}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			}).then((response) => {
				if (response.ok) {
				} else {
					response.json().then((result) => {
						console.log(result.err);
					});
					alert("There was an error creating the expenditure");
				}
			});
			setShowModal(false);
		};

		return (
			<div className="add-expenditure-window">
				<div className="add-expenditure-content">
					<button
						className="close-add-expenditure-button"
						onClick={() => {
							setShowModal(false);
						}}
					>
						<img src={CloseMenu}></img>
					</button>
					<h2 className="add-expenditure-heading">Add Expenditure</h2>
					<div className="add-expenditure-field">
						<label htmlFor="amount" className="input-label">
							Amount ($):
						</label>
						<input
							id="amount"
							value={expenditureInfo.amount}
							name="amount"
							onChange={(e) => {
								updateValue(e);
							}}
							placeholder="$ 0.00"
						></input>
					</div>
					<div className="add-expenditure-field">
						<label htmlFor="category" className="input-label">
							Category:
						</label>
						<select
							name="category"
							value={expenditureInfo.category}
							onChange={updateValue}
						>
							{categories.map((category) => (
								<option value={category}>
									{category !== ""
										? category[0].toUpperCase() +
										  category.slice(1)
										: ""}
								</option>
							))}
						</select>
						{expenditureInfo.category === "other" && (
							<input
								value={otherInput}
								onChange={(e) => {
									setOtherInput(e.target.value);
								}}
							></input>
						)}
					</div>
					<div className="add-expenditure-field">
						<label htmlFor="amount" className="input-label">
							Date:
						</label>
						<input
							id="date"
							value={expenditureInfo.date}
							name="date"
							type="date"
							onChange={(e) => {
								updateValue(e);
							}}
						></input>
					</div>
					<button
						className="post-expenditure-button"
						onClick={addExpenditure}
					>
						Add Expenditure
					</button>
				</div>
			</div>
		);
	};

	return (
		<div className="budget-page">
			{showModal && (
				<Modal>
					<AddExpenditureWindow />
				</Modal>
			)}
			<div className="budget-page-content">
				<div className="budget-page-side">
					<button>Show Summary</button>
				</div>
				<div className="budget-page-details">
					<div className="budget-expenditures"></div>
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
