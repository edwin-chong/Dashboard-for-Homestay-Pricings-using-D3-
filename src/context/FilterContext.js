import React, { createContext, useContext, useReducer } from "react";

export const FilterContext = createContext();

export const useFilterContext = () => {
  return useContext(FilterContext);
};

export const FilterContextProvider = ({ children }) => {
  // Define your initial context state
  const initialState = {
    listing: null,
    roomType: [],
    amenities: [],
    accommodates: [],
    nearBySubway: [],
    nearByTourism: [],
    price: [],
    showSubway: false,
    showTourism: false,
  };

  // Define a reducer to handle state updates
  const reducer = (state, action) => {
    switch (action.type) {
      case "UPDATE_DATA":
        return { ...state };
      default:
        return state;
    }
  };

  // Use useReducer to manage state
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <FilterContext.Provider value={{ state, dispatch }}>
      {children}
    </FilterContext.Provider>
  );
};
