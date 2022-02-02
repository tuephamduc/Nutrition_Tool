// import * as DataLoader from 'dataloader';
import DataLoader from 'dataloader';
import { Nutrients } from "../models/Nutrients"
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


const nutrientsLoader = new DataLoader(async (keys) => {
  const nutrients = await Nutrients.findAll({
    where: {
      id: {
        [Op.in]: keys
      }
    }
  })

  const nutrientsMap = {}
  nutrients.forEach(nutrient => {
    nutrientsMap[nutrient.id] = nutrient
  })
  return keys.map(id => nutrientsMap[id])
}
)

export default nutrientsLoader