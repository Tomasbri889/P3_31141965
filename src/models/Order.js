const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
  class Order extends Model {}

  Order.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Order",
      tableName: "orders",
    }
  );

return Order;
};
