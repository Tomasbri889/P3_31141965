const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class Tag extends Model {}

  Tag.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }    
  }, {
    sequelize,
    modelName: 'Tag',
    tableName: 'tags'
  });

  return Tag;
};
