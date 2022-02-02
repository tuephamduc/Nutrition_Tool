// import * as DataLoader from 'dataloader';
import DataLoader from 'dataloader';
import { NutritionFact } from "../models/NutritionFact"
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


const nutritionFactLoader = new DataLoader(async (keys) => {
  const nutriLists = await NutritionFact.findAll({
    where: {
      foodId: {
        [Op.in]: keys
      }
    }
  })
  const nutriListMap = {}
  nutriLists.forEach(nutriList => {
    nutriListMap[nutriList.foodId] = nutriList
  })
  return keys.map(foodId => nutriListMap[foodId])
}
)

export default nutritionFactLoader