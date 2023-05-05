const router = require("express").Router();
const { budget: Budget } = require("../models");

// url: /api/budget/owner/:ownerId
router.get("/owner/:ownerId", (req, res) => {
	const { ownerId } = req.params;

	if (ownerId != req.user.id) {
		res.status(401).json({ error: "User does not have access" });
	} else {
		Budget.findAll({
			where: {
				ownerId: ownerId,
			},
		})
			.then((budgets) => {
				res.status(200).json({ budgets: budgets });
			})
			.catch((err) => {
				console.log(err);
				res.status(400).json(err);
			});
	}
});

// url: /api/budget/:id
router.get("/:id", (req, res) => {
	const { id } = req.params;
	Budget.findOne({ where: { id: id } })
		.then((budget) => {
			if (Number(budget.ownerId) == req.user.id) {
				res.json({ budget }).status(200);
			} else {
				res.status(400).json({
					err: "User does not have access to the budget",
				});
			}
		})
		.catch((err) => {
			res.json(err).status(400);
		});
});

// url: /api/budget/
router.post("/", (req, res) => {
	if (req.user.id) {
		let { name, desc } = req.body;
		Budget.create({
			ownerId: req.user.id,
			name: name,
			description: desc,
		})
			.then((newBudget) => {
				res.status(201).json(newBudget);
			})
			.catch((err) => {
				res.status(400).json(err);
				console.log(err);
			});
	}
});

// url: /api/budget/:id
router.delete("/:id", (req, res) => {
	const { id } = req.params;
	Budget.findOne({ where: { id: id } })
		.then((budget) => {
			if (budget.ownerId === req.user.id) {
				budget.destroy();
				res.sendStatus(201);
			} else {
				res.status(400).json({
					err: "User does not have access to the budget",
				});
			}
		})
		.catch((err) => {
			res.json(err).status(400);
		});
});

module.exports = router;
