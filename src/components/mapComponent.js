import { useEffect, useState } from "react";
import ListingDistributionMap from "../views/ListingDistributionMap";
import { Link } from "react-router-dom";
import SelectionFilters from "../views/SelectionFilter";
import NavBar from "./navComponent";
import SpiderChart from "../views/SpiderChart";

export default function MapComponent() {
  const rows = 3;
  const padding = 16;
  const [rowHeigth, setRowHeight] = useState(0);

  useEffect(() => {
    const viewportHeight = window.innerHeight - 40;
    const height = (viewportHeight - padding * 2) / rows;
    setRowHeight(height);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleResize = () => {
    const viewportHeight = window.innerHeight;
    const height = (viewportHeight - padding * 2) / rows;
    setRowHeight(height);
  };

  const getRowHeight = (row = 1) => {
    return `${rowHeigth * row}px`;
  };

  return (
    <div>
      <nav className="font-sans flex flex-col text-center sm:flex-row sm:text-left sm:justify-between py-2 px-6 bg-white shadow sm:items-baseline w-full">
        <div className="mb-2 sm:mb-0">
          <div className="text-2xl no-underline text-grey-darkest hover:text-blue-dark">
            Map View
          </div>
        </div>
        <NavBar />
      </nav>
      <div className="grid grid-cols-12 gap-1 p-2">
        <div className="col-span-3 grid grid-cols-1 gap-1">
          <div
            className="col-span-3 block p-2 bg-white border border-gray-200 rounded-lg shadow"
            style={{ height: getRowHeight(1) }}
          >
            <SpiderChart chartName="spider-chart" />
          </div>
          <div
            className="col-span-3 block p-2 bg-white border border-gray-200 rounded-lg shadow"
            style={{ height: getRowHeight(2) }}
          >
            <SelectionFilters room_type={true} />
          </div>
        </div>
        <div
          className="col-span-9 block p-2 bg-white border border-gray-200 rounded-lg shadow"
          style={{ height: getRowHeight(3) }}
        >
          <ListingDistributionMap chartName="listing-distribution-map" />
        </div>
      </div>
    </div>
  );
}
