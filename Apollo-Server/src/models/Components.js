import sequelize from "./index";
import Sequelize, { DataTypes, where } from 'sequelize';

export const Components = sequelize.define('Components', {
  foodId: {
    type: Sequelize.STRING(10),
    references: {
      model: 'Food',
      key: 'id',
    },
    primaryKey: true
  },
  componentId: {
    type: Sequelize.STRING(10),
    references: {
      model: 'Food',
      key: 'id',
    },
    primaryKey: true
  },
  value: {
    type: Sequelize.REAL
  }
},
  { timestamps: false }

)
