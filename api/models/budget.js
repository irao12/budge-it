const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Budget extends Model {}
	Budget.init(
		{
			ownerId: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			description: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: "budget",
		}
	);

	Budget.associate = (models) => {};
	return Budget;
};
