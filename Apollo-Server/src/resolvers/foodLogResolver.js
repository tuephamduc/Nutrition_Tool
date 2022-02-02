import { User } from "../models/User"
import { UserProfile } from "../models/UserProfile"
import { Tracking } from "../models/Tracking"
import dotenv from 'dotenv'
import _ from 'lodash';
const Sequelize = require('sequelize');
import bcrypt from 'bcrypt'
import sequelize from 'sequelize'

const Op = Sequelize.Op;
dotenv.config();

const foodLogResolver = {
  Tracking: {
    food: async (parent, args, context) => {
      return context.loader.foodLoader.load(parent.foodId)
    }
  },
  Query: {
    getFoodsLog: async (parent, args, context) => {
      try {
        const userId = context.user.user.id;
        const foodLog = await Tracking.findAll({
          where: { userId: userId }
        });
        return foodLog
      } catch (err) {
        throw err
      }
    },
    getFoodsLogByDate: async (parent, { date }, context) => {
      try {
        const userId = context.user.user.id;
        const foodLog = await Tracking.findAll({
          where: {
            [Op.and]: [
              { userId: userId },
              {}
            ]
          }
        });
        return foodLog
      } catch (err) {
        throw err
      }
    },
    getFoodLogById: async (_, { id }, context) => {
      try {
        const track = await Tracking.findOne({
          where: { id: id }
        })
        return track
      } catch (err) {
        throw err
      }
    }
  },

  Mutation: {
    addFoodLog: async (_, { input }, context) => {
      try {
        const userId = context.user.user.id
        const returnData = []
        for (let i = 0; i < input.length; i++) {
          const foodLog = await Tracking.create({
            userId: userId,
            foodId: input[i].foodId,
            meal: input[i].meal,
            weight: input[i].weight,
            date: input[i].date
          })
          returnData.push(foodLog.dataValues)
        };

        return returnData
      } catch (error) {
        throw error
      }
    },

    editFoodLog: async (_, { input, id }, context) => {
      const userId = context.user.user.id
      try {
        await Tracking.update({
          foodId: input.foodId,
          meal: input.meal,
          date: input.date,
          weight: input.weight
        },
          { where: { id: id } })

        const returnLog = Tracking.findOne({ where: { id: id } })
        return returnLog
      } catch (err) {
        throw err
      }
    },

    deleteFoodLog: async (_, { id }, context) => {
      try {
        await Tracking.destroy({ where: { id: id } })
        return id
      } catch (err) {
        throw (err)
      }
    }
  }
}

export default foodLogResolver