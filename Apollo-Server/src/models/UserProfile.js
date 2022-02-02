import sequelize from "./index";
import Sequelize, { DataTypes, where } from 'sequelize';

export const UserProfile = sequelize.define('UserProfile', {
  userId: {
    type: Sequelize.STRING(8),
    references: {
      model: 'User', // 'fathers' refers to table name
      key: 'id', // 'id' refers to column name in fathers table
    },
    primaryKey: true
  },
  gender: {
    type: Sequelize.INTEGER
  },
  birthday: {
    type: Sequelize.DATE
  },
  avatar: {
    type: Sequelize.STRING
  },
  height: {
    type: Sequelize.REAL
  },
  weight: {
    type: Sequelize.REAL
  }
}, {
  timestamps: false
});