import sequelize from "./index";
import Sequelize, { DataTypes, where } from 'sequelize';

export const NutritionFact = sequelize.define('NutritionFact', {
  foodId: {
    type: Sequelize.STRING(10),
    references: {
      model: 'Food',
      key: 'id',
    },
    primaryKey: true
  },
  serving_unit: {
    type: Sequelize.STRING(128)
  },
  serving_weight_grams: {
    type: Sequelize.REAL
  },
  Calories: {
    type: Sequelize.REAL,
  },
  Fat: {
    type: Sequelize.REAL,
  },
  SaturatedFat: {
    type: Sequelize.REAL
  },
  TransFat: {
    type: Sequelize.REAL
  }
  ,
  Protein: {
    type: Sequelize.REAL,
  },
  Cholesterol: {
    type: Sequelize.REAL,
  },
  Sodium: {
    type: Sequelize.REAL,
  },
  Potassium: {
    type: Sequelize.REAL,
  },
  Carbohydrates: {
    type: Sequelize.REAL,
  },
  DiateryFiber: {
    type: Sequelize.REAL
  },
  Sugars: {
    type: Sequelize.REAL
  },
  VitaminA: {
    type: Sequelize.REAL,
  },
  VitaminC: {
    type: Sequelize.REAL,
  },
  Calcium: {
    type: Sequelize.REAL,
  },
  Iron: {
    type: Sequelize.REAL,
  }
}, {
  timestamps: false,
})