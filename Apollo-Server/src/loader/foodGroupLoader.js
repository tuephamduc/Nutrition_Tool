// import * as DataLoader from 'dataloader';
import DataLoader from 'dataloader';
import { FoodGroup } from "../models/FoodGroup"
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
/* 
  1 Food có 1 foodGroup khi query Food và lấy foodGroup của nó sẽ làm tăng số lượng truy vấn lên
  nên sử dụng dataloader vào đó
*/

const foodGroupLoader = new DataLoader(async (keys) => {
  const foodGroups = await FoodGroup.findAll({
    where: {
      id: {
        [Op.in]: keys
      }
    }
  })

  const foodGroupMap = {}
  foodGroups.forEach(foodGroup => {
    foodGroupMap[foodGroup.id] = foodGroup
  })
  return keys.map(id => foodGroupMap[id])
}
)

export default foodGroupLoader