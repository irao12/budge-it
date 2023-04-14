const router = require("express").Router();
const { expenditure: Expenditure, sheet: Sheet } = require("../models");
const { Sequelize, Op } = require("sequelize");
const expenditure = require("../models/expenditure");

// url: /api/expenditure/:id
router.get("/:id", (req, res) => {
	const { id } = req.params;

	// find the expenditure with the id
	Expenditure.findOne({
		where: { id: id },
	})
		.then((expenditure) => {
			const sheetId = expenditure.sheetId;
			//find the sheet that the expenditure belongs to
			Sheet.findOne({
				where: { id: sheetId },
			}).then((sheet) => {
				// if the user is the owner, return the expenditure
				// else return an error
				if (sheet.ownerId === req.user.id) {
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

// url: /api/expenditure/:sheetid
router.get(":sheetId/", (req, res) => {
	const { sheetId } = req.params;

	Sheet.findOne({
		where: {
			id: sheetId,
		},
	})
		.then((sheet) => {
			if (sheet.ownerId === req.user.id) {
				Expenditure.findAll({
					where: {
						sheetId: sheetId,
					},
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

// url: /api/expenditure/:sheetid/:category
router.get(":sheetId/:category", (req, res) => {
	const { sheetId, category } = req.params;
	Sheet.findOne({
		where: {
			id: sheetId,
		},
	})
		.then((sheet) => {
			if (sheet.ownerId === req.user.id) {
				Expenditure.findAll({
					where: {
						sheetId: sheetId,
						category: category,
					},
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

// url: /api/expenditure/:sheetid/:month
router.get(":sheetId/:year/:month", (req, res) => {
	const { sheetId, month, year } = req.params;
	Sheet.findOne({
		where: {
			id: sheetId,
		},
	})
		.then((sheet) => {
			if (sheet.ownerId === req.user.id) {
				Expenditure.findAll({
					where: {
						[Op.and]: [
							Sequelize.where(
								Sequelize.fn("MONTH", Sequelize.col("date")),
								month
							),
							Sequelize.where(
								Sequelize.fn("YEAR", Sequelize.col("date")),
								year
							),
						],
					},
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

// url: /api/expenditure/:sheetid/:year
router.get(":sheetId/:year", (req, res) => {
	const { sheetId, year } = req.params;
	Sheet.findOne({
		where: {
			id: sheetId,
		},
	})
		.then((sheet) => {
			if (sheet.ownerId === req.user.id) {
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

// url: /api/expenditure/:sheetid/
router.post(":sheetId/", (req, res) => {
	const { sheetId } = req.params;
	const data = { amount: req.body.amount };

	if (req.body.category) {
		data.category = req.body.category;
	}
	if (req.body.date) {
		data.date = req.body.date;
	}

	Sheet.findOne({ where: { sheetId: sheetId } }).then((sheet) => {
		if ((sheet.ownerId = req.user.id)) {
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

// url: /api/expenditure/:id
router.delete("/:id", (req, res) => {
	const { id } = req.params;

	// find the expenditure with the id
	Expenditure.findOne({
		where: { id: id },
	})
		.then((expenditure) => {
			const sheetId = expenditure.sheetId;
			//find the sheet that the expenditure belongs to
			Sheet.findOne({
				where: { id: sheetId },
			}).then((sheet) => {
				// if the user is the owner, return the expenditure
				// else return an error
				if (sheet.ownerId === req.user.id) {
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
