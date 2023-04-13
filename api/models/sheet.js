const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Sheet extends Model {}
	Sheet.init(
		{
			ownerId: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: "sheet",
		}
	);

	Sheet.associate = (models) => {};
	return Sheet;
};
