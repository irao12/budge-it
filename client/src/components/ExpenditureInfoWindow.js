import React, { useState } from "react";
import CloseMenu from "../images/close-black.svg";
import "./ExpenditureInfoWindow.css";

export default function ExpenditureInfoWindow({
	expenditure,
	setShowExpenditure,
	categories,
	getExpenditures,
}) {
	const [expenditureInfo, setExpenditureInfo] = useState({
		...expenditure,
	});
	const [otherInput, setOtherInput] = useState("");
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

	const deleteExpenditure = () => {
		fetch(`/api/expenditure/${expenditure.id}`, {
			method: "DELETE",
		}).then((response) => {
			if (response.ok) {
				setShowExpenditure(false);
				setTimeout(() => {
					getExpenditures();
				}, 50);
			} else {
				response.json().then((result) => {
					console.log(result.err);
				});
				alert("There was an error deleting the expenditure");
			}
		});
	};

	return (
		<div className="add-expenditure-window">
			<div className="add-expenditure-content">
				<div className="buttons">
					<button
						className="close-add-expenditure-button"
						onClick={() => {
							setShowExpenditure(false);
						}}
					>
						<img src={CloseMenu} alt="close-button"></img>
					</button>
					<button
						className="delete-expenditure-button"
						onClick={deleteExpenditure}
					>
						Delete
					</button>
				</div>

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
			</div>
		</div>
	);
}
