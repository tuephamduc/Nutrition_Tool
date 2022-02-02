import DataLoader from 'dataloader';
import { Food } from "../models/Food"
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
/* 
  1 Food có 1 foodGroup khi query Food và lấy foodGroup của nó sẽ làm tăng số lượng truy vấn lên
  nên sử dụng dataloader vào đó
*/

const foodLoader = new DataLoader(async (keys) => {
  const food = await Food.findAll({
    where: {
      id: {
        [Op.in]: keys
      }
    }
  })

  const foodGroupMap = {}
  food.forEach(foodGroup => {
    foodGroupMap[foodGroup.id] = foodGroup
  })
  return keys.map(id => foodGroupMap[id])
}
)

export default foodLoader