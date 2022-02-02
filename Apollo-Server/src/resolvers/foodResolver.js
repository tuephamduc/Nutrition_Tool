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
import excel from 'exceljs'
import xlsx from 'xlsx'
const Sequelize = require('sequelize');
import bcrypt from 'bcrypt'
import sequelize from 'sequelize'
import { PER_PAGE } from '../helpers/pagination'

const Op = Sequelize.Op;
dotenv.config();

const storeFS = ({ stream, filename }) => {
  const newfileName = new Date().getTime() + '_' + filename
  const pathName = path.join(__dirname, `../public/import/${newfileName}`)
  return new Promise((resolve, reject) => {
    const tempFile = stream.pipe(fs.createWriteStream(pathName))
    tempFile.on("finish", () => resolve(pathName))
  })
}

const foodResolver = {

  Components: {
    component: async (parent, args, context) => {
      return context.loader.foodLoader.load(parent.componentId)
    }
  },
  ExtraNutrition: {
    nutrients: async (parent, args, context) => {
      return context.loader.nutrientsLoader.load(parent.nutrientId)
    }
  },

  Food: {
    basicNutrients: async (parent, args, context) => {
      context.loader.nutritionFactLoader.clear(parent.id)
      return context.loader.nutritionFactLoader.load(parent.id)
      // const basic = await NutritionFact.findOne({ where: { foodId: parent.id } })
      // return basic
    },
    group: async (parent, args, context) => {
      return context.loader.foodGroupLoader.load(parent.foodGroup)
    },

    components: async (parent, args) => {
      return await Components.findAll({
        where: {
          foodId: parent.id
        }
      })
    },
    extraNutrients: async (parent, args, context) => {
      return await ExtraNutrition.findAll({
        where: {
          foodId: parent.id
        }
      })

    }

  },

  Query: {
    //Admin
    countFood: async (parent, args, context) => {
      const numFood = await Food.count({
        where: { active: true }
      })
      return numFood
    },
    countNewFood: async (parent, args, context) => {
      const today = new Date().setHours(0, 0, 0, 0);
      const numNewFood = await Food.count(
        {
          where: {
            createdAt: {
              [Op.gt]: today
            }
          }
        }
      )

      return numNewFood
    },
    countFoodInGroup: async (parent, args, context) => {
      const foodCount = await Food.findAll({
        attributes: ["foodGroup", [Sequelize.fn('COUNT', 'foodGroup'), 'TagCount']],
        include: {
          model: FoodGroup,
          // require: false
        },
        group: ['foodGroup', "FoodGroup.id"],
      })
      const result = foodCount.map(item => {
        return {
          group: item.dataValues.FoodGroup.groupName,
          count: item.dataValues.TagCount
        }
      })
      return result
    },

    //Nutrient
    getAllNutrients: async (parent, args, context) => {
      const listExistId = [2, 3, 5, 50, 67, 4, 68, 22, 21, 6, 7, 9, 36, 26, 16, 17]
      return await Nutrients.findAll({
        where: {
          id: { [Op.notIn]: listExistId }
        }
      })
    },
    getNutrients: async (parent, { limit, page }, context) => {
      const offset = (page - 1) * limit
      const nutrients = await Nutrients.findAndCountAll({
        limit: limit,
        offset: offset,
        order: [["id", "ASC"]]
      })
      const totalPage = Math.ceil((nutrients.count) / limit)
      const hasNextPage = page * limit < (nutrients.count - 1)
      const edges = nutrients.rows
      const total = nutrients.count
      return {
        total,
        edges,
        totalPage,
        hasNextPage
      }
    },

    //Search Food


    getFoods: async (parent, { query }, context) => {
      const { search, orderby, limit, page, foodGroup } = query
      const offset = (page - 1) * limit
      const textSearch = search ? search : ""
      try {
        let foods = []
        if (!foodGroup) {
          foods = await Food.findAndCountAll({
            where: {
              [Op.and]: [
                {
                  name: { [Op.iLike]: '%' + textSearch + '%' },
                },
                {
                  active: true
                }
              ]
            },
            limit: limit,
            offset: offset,
            order: [["createdAt", "DESC"]]
          })
        }
        else {
          foods = await Food.findAndCountAll({
            where: {
              [Op.and]: [
                {
                  name: { [Op.iLike]: '%' + textSearch + '%' },
                },
                {
                  foodGroup: foodGroup
                },
                {
                  active: true
                }
              ]
            },
            limit: limit,
            offset: offset,
            order: [["createdAt", "DESC"]]
          })
        }

        const totalPage = Math.ceil((foods.count) / limit)
        const hasNextPage = page * limit < (foods.count - 1)
        const edges = foods.rows
        const total = foods.count
        return {
          total,
          edges,
          totalPage,
          hasNextPage
        }
      } catch (error) {
        throw error
      }
    },

    getFoodByGroup: async (parent, { foodGroup }, context) => {
      return await Food.findAll({
        where: {
          foodGroup: foodGroup
        }
      })
    },

    getFoodById: async (parent, { id }, context) => {
      const food = await Food.findOne({
        where: { id: id }
      })

      if (food) {
        return food
      }
      else {
        throw new Error("Cannot find this food")
      }
    },

    getIngredientsByName: async (parent, { search }, context) => {
      if (!search) return ([])
      const ingre = await Food.findAll({
        where:
        {
          [Op.and]: [
            {
              name: { [Op.iLike]: '%' + search + '%' },
            },
            {
              isIngredient: true,
            },
            {
              scope: true
            },
            {
              active: true
            }
          ]
        }
      })
      return ingre;
    },

    basic: async (parent, { id }, context) => {
      return await NutritionFact.findOne({ where: { foodId: id } })
    },

    getUserFoods: async (parent, { query }, context) => {
      const userId = context.user.user.id;
      const owner = `U${userId}`
      const { search, limit, page } = query

      const offset = (page - 1) * limit;
      const textSearch = search ? search : "";
      try {
        const foods = await Food.findAndCountAll({
          where: {
            [Op.and]: [
              {
                name: { [Op.iLike]: '%' + textSearch + '%' },
              },
              {
                owner: owner
              }, {
                active: true
              }
            ]
          },
          limit: limit,
          offset: offset,
          order: [["createdAt", "DESC"]]
        })

        const totalPage = Math.ceil((foods.count) / limit)
        const hasNextPage = page * limit < (foods.count - 1)
        const edges = foods.rows
        const total = foods.count
        return {
          total,
          edges,
          totalPage,
          hasNextPage
        }

      } catch (err) {
        throw err
      }
    },

    orderFoodByNutrient: async (parent, { nutrient }, context) => {
      const searchFood = await Food.findAll({
        include: {
          model: NutritionFact,
          // require: false
        },
        order: [
          [NutritionFact, Sequelize.literal(`"${nutrient}" / "Food"."serving_weight_grams"`), "DESC NULLS LAST"]
        ],
        where: {
          active: true
        },
        limit: 10
      })
      return searchFood
    },

    orderFoodByExtraNutrient: async (parent, { nutrient }, context) => {

      const searchFood = await Food.findAll({
        include: {
          model: ExtraNutrition,
          where: { nutrientId: nutrient },
        },
        where: {
          active: true
        },
        order: [
          [ExtraNutrition, Sequelize.literal(`"value" / "Food"."serving_weight_grams"`), "DESC NULLS LAST"]
        ],
        limit: 10
      })

      return searchFood
    },

    searchFoodByNutrient: async (parent, { query }, context) => {
      const { nutrient, op, content } = query
      const listExistId = [2, 3, 5, 50, 67, 4, 68, 22, 21, 6, 7, 9, 36, 26, 16, 17]
      // Nếu chất dinh dưỡng ở nằm trong Nutrient Fact
      console.log(op);
      try {
        if (listExistId.includes(nutrient)) {
          const fact = NutritionFactSelect.find(item => item.id === nutrient)
          if (op === "max") {
            const searchFood = await Food.findAll({
              include: {
                model: NutritionFact,
                // require: false
              },
              where: {
                active: true
              },
              order: [
                [NutritionFact, Sequelize.literal(`"${fact.nutrient}" / "Food"."serving_weight_grams"`), "DESC NULLS LAST"]
              ],
              limit: PER_PAGE
            })
            return searchFood
          }
          if (op === "min") {
            const searchFood = await Food.findAll({
              include: {
                model: NutritionFact,
              },
              where: {
                active: true
              },
              order: [
                [NutritionFact, Sequelize.literal(`"${fact.nutrient}" / "Food"."serving_weight_grams"`), "ASC NULLS LAST"]
              ],
              limit: PER_PAGE
            })
            return searchFood
          }
          else {
            const searchFood = await Food.findAll({
              include: {
                model: NutritionFact,
              },
              where: {
                [Op.and]: Sequelize.literal(`"${fact.nutrient}" / "Food"."serving_weight_grams"*100::numeric ${op} ${content}`)
              },

              limit: PER_PAGE
            })
            return searchFood
          }


        } // chất dinh dưỡng là extraNutrient
        else {
          if (op === "max") {
            const searchFood = await Food.findAll({
              include: {
                model: ExtraNutrition,
                where: { nutrientId: nutrient },
              },
              order: [
                [ExtraNutrition, Sequelize.literal(`"value" / "Food"."serving_weight_grams"`), "DESC NULLS LAST"]
              ],
              limit: PER_PAGE
            })

            return searchFood
          }
          if (op === "min") {
            const searchFood = await Food.findAll({
              include: {
                model: ExtraNutrition,
                where: { nutrientId: nutrient },
              },
              order: [
                [ExtraNutrition, Sequelize.literal(`"value" / "Food"."serving_weight_grams"`), "ASC NULLS LAST"]
              ],
              limit: PER_PAGE
            })

            return searchFood
          }
          else {
            const searchFood = await Food.findAll({
              include: {
                model: ExtraNutrition,
                where: {
                  [Op.and]: [
                    { nutrientId: nutrient },
                    Sequelize.literal(`"value"*100 / "Food"."serving_weight_grams"::numeric ${op} ${content}`)
                  ],
                }
              },
              limit: PER_PAGE
            })

            return searchFood
          }

        }
      } catch (err) {
        throw err
      }

    },

    searchFoodByName: async (parent, { search, foodGroup }, context) => {
      try {
        const textSearch = search ? search : ""
        if (foodGroup) {
          const foods = await Food.findAll({
            where: {
              [Op.and]: [
                {
                  name: { [Op.iLike]: '%' + textSearch + '%' },
                },
                {
                  foodGroup: foodGroup
                },
                {
                  scope: true
                },
                {
                  active: true
                }
              ]
            },
          })
          return foods

        }
        else {
          const foods = await Food.findAll({
            where: {
              [Op.and]: [
                {
                  name: { [Op.iLike]: '%' + textSearch + '%' },
                },
                ,
                {
                  scope: true
                },
                { active: true }
              ]
            },
          })
          return foods
        }
      } catch (err) {
        throw err
      }
    },

    sortFoodByNutrient: async (parent, { query }, context) => {
      const { nutrient, foodGroup, sort, page, limit } = query
      const offset = (page - 1) * limit
      let status;
      if (sort === 1) status = "DESC NULLS LAST"
      if (sort === 2) status = "ASC NULLS LAST"
      try {
        if (!nutrient) return null;
        const listExistId = [2, 3, 5, 50, 67, 4, 68, 22, 21, 6, 7, 9, 36, 26, 16, 17]
        if (listExistId.includes(nutrient)) {
          let searchFood
          const fact = NutritionFactSelect.find(item => item.id === nutrient)
          if (!foodGroup) {
            searchFood = await Food.findAndCountAll({
              include: {
                model: NutritionFact,
              },
              order: [
                [NutritionFact, Sequelize.literal(`"${fact.nutrient}" / "Food"."serving_weight_grams"`), status]
              ],
              where: {
                [Op.and]: [
                  {
                    scope: true
                  },
                  {
                    active: true
                  }
                ]
              },
              limit: limit,
              offset: offset
            })
          } else {
            searchFood = await Food.findAndCountAll({
              include: {
                model: NutritionFact,
              },
              order: [
                [NutritionFact, Sequelize.literal(`"${fact.nutrient}" / "Food"."serving_weight_grams"`), status]
              ],
              where: {
                [Op.and]: [
                  { foodGroup: foodGroup },
                  { scope: true }
                ]
              },
              limit: limit,
              offset: offset
            })
          }
          const totalPage = Math.ceil((searchFood.count) / limit)
          const hasNextPage = page * limit < (searchFood.count - 1)
          const edges = searchFood.rows
          const total = searchFood.count
          return {
            total,
            edges,
            totalPage,
            hasNextPage
          }
        }
        else {
          let searchFood
          if (!foodGroup) {
            searchFood = await Food.findAndCountAll({
              include: {
                model: ExtraNutrition,
                where: { nutrientId: nutrient },
              },
              order: [
                [ExtraNutrition, Sequelize.literal(`"value" / "Food"."serving_weight_grams"`), status]
              ],
              where: {
                scope: true
              },

              limit: limit,
              offset: offset
            })
          } else {
            searchFood = await Food.findAndCountAll({
              include: {
                model: ExtraNutrition,
                where: { nutrientId: nutrient },
              },
              order: [
                [ExtraNutrition, Sequelize.literal(`"value" / "Food"."serving_weight_grams"`), status]
              ],
              where: {
                [Op.and]: [
                  { foodGroup: foodGroup },
                  { scope: true }
                ]
              },
              limit: limit,
              offset: offset
            })
          }

          const totalPage = Math.ceil((searchFood.count) / limit)
          const hasNextPage = page * limit < (searchFood.count - 1)
          const edges = searchFood.rows
          const total = searchFood.count
          return {
            total,
            edges,
            totalPage,
            hasNextPage
          }
        }
      } catch (error) {
        throw err
      }
    }

  },

  Mutation: {
    //Admin

    addFood: async (parent, { foodInput }, context) => {
      const roles = context.user.user.roles
      const userid = context.user.user.id
      let inputOwner
      const { name, foodGroup, language, owner, scope, isIngredient, basicNutrients, extraNutrients, ingredients } = foodInput
      if (roles === "ADMIN") { inputOwner = owner }
      if (roles === "USER") { inputOwner = `U${userid}` }

      try {
        const newFood = await Food.create({
          name: name,
          foodGroup: foodGroup,
          language: language,
          owner: inputOwner,
          scope: scope,
          isIngredient: isIngredient,
          image: "images/Food/DefaultImage.jpg",
          serving_unit: basicNutrients.serving_unit,
          serving_weight_grams: basicNutrients.serving_weight_grams,
          active: true
        })

        const newId = newFood.id
        const newBasic = { ...basicNutrients, foodId: newId }
        const nutritionFact = await NutritionFact.create(newBasic)
        if (extraNutrients && extraNutrients.length > 0) {
          for (let index = 0; index < extraNutrients.length; index++) {
            await ExtraNutrition.create({
              foodId: newId,
              nutrientId: extraNutrients[index].nutrientId,
              value: extraNutrients[index].value
            })
          }
        }
        if (ingredients && ingredients.length > 0) {
          for (let index = 0; index < ingredients.length; index++) {
            await Components.create({
              foodId: newId,
              componentId: ingredients[index].componentId,
              value: ingredients[index].value
            })
          }
        }
        return newFood;
      } catch (error) {
        throw error
      }
    },

    editFood: async (parent, { foodInput, id }, context) => {
      let inputOwner
      const roles = context.user.user.roles
      const userId = context.user.user.id
      const { name, foodGroup, language, owner, scope, isIngredient, basicNutrients, extraNutrients, ingredients } = foodInput
      if (roles === "ADMIN") { inputOwner = owner }
      if (roles === "USER") { inputOwner = `U${userId}` }
      try {
        const sampleFood = await Food.findOne({ where: { id: id } })
        if (roles === "USER" && sampleFood.owner !== `U${userId}`) {
          throw new Error("Not Permission!!! Please try again")
        }
        await Food.update({
          name: name,
          foodGroup: foodGroup,
          language: language,
          owner: inputOwner,
          scope: scope,
          isIngredient: isIngredient,
          serving_unit: basicNutrients.serving_unit,
          serving_weight_grams: basicNutrients.serving_weight_grams
        }, {
          where: { id: id }
        });
        // const newBasic = { ...basicNutrients, foodId: id }
        await NutritionFact.update({
          serving_unit: basicNutrients.serving_unit,
          serving_weight_grams: basicNutrients.serving_weight_grams,
          Calories: basicNutrients.Calories,
          Fat: basicNutrients.Fat,
          SaturatedFat: basicNutrients.SaturatedFat,
          TransFat: basicNutrients.TransFat,
          Protein: basicNutrients.Protein,
          Cholesterol: basicNutrients.Cholesterol,
          Sodium: basicNutrients.Sodium,
          Potassium: basicNutrients.Potassium,
          Carbohydrates: basicNutrients.Carbohydrates,
          DiateryFiber: basicNutrients.DiateryFiber,
          Sugars: basicNutrients.Sugars,
          VitaminA: basicNutrients.VitaminA,
          VitaminC: basicNutrients.VitaminC,
          Calcium: basicNutrients.Calcium,
          Iron: basicNutrients.Iron,
        }, {
          where: { foodId: id }
        })

        await ExtraNutrition.destroy({ where: { foodId: id } })
        await Components.destroy({ where: { foodId: id } })
        if (extraNutrients && extraNutrients.length > 0) {
          for (let index = 0; index < extraNutrients.length; index++) {
            await ExtraNutrition.create({
              foodId: id,
              nutrientId: extraNutrients[index].nutrientId,
              value: extraNutrients[index].value
            })
          }
        }
        if (ingredients && ingredients.length > 0) {
          for (let index = 0; index < ingredients.length; index++) {
            await Components.create({
              foodId: id,
              componentId: ingredients[index].componentId,
              value: ingredients[index].value
            })
          }
        }
        context.loader.nutritionFactLoader.clear(id)
        const returnFood = await Food.findOne({ where: { id: id } })
        const returnFact = await NutritionFact.findOne({ where: { foodId: id } })

        return returnFood
      } catch (err) {
        throw err
      }
    },

    deleteFood: async (parent, { id }, context) => {
      try {
        // await Components.destroy({ where: { foodId: id } });
        // await ExtraNutrition.destroy({ where: { foodId: id } });
        // await NutritionFact.destroy({ where: { foodId: id } });
        await Food.update({ active: false },
          { where: { id: id } })
        return id
      } catch (err) {
        throw err
      }
    },
    changeImageFood: async (parent, { file, foodId }, context) => {
      const roles = context.user.user.roles
      const userId = context.user.user.id
      try {
        const updateFood = await Food.findOne({ where: { id: foodId } })

        if (roles === "USER" && updateFood.owner !== `U${userId}`) {
          throw new Error("No permisson. Please try again !")
        }

        const { createReadStream, filename, mimetype, encoding } = await file
        const stream = createReadStream();
        const newfileName = new Date().getTime() + '_' + filename
        const pathName = path.join(__dirname, `../public/images/Avatar/${newfileName}`)
        await stream.pipe(fs.createWriteStream(pathName));

        const imageDBPath = `/images/Avatar/${newfileName}`
        await Food.update({
          image: imageDBPath
        }, {
          where: { id: foodId }
        })

        return {
          url: imageDBPath,
          success: true
        }
      } catch (err) {
        throw err
      }
    },


    //Nutrient
    addNutrient: async (parent, { nutrient, unit, tagname }, context) => {
      try {
        const nutrients = Nutrients.create({
          nutrient: nutrient,
          unit: unit,
          tagname: tagname
        })
        return nutrients
      } catch (err) {
        throw err
      }
    },
    editNutrient: async (parent, { id, nutrient, unit, tagname }, context) => {
      try {
        await Nutrients.update({
          nutrient: nutrient,
          unit: unit,
          tagname: tagname
        }, {
          where: { id: id }
        })
        const nutrients = await Nutrients.findOne({ where: { id: id } })
        return nutrients
      } catch (err) {
        throw err
      }
    },
    deleteNutrient: async (parent, { id }, context) => {
      try {
        const ExistId = [2, 3, 5, 50, 67, 4, 68, 22, 21, 6, 7, 9, 36, 26, 16, 17]
        const extraNutrition = await ExtraNutrition.findOne({
          where: { nutrientId: id }
        })
        if (extraNutrition || ExistId.includes(parseInt(id))) {
          throw new Error("Cannot delete this item !")
        }
        else {
          await Nutrients.destroy({
            where: { id: id }
          })
          return id
        }
      } catch (err) {
        throw err
      }
    },


    //import excel

    importFoodData: async (_, { file, owner, scope }, context) => {
      const userId = context.user.user.id;
      const roles = context.user.user.roles

      let source
      if (!userId) return new Error("Bạn cần đăng nhập để thực hiện!")
      if (roles === "ADMIN") {
        source = owner
      } else if (roles === "USER") {
        source = `U${userId}`
      }


      try {
        const { createReadStream, filename, mimetype, encoding } = await file
        const stream = createReadStream()

        const pathName = await storeFS({ stream, filename })

        const workbook = await xlsx.readFile(pathName, { cellDates: true });
        const sheet_name = workbook.SheetNames

        const listFoods = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name[1]]);

        if (!listFoods) {
          return new Error("File upload không đúng, vui lòng thử lại");
        }
        else if (listFoods.length === 0) {

          return new Error("File upload không có dữ liệu, vui lòng thử lại");

        }
        else {
          const importdata = listFoods.map(item => {

            const { Name, FoodGroup, Language, IsIngredient, serving_unit, serving_weight_grams, Calories, Fat, SaturatedFat, TransFat, Protein, Cholesterol, Sodium, Potassium, Carbohydrates, DiateryFiber, Sugars, VitaminA, VitaminC, Calcium, Iron, ...rawFood } = item
            const result = Object.keys(rawFood).map(e => ({
              nutrientId: parseInt(e.split('-')[0]),
              value: rawFood[e]
            }))
            const a = result.some(function (item) {
              Number.isNaN(item.nutrientId)
            })

            const food = {
              name: item.Name,
              foodGroup: item.FoodGroup,
              language: item.Language || null,
              isIngredient: item.IsIngredient || null,
              owner: source,
              scope: scope,
              serving_unit: item.serving_unit || null,
              serving_weight_grams: item.serving_weight_grams || 100,
            }

            const NutrientFact = {
              serving_unit: item.serving_unit || null,
              serving_weight_grams: item.serving_weight_grams || 100,
              Calories: item.Calories || null,
              Fat: item.Fat || null,
              SaturatedFat: item.SaturatedFat || null,
              TransFat: item.TransFat || null,
              Protein: item.Protein || null,
              Cholesterol: item.Cholesterol || null,
              Sodium: item.Sodium || null,
              Potassium: item.Potassium || null,
              Carbohydrates: item.Carbohydrates || null,
              DiateryFiber: item.DiateryFiber || null,
              Sugars: item.Sugars || null,
              VitaminA: item.VitaminA || null,
              VitaminC: item.VitaminC || null,
              Calcium: item.Calcium || null,
              Iron: item.Iron || null,
            }

            return ({
              food: food,
              nutritionFact: NutrientFact,
              extraNutrient: result
            })
          })

          const isTrueFormat = importdata.some(item => {
            if (!item.food.name || !item.food.foodGroup) { return false }
            else {
              const extra = item.extraNutrient
              const isNAN = extra.some(function (item) {
                Number.isNaN(item.nutrientId)
              })
              return !isNAN
            }
          });
          console.log(importdata);
          if (!isTrueFormat) {
            return new Error("File upload không đúng, vui lòng thử lại");
          }
          if (!importdata) {
            return new Error("File upload không đúng, vui lòng thử lại");
          }
          else {

            for (let index = 0; index < importdata.length; index++) {
              const newFood = await Food.create({
                name: importdata[index].food.name,
                foodGroup: importdata[index].food.foodGroup,
                language: importdata[index].food.language,
                owner: importdata[index].food.owner,
                scope: importdata[index].food.scope,
                active: true,
                isIngredient: importdata[index].food.isIngredient,
                image: "images/Food/DefaultImage.jpg",
                serving_unit: importdata[index].food.serving_unit,
                serving_weight_grams: importdata[index].food.serving_weight_grams
              })

              const newId = newFood.id
              const newBasicNutrient = { ...importdata[index].nutritionFact, foodId: newId }

              await NutritionFact.create(newBasicNutrient)

              const listExtra = importdata[index].extraNutrient;
              for (let index = 0; index < listExtra.length; index++) {
                await ExtraNutrition.create({
                  foodId: newId,
                  nutrientId: listExtra[index].nutrientId,
                  value: listExtra[index].value
                })
              }
            }

            const result =
            {
              url: "",
              success: true
            }

            return result

          }
        }
      }
      catch (err) {
        throw err
      }
    },
  }
}

export default foodResolver