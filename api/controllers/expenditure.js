const router = require("express").Router();
const { expenditure: Expenditure, budget: Budget } = require("../models");
const { Sequelize, Op } = require("sequelize");
const expenditure = require("../models/expenditure");
const budget = require("../models/budget");

// url: /api/expenditure/:id
router.get("/:id", (req, res) => {
	const { id } = req.params;

	// find the expenditure with the id
	Expenditure.findOne({
		where: { id: id },
	})
		.then((expenditure) => {
			const budgetId = expenditure.budgetId;
			//find the budget that the expenditure belongs to
			Budget.findOne({
				where: { id: budgetId },
			}).then((budget) => {
				// if the user is the owner, return the expenditure
				// else return an error
				if (budget.ownerId === req.user.id) {
					res.status(200).json(expenditure);
				} else {
					res.status(400).json({
						err: "User does not have access to the expenditure",
					});
				}
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(400).json(err);
		});
});

// url: /api/expenditure/budget/:budgetId
router.get("/budget/:budgetId", (req, res) => {
	const { budgetId } = req.params;
	Budget.findOne({
		where: {
			id: budgetId,
		},
	})
		.then((budget) => {
			if (Number(budget.ownerId) === req.user.id) {
				Expenditure.findAll({
					where: {
						budgetId: budgetId,
					},
					order: [["date", "ASC"]],
				}).then((expenditures) => {
					res.status(200).json(expenditures);
				});
			} else {
				res.status(400).json({
					budget: budget.ownerId,
					userId: req.user.id,
					err: "User does not have access to the expenditure",
				});
			}
		})
		.catch((err) => {
			console.log(err);
			res.status(400).json(err);
		});
});

// url: /api/expenditure/:budgetId/:year
router.get(":budgetId/:year", (req, res) => {
	const { budgetId, year } = req.params;
	Budget.findOne({
		where: {
			id: budgetId,
		},
	})
		.then((budget) => {
			if (budget.ownerId === req.user.id) {
				Expenditure.findAll({
					where: Sequelize.where(
						Sequelize.fn("YEAR", Sequelize.col("date")),
						year
					),
					order: [["date", "ASC"]],
				}).then((expenditures) => {
					res.status(200).json(expenditures);
				});
			} else {
				res.status(400).json({
					err: "User does not have access to the expenditure",
				});
			}
		})
		.catch((err) => {
			console.log(err);
			res.status(400).json(err);
		});
});

// url: /api/expenditure/
router.post("/:budgetId", (req, res) => {
	const { budgetId } = req.params;
	const data = req.body;

	Budget.findOne({ where: { id: budgetId } }).then((budget) => {
		if (budget.ownerId == req.user.id) {
			Expenditure.create(data).then((newExpenditure) => {
				res.status(200);
			});
		} else {
			res.status(400).json({
				err: "User does not have access to the expenditure",
			});
		}
	});
});

// url: /api/expenditure/
router.put("/:id", (req, res) => {
	const { id } = req.params;
	const data = req.body;

	Expenditure.findOne({
		where: { id: id },
	})
		.then((expenditure) => {
			const budgetId = expenditure.budgetId;
			//find the budget that the expenditure belongs to
			Budget.findOne({
				where: { id: budgetId },
			}).then((budget) => {
				// if the user is the owner, return the expenditure
				// else return an error
				if (budget.ownerId == req.user.id) {
					expenditure.amount = data.amount;
					expenditure.category = data.category;
					expenditure.date = data.date;
					expenditure.description = data.description;
					expenditure.save();
					res.sendStatus(200);
				} else {
					res.status(400).json({
						err: "User does not have access to the expenditure",
					});
				}
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(400).json(err);
		});
});

// url: /api/expenditure/:id
router.delete("/:id", (req, res) => {
	const { id } = req.params;

	// find the expenditure with the id
	Expenditure.findOne({
		where: { id: id },
	})
		.then((expenditure) => {
			const budgetId = expenditure.budgetId;
			//find the budget that the expenditure belongs to
			Budget.findOne({
				where: { id: budgetId },
			}).then((budget) => {
				// if the user is the owner, return the expenditure
				// else return an error
				if (budget.ownerId == req.user.id) {
					expenditure.destroy();
					res.sendStatus(204);
				} else {
					res.status(400).json({
						err: "User does not have access to the expenditure",
					});
				}
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(400).json(err);
		});
});

module.exports = router;
