import { Food } from '../models/Food'
import { FoodGroup } from '../models/FoodGroup'
import { NutritionFact } from '../models/NutritionFact'
import { Nutrients } from '../models/Nutrients'
import { ExtraNutrition } from '../models/ExtraNutrition'
import { Components } from '../models/Components'
import { User } from '../models/User'
import { NutritionFactSelect } from '../ultis/nutrientFact'
import path from 'path';
import fs from "fs";
import dotenv from 'dotenv'
import _ from 'lodash';
import { convertNodeToCursor, convertCursorToNodeId } from "../helpers/pagination"
import excel from 'exceljs'
import xlsx from 'xlsx'
const Sequelize = require('sequelize');
import bcrypt from 'bcrypt'
import sequelize from 'sequelize'

const Op = Sequelize.Op;
dotenv.config();


const foodGroupResolver = {

  Query: {
    getAllFoodGroup: async (parent, args, context) => {
      return await FoodGroup.findAll()
    },

    getFoodGroup: async (parent, { limit, page }, context) => {
      const offset = (page - 1) * limit
      const foodgroups = await FoodGroup.findAndCountAll({
        limit: limit,
        offset: offset,
        order: [["id", "ASC"]]
      })
      const totalPage = Math.ceil((foodgroups.count) / limit)
      const hasNextPage = page * limit < (foodgroups.count - 1)
      const edges = foodgroups.rows
      const total = foodgroups.count
      return {
        total,
        edges,
        totalPage,
        hasNextPage
      }

    },
  },
  Mutation: {
    // FoodGroup
    addFoodGroup: async (parent, { groupName }, context) => {
      const group = await FoodGroup.create({
        groupName: groupName
      })
      return group
    },
    editFoodGroup: async (parent, { groupName, id }, context) => {
      await FoodGroup.update({ groupName: groupName }, {
        where: { id: id }
      })
      const group = await FoodGroup.findOne({ where: { id: id } })
      return group

    },

    deleteFoodGroup: async (parent, { id }, context) => {
      try {
        const food = await Food.findOne({
          where: { foodGroup: id }
        })
        if (food) {
          throw new Error("Cannot delete this food group !!!")
        }
        else {
          const foodGroup = await FoodGroup.destroy({
            where: { id: id }
          })
          return id
        }
      } catch (error) {
        throw (error)
      }
    },
  }
}

export default foodGroupResolver