import useFoodLogProvider from 'hooks/FoodLog/useFoodLogProvider';
import React, { createContext } from 'react';

export const FoodLogContext = createContext();

const FoodLogProvider = ({ children }) => {
  const foodLog = useFoodLogProvider();

  return (
    <FoodLogContext.Provider value={foodLog}>
      {children}
    </FoodLogContext.Provider>
  )
}

export default FoodLogProvider