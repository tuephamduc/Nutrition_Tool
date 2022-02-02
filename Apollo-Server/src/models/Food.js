import sequelize from "./index";
import Sequelize, { DataTypes, where } from 'sequelize';
import { NutritionFact } from "./NutritionFact";
import { ExtraNutrition } from "./ExtraNutrition";
import { FoodGroup } from "./FoodGroup";

export const Food = sequelize.define('Food', {
  id: {
    type: Sequelize.STRING(10),
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING(128),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  foodGroup: {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: 'FoodGroup',
      key: 'id',
    }
  },
  language: {
    type: Sequelize.STRING(32)
  },
  image: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  owner: {
    type: Sequelize.STRING(8),
  },
  scope: {
    type: Sequelize.BOOLEAN
  },
  isIngredient: {
    type: Sequelize.BOOLEAN
  },
  serving_weight_grams: {
    type: Sequelize.REAL
  },
  serving_unit: {
    type: Sequelize.STRING(32)
  },
  active: {
    type: Sequelize.BOOLEAN
  }
})

Food.hasOne(NutritionFact, { foreignKey: 'foodId', sourceKey: 'id' })
NutritionFact.belongsTo(Food, { foreignKey: 'foodId', targetKey: 'id' })

Food.hasMany(ExtraNutrition, { foreignKey: 'foodId', sourceKey: 'id' })
ExtraNutrition.belongsTo(Food, { foreignKey: 'foodId', targetKey: 'id' })

FoodGroup.hasMany(Food, { foreignKey: 'foodGroup', sourceKey: 'id' })
Food.belongsTo(FoodGroup, { foreignKey: 'foodGroup', targetKey: 'id' })