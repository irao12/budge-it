import React, { useContext, useEffect, useState } from "react";
import Modal from "../components/Modal";
import CloseMenu from "../images/close-black.svg";
import "./BudgetsPage.css";
import { AuthContext } from "../context/AuthContext";
import Budget from "../components/Budget";
export default function BudgetsPage() {
	const auth = useContext(AuthContext);
	const [budgets, setBudgets] = useState([]);
	const [showModal, setShowModal] = useState(false);

	useEffect(() => {
		getBudgets();
	}, []);

	const getBudgets = () => {
		fetch(`api/budget/${auth.user.id}`, {
			method: "GET",
		}).then((response) => {
			if (!response.ok) {
				response.json().then((error) => {
					console.log(error.error);
					alert(response.err);
				});

				return;
			}
			response.json().then((res) => {
				setBudgets(res.budgets);
			});
		});
	};

	const CreateBudgetWindow = () => {
		const [budgetInfo, setBudgetInfo] = useState({
			name: "",
			desc: "",
		});

		const updateValue = (e) => {
			setBudgetInfo({
				...budgetInfo,
				[e.target.name]: e.target.value,
			});
		};

		const createBudget = () => {
			if (budgetInfo.name.trim() === "") {
				return;
			}
			const body = {
				name: budgetInfo.name,
				desc: budgetInfo.desc.trim(),
			};
			fetch("/api/budget/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			}).then((response) => {
				if (response.ok) {
					getBudgets();
				} else {
					alert("There was an error creating the budget");
				}
			});
			setShowModal(false);
		};

		return (
			<div className="create-budget-window">
				<div className="create-budget-content">
					<button
						className="close-create-budget-button"
						onClick={() => {
							setShowModal(false);
						}}
					>
						<img src={CloseMenu}></img>
					</button>
					<h2 className="create-budget-heading">Create Budget</h2>
					<div className="create-budget-field">
						<label htmlFor="budget-name" className="input-label">
							Budget Name:
						</label>
						<input
							id="budget-name"
							value={budgetInfo.name}
							name="name"
							onChange={(e) => {
								updateValue(e);
							}}
						></input>
					</div>
					<div className="create-budget-field input-label">
						<label htmlFor="budget-desc">Budget Description:</label>
						<textarea
							id="budget-desc"
							maxLength={125}
							name="desc"
							value={budgetInfo.desc}
							onChange={(e) => {
								updateValue(e);
							}}
						></textarea>
					</div>
					<button
						className="post-budget-button"
						onClick={createBudget}
					>
						Create Budget
					</button>
				</div>
			</div>
		);
	};

	return (
		<div className="budgets-page">
			{showModal && (
				<Modal>
					<CreateBudgetWindow />
				</Modal>
			)}
			<div className="budgets-content">
				<h1 className="budgets-heading">Budgets</h1>
				<div className="budgets-list">
					{budgets.map((budget) => {
						return <Budget id={budget.id} budget={budget} />;
					})}
				</div>
			</div>
			<button
				className="create-budget-button"
				aria-label="Create a new budget"
				onClick={() => {
					setShowModal(true);
				}}
			>
				Create Budget
			</button>
		</div>
	);
}
