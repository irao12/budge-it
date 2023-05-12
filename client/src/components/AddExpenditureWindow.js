import React, { useState } from "react";
import CloseMenu from "../images/close-black.svg";
import "./AddExpenditureWindow.css";

export default function AddExpenditureWindow({
	id,
	setShowModal,
	categories,
	getExpenditures,
}) {
	const [otherInput, setOtherInput] = useState("");
	const [expenditureInfo, setExpenditureInfo] = useState({
		amount: "",
		category: "",
		date: "",
		description: "",
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
		if (e.target.name === "description") {
			if (e.target.value > 50) {
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
		if (expenditureInfo.category === "other") {
			body.category = otherInput;
		}

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
		setTimeout(getExpenditures, 250);
		setExpenditureInfo({
			amount: "",
			category: "",
			date: "",
			description: "",
		});

		console.log("added");
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
					<img src={CloseMenu} alt="close-button"></img>
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
					<label htmlFor="description" className="input-label">
						Description (Max 50 characters):
					</label>
					<input
						id="description"
						value={expenditureInfo.description}
						name="description"
						maxLength={50}
						onChange={(e) => {
							updateValue(e);
						}}
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
						{categories.map((category, index) => (
							<option key={`category-${index}`} value={category}>
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
}
