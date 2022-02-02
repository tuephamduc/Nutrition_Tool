import sequelize from "./index";
import Sequelize, { DataTypes, where } from 'sequelize';


export const Nutrients = sequelize.define('Nutrients', {
  nutrient: {
    type: Sequelize.STRING(128),
  },
  unit: {
    type: Sequelize.STRING(8)
  },
  tagname: {
    type: Sequelize.STRING(32)
  }
},
  {
    timestamps: false
  })
