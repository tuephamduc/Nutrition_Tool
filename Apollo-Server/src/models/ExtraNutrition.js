import sequelize from "./index";
import Sequelize, { DataTypes, where } from 'sequelize';

export const ExtraNutrition = sequelize.define('ExtraNutrition', {
  foodId: {
    type: Sequelize.STRING(10),
    references: {
      model: 'Food',
      key: 'id',
    },
    primaryKey: true,
  },
  nutrientId: {
    type: Sequelize.INTEGER,
    references: {
      model: 'Nutrients',
      key: 'id',
    },
    primaryKey: true
  },
  value: {
    type: Sequelize.REAL,
  }

}, {
  timestamps: false,
}
)