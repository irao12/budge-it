const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Expenditure extends Model {}

	Expenditure.init(
		{
			sheetId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			category: {
				type: DataTypes.STRING,
				defaultValue: "Miscellaneous",
			},
			amount: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0,
			},
			date: {
				type: DataTypes.DATEONLY,
				defaultValue: DataTypes.NOW,
			},
		},
		{
			sequelize,
			modelName: "expenditure",
		}
	);

	Expenditure.associate = (models) => {};

	return Expenditure;
};
