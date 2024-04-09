import React, { useEffect, useState } from "react";
import {
  Link,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import { DataContextProvider } from "./context/DataContext";
import "./dashboard.css";
import OwnerComponent from "./components/ownerComponent";
import TentantComponent from "./components/tenantComponent";
import { FilterContextProvider } from "./context/FilterContext";
import MapComponent from "./components/mapComponent";
import AmenityComponent from "./components/amenityComponent";

export default function App() {
  const { pathname } = useLocation();
  const [prevPathname, setPrevPathname] = useState(pathname);

  useEffect(() => {
    if (pathname !== prevPathname) {
      // Reload the page only if the pathname has changed
      window.location.reload();
    }

    // Update the previous pathname
    setPrevPathname(pathname);
  }, [pathname, prevPathname]);
  return (
    <DataContextProvider>
      <FilterContextProvider>
        <Routes>
          <Route path="/" element={<TentantComponent />} />
          <Route path="/owner" element={<OwnerComponent />} />
          <Route path="/map" element={<MapComponent />} />
          <Route path="/amenity" element={<AmenityComponent />} />
        </Routes>
      </FilterContextProvider>
    </DataContextProvider>
  );
}
