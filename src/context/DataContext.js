import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getData,
  getHost,
  getKeywords,
  getSubway,
  getTourist,
} from "../util/data";

const DataContext = createContext();

export const useDataContext = () => {
  return useContext(DataContext);
};

export const DataContextProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState({
    listing: null,
    roomType: [],
  });

  const [subway, setSubway] = useState([]);
  const [tourist, setTourist] = useState([]);
  const [keyword, setKeywords] = useState([]);
  const [hosts, setHost] = useState([]);

  useEffect(() => {
    getData()
      .then((res) => {
        setData(res);
        return getSubway();
      })
      .then((res) => {
        setSubway(res);
        return getTourist();
      })
      .then((res) => {
        setTourist(res);
        return getKeywords();
      })
      .then((res) => {
        setKeywords(res);
        return getHost();
      })
      .then((res) => {
        setHost(res);
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  }, []);

  return (
    <DataContext.Provider
      value={{
        cData: [data, setData],
        cFilter: [filter, setFilter],
        cSubway: [subway, setSubway],
        cTourist: [tourist, setTourist],
        cKeyword: [keyword, setKeywords],
        cHost: [hosts, setHost],
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
