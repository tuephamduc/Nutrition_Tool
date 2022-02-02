export const CaculateDV = (nutrient, DVNutrient) => {
  if (!nutrient) {
    return `0%`
  }
  else return `${Math.round(nutrient / DVNutrient * 100)}%`
}


 // const { Calories,
  //   Carbohydrates,
  //   Calcium,
  //   Cholesterol,
  //   DiateryFiber,
  //   Fat,
  //   Iron,
  //   Potassium,
  //   Protein,
  //   SaturatedFat,
  //   Sodium,
  //   Sugars,
  //   VitaminA,
  //   TransFat,
  //   VitaminC,
  //   serving_unit,
  //   serving_weight_grams } = nutrientData