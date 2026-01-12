const { DataTypes, Model, Op } = require('sequelize');
const slugify = require('../utils/slugify');

module.exports = (sequelize) => {
  class Product extends Model {}

  Product.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    // Atributos específicos para la línea: Componentes de PC
    brand: {
      type: DataTypes.STRING,
      allowNull: true
    },
    model: {
      type: DataTypes.STRING,
      allowNull: true
    },
    generation: {
      type: DataTypes.STRING,
      allowNull: true
    },
    socket: {
      type: DataTypes.STRING,
      allowNull: true
    },
    formFactor: {
      type: DataTypes.STRING,
      allowNull: true
    },
    wattage: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    condition: {
      type: DataTypes.STRING,
      allowNull: true
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    hooks: {
      beforeValidate: async (product) => {
        if (product.name && !product.slug) {
          const base = slugify(product.name);
          let slug = base;
          const ProductModel = sequelize.models.Product || product.constructor;
          let i = 0;
          // ensure uniqueness (ignore self when updating)
          const whereIdNe = product.id ? { id: { [Op.ne]: product.id } } : {};
          while (await ProductModel.findOne({ where: { slug, ...whereIdNe } })) {
            i += 1;
            slug = `${base}-${i}`;
          }
          product.slug = slug;
        }
      },
      beforeSave: async (product) => {
        if (product.name && (!product.slug || product.changed('name'))) {
          const base = slugify(product.name);
          let slug = base;
          const ProductModel = sequelize.models.Product || product.constructor;
          let i = 0;
          // ensure uniqueness (ignore self when updating)
          const whereIdNe = product.id ? { id: { [Op.ne]: product.id } } : {};
          while (await ProductModel.findOne({ where: { slug, ...whereIdNe } })) {
            i += 1;
            slug = `${base}-${i}`;
          }
          product.slug = slug;
        }
      }
    }
  });

  return Product;
};
