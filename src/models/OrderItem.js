const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
  class OrderItem extends Model {}

  OrderItem.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "orders",
          key: "id",
        },
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "products",
          key: "id",
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,

      },

      unitprice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        
      },
    },
    {
      sequelize,
      modelName: "OrderItem",
      tableName: "order_items",
    }
  );
  return OrderItem;
};
