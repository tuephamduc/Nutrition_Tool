import sequelize from "./index";
import Sequelize, { DataTypes, where } from 'sequelize';

export const FoodGroup = sequelize.define('FoodGroup', {
  groupName: {
    type: Sequelize.STRING(32),
  }
},
  {
    timestamps: false
  })
