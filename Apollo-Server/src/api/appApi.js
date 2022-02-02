import { Food } from '../models/Food'
import { FoodGroup } from '../models/FoodGroup'
import { NutritionFact } from '../models/NutritionFact'
import { Nutrients } from '../models/Nutrients'
import { ExtraNutrition } from '../models/ExtraNutrition'
import { Components } from '../models/Components'
import excel from 'exceljs'
import xlsx from 'xlsx'
import { orderBy } from 'lodash'

const exportSampleFile = async (req, res, next) => {

  try {
    const nutrients = await Nutrients.findAll({
    });
    const foodgroups = await FoodGroup.findAll()
    const nutrientFact = Object.keys(NutritionFact.rawAttributes);
    let workbook = new excel.Workbook();
    let foodGroupSheet = workbook.addWorksheet('FoodGroup');
    let foodsheet = workbook.addWorksheet('FoodNutrition');
    const foodcolumn = [
      { header: "Name", key: "name" },
      { header: "FoodGroup", key: "foodGroup" },
      { header: "Language", key: "langage" },
      { header: "IsIngredient", key: "isIngredient" },
    ]
    nutrientFact.forEach(item => {
      if (item !== "foodId") {
        foodcolumn.push({ header: item, key: item })
      }
    }
    )

    const foodGroupColumn = [
      { header: "ID", key: "id" },
      { header: "Name", key: "groupName" }
    ]
    foodGroupSheet.columns = foodGroupColumn
    foodGroupSheet.addRows(foodgroups)

    const ExistId = [2, 3, 5, 50, 67, 4, 68, 22, 21, 6, 7, 9, 36, 26, 16, 17]
    nutrients.forEach(item => {
      if (!ExistId.includes(item.dataValues.id)) {
        foodcolumn.push({ header: `${item.dataValues.id}-${item.dataValues.nutrient}(${item.dataValues.unit})`, key: `${item.dataValues.id}` })
      }
    })


    foodsheet.columns = foodcolumn


    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=' + 'foodSample.xlsx');
    return workbook.xlsx.write(res)
      .then(function () {
        res.status(200).end();
      });
  } catch (err) {
    throw err
  }
}


const exportFoodFile = async (req, res, next) => {
  const { token } = req.headers
  const user = req.user.user
  if (!user) {
    res.json({
      "status": 0,
      "code": 403,
      "message": "Bạn cần đăng nhập để thực hiện thao tác này",
      "data": ''
    })
    return;
  }
  try {

    const foodgroups = await FoodGroup.findAll()
    let workbook = new excel.Workbook();
    const nutrients = await Nutrients.findAll();

    // export Sheet foodGroup
    let foodGroupSheet = workbook.addWorksheet('FoodGroup');
    const foodGroupColumn = [
      { header: "ID", key: "id" },
      { header: "Name", key: "groupName" }
    ]
    foodGroupSheet.columns = foodGroupColumn
    foodGroupSheet.addRows(foodgroups)

    // export file foodNutrition
    let foodsheet = workbook.addWorksheet('FoodNutrition');
    const nutrientFactAttr = Object.keys(NutritionFact.rawAttributes);

    const foodcolumn = [
      { header: "Food ID", key: "id" },
      { header: "Name", key: "name" },
      { header: "FoodGroup", key: "foodGroup" },
      { header: "Language", key: "language" },
      { header: "IsIngredient", key: "isIngredient" },
    ]
    nutrientFactAttr.forEach(item => {
      if (item !== "foodId") {
        foodcolumn.push({ header: item, key: item })
      }
    }
    )
    const ExistId = [2, 3, 5, 50, 67, 4, 68, 22, 21, 6, 7, 9, 36, 26, 16, 17]
    nutrients.forEach(item => {
      if (!ExistId.includes(item.dataValues.id)) {
        foodcolumn.push({ header: `${item.dataValues.id}-${item.dataValues.nutrient}(${item.dataValues.unit})`, key: `${item.dataValues.id}` })
      }
    })
    let food

    if (user.roles === "ADMIN") {
      food = await Food.findAll({
        include: [{
          model: NutritionFact
        },
        {
          model: ExtraNutrition,
          required: false
        }
        ],
        // limit: 2,
        order: [['id']]
      })
    } else if (user.roles === "USER") {
      const owner = `U${user.id}`
      food = await Food.findAll({
        include: [{
          model: NutritionFact
        },
        {
          model: ExtraNutrition,
          required: false
        }
        ],
        // limit: 2,
        where: {
          owner: owner
        },
        order: [['id']]
      })
    }
    const foodRows = food.map(item => {
      const { NutritionFact, ExtraNutritions, ...rawdata } = item.dataValues
      const nutrientFact = item.NutritionFact.dataValues
      const extra = item.ExtraNutritions
      const extraArr = {}
      extra.forEach(item => {
        (extraArr[item.dataValues.nutrientId] = item.dataValues.value)
      })

      return ({
        ...rawdata, ...nutrientFact, ...extraArr
      })
    })

    foodsheet.columns = foodcolumn
    foodsheet.addRows(foodRows)
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=' + 'foodNutrition.xlsx');
    return workbook.xlsx.write(res)
      .then(function () {
        res.status(200).end();
      });

  }
  catch (error) {
    res.json({
      "status": 0,
      "code": 404,
      "message": "Đã có lỗi xảy ra",
      "data": ''
    })
    return;
  }
}


export default {
  exportSampleFile,
  exportFoodFile
}