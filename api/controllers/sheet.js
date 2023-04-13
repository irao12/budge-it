const router = require("express").Router();
const { sheet: Sheet } = require("../models");

// url: /api/sheet/:id
router.get("/:id", (req, res) => {
	const { id } = req.params;
	Sheet.findOne({
		where: {
			id: id,
		},
	})
		.then((sheet) => {
			if (sheet.ownerId == req.user.id) {
				res.status(200).json({ sheet: sheet });
			} else {
				res.status(401).json({ error: "User does not have access" });
			}
		})
		.catch((err) => {
			console.log(err);
			res.status(400).json(err);
		});
});

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
