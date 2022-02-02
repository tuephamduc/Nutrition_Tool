import React from "react";
import { DVNutrition } from "constants/DVNutrition"
import { useParams } from "react-router";
import { CaculateDV } from "helpers/CaculateDV"
import { Skeleton } from "antd";
const NutritionFact = (props) => {
  const { nutrientData } = props

  const Calories = nutrientData?.Calories ? nutrientData.Calories : 0;
  const Carbohydrates = nutrientData?.Carbohydrates ? nutrientData.Carbohydrates : 0;
  const Calcium = nutrientData?.Calcium ? nutrientData.Calcium : 0;
  const Cholesterol = nutrientData?.Cholesterol ? nutrientData.Cholesterol : 0;
  const DiateryFiber = nutrientData?.DiateryFiber ? nutrientData.DiateryFiber : 0;
  const Fat = nutrientData?.Fat ? nutrientData.Fat : 0;
  const Iron = nutrientData?.Iron ? nutrientData.Iron : 0;
  const Protein = nutrientData?.Protein ? nutrientData.Protein : 0;
  const SaturatedFat = nutrientData?.SaturatedFat ? nutrientData.SaturatedFat : 0;
  const Sodium = nutrientData?.Sodium ? nutrientData.Sodium : 0;
  const Sugars = nutrientData?.Sugars ? nutrientData.Sugars : 0;
  const VitaminA = nutrientData?.VitaminA ? nutrientData.VitaminA : 0;
  const TransFat = nutrientData?.TransFat ? nutrientData.TransFat : 0;
  const VitaminC = nutrientData?.VitaminC ? nutrientData.VitaminC : 0;
  const serving_unit = nutrientData?.serving_unit ? nutrientData.serving_unit : "serving"
  const serving_weight_grams = nutrientData?.serving_weight_grams ? nutrientData.serving_weight_grams : 0
  return (

    <div className="performance-facts">
      <header className="performance-facts__header">
        <h1 className="performance-facts__title">Nutrition Facts</h1>
        <p>{`Serving Size ${serving_unit} (about ${serving_weight_grams} g )`}</p>
        {/* <p>Serving Per Container 8</p> */}
      </header>
      <table className="performance-facts__table">
        <thead>
          <tr>
            <th colSpan="3" className="small-info">
              Amount Per Serving
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th colSpan="2">
              <b>Calories &nbsp;</b>
              {`${Calories}`}
            </th>
            {/* <td>
              Calories from Fat
              130
            </td> */}
            <td></td>
          </tr>
          <tr className="thick-row">
            <td colSpan="3" className="small-info">
              <b>% Daily Value*</b>
            </td>
          </tr>
          <tr>
            <th colSpan="2">
              <b>Total Fat &nbsp;</b>
              {
                `${Fat}g`
              }
            </th>
            <td>
              <b>{CaculateDV(Fat, DVNutrition.Fat)}</b>
            </td>
          </tr>
          <tr>
            <td className="blank-cell">
            </td>
            <th>
              Saturated Fat &nbsp;
              {
                `${SaturatedFat}g`
              }
            </th>
            <td>
              <b>{CaculateDV(SaturatedFat, DVNutrition.SaturatedFat)}</b>
            </td>
          </tr>
          <tr>
            <td className="blank-cell">
            </td>
            <th>
              Trans Fat &nbsp;
              {
                `${TransFat}g`
              }
            </th>
            <td>
            </td>
          </tr>
          <tr>
            <th colSpan="2">
              <b>Cholesterol  &nbsp;</b>
              {
                `${Cholesterol}mg`
              }

            </th>
            <td>
              <b>{CaculateDV(Cholesterol, DVNutrition.Cholesterol)}</b>
            </td>
          </tr>
          <tr>
            <th colSpan="2">
              <b>Sodium  &nbsp;</b>
              {
                `${Sodium}mg`
              }
            </th>
            <td>
              <b>{CaculateDV(Sodium, DVNutrition.Sodium)}</b>
            </td>
          </tr>
          <tr>
            <th colSpan="2">
              <b>Total Carbohydrate  &nbsp;</b>
              {
                `${Carbohydrates}g`
              }
            </th>
            <td>
              <b>{CaculateDV(Carbohydrates, DVNutrition.Carbohydrates)}</b>
            </td>
          </tr>
          <tr>
            <td className="blank-cell">
            </td>
            <th>
              Dietary Fiber  &nbsp;
              {
                `${DiateryFiber}g`
              }
            </th>
            <td>
              <b>{CaculateDV(DiateryFiber, DVNutrition.DiateryFiber)}</b>
            </td>
          </tr>
          <tr>
            <td className="blank-cell">
            </td>
            <th>
              Sugars  &nbsp;
              {
                `${Sugars}g`
              }
            </th>
            <td>
            </td>
          </tr>
          <tr className="thick-end">
            <th colSpan="2">
              <b>Protein  &nbsp;</b>
              {
                `${Protein}g`
              }
            </th>
            <td>
            </td>
          </tr>
        </tbody>
      </table>

      <table className="performance-facts__table--grid">
        <tbody>
          <tr>
            <td colSpan="2">
              Vitamin A  &nbsp;
              {CaculateDV(VitaminA, DVNutrition.VitaminA)}
            </td>
            <td>
              Vitamin C  &nbsp;
              {CaculateDV(VitaminC, DVNutrition.VitaminC)}
            </td>
          </tr>
          <tr className="thin-end">
            <td colSpan="2">
              Calcium  &nbsp;
              {CaculateDV(Calcium, DVNutrition.Calcium)}
            </td>
            <td>
              Iron  &nbsp;
              {CaculateDV(Iron, DVNutrition.Iron)}
            </td>
          </tr>
        </tbody>
      </table>

      <p className="small-info">* Percent Daily Values are based on a 2,000 calorie diet. Your daily values may be higher or lower depending on your calorie needs:</p>

      <table className="performance-facts__table--small small-info">
        <thead>
          <tr>
            <td colSpan="2"></td>
            <th>Calories:</th>
            <th>2,000</th>
            <th>2,500</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th colSpan="2">Total Fat</th>
            <td>Less than</td>
            <td>65g</td>
            <td>80g</td>
          </tr>
          <tr>
            <td className="blank-cell"></td>
            <th>Saturated Fat</th>
            <td>Less than</td>
            <td>20g</td>
            <td>25g</td>
          </tr>
          <tr>
            <th colSpan="2">Cholesterol</th>
            <td>Less than</td>
            <td>300mg</td>
            <td>300 mg</td>
          </tr>
          <tr>
            <th colSpan="2">Sodium</th>
            <td>Less than</td>
            <td>2,400mg</td>
            <td>2,400mg</td>
          </tr>
          <tr>
            <th colSpan="3">Total Carbohydrate</th>
            <td>300g</td>
            <td>375g</td>
          </tr>
          <tr>
            <td className="blank-cell"></td>
            <th colSpan="2">Dietary Fiber</th>
            <td>25g</td>
            <td>30g</td>
          </tr>
        </tbody>
      </table>

      <p className="small-info">
        Calories per gram:
      </p>
      <p className="small-info text-center">
        Fat 9
        &bull;
        Carbohydrate 4
        &bull;
        Protein 4
      </p>

    </div>
  )
}

export default NutritionFact