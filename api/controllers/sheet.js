const router = require("express").Router();
const { sheet: Sheet } = require("../models");

// url: /api/sheet/:ownerId
router.get("/:ownerId", (req, res) => {
	const { ownerId } = req.params;
	if (ownerId !== req.user.id) {
		res.status(401).json({ error: "User does not have access" });
	}
	Sheet.findAll({
		where: {
			ownerId: ownerId,
		},
	})
		.then((sheets) => {
			res.status(200).json({ sheets: sheets });
		})
		.catch((err) => {
			console.log(err);
			res.status(400).json(err);
		});
});

// url: /api/sheet/
router.post("/", (req, res) => {
	if (req.user.id) {
		let { sheetName } = req.body;
		console.log(sheetName);
		Sheet.create({ ownerId: req.user.id, sheetName: sheetName })
			.then((newSheet) => {
				res.status(201).json(newSheet);
			})
			.catch((err) => {
				res.status(400).json(err);
			});
	}
});

// url: /api/sheet/:id
router.delete("/:id", (req, res) => {
	const { id } = req.params;
	Sheet.findOne({ where: { id: id } })
		.then((sheet) => {
			if (sheet.ownerId === req.user.id) {
				sheet.destroy();
				res.sendStatus(201);
			} else {
				res.status(400).json({
					err: "User does not have access to the sheet",
				});
			}
		})
		.catch((err) => {
			res.json(err).status(400);
		});
});

module.exports = router;
