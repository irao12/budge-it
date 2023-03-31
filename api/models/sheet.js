const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Sheet extends Model {}
	Sheet.init(
		{
			ownerId: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			accessIds: {
				type: DataTypes.ARRAY(DataTypes.INTEGER),
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
