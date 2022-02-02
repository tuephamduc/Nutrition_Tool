import sequelize from "./index";
import Sequelize, { DataTypes, where } from 'sequelize';
import { User } from '../models/User'
import { UserProfile } from '../models/UserProfile'
import { FoodGroup } from '../models/FoodGroup'
import { Food } from '../models/Food'
import { NutritionFact } from '../models/NutritionFact'
import { Nutrients } from '../models/Nutrients'
import { ExtraNutrition } from '../models/ExtraNutrition'
import { Components } from '../models/Components'

export const Tracking = sequelize.define('Tracking', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: Sequelize.STRING(8),
    references: {
      model: 'User', // 'fathers' refers to table name
      key: 'id', // 'id' refers to column name in fathers table
    }
  },
  foodId: {
    type: Sequelize.STRING(10),
    references: {
      model: 'Food',
      key: 'id',
    }
  },
  meal: {
    type: Sequelize.STRING(10)
  },
  date: {
    type: Sequelize.DATE
  },
  weight: {
    type: Sequelize.REAL
  }
},
  {
    timestamps: false
  })
