import { useEffect, useState } from "react";
import SuperHostChart from "../views/SuperHostChart";
import VerifiedHostChart from "../views/VerifiedHostChart";
import PopularityChart from "../views/PopularityChart";
import AmenityChart from "../views/AmenityChart";
import SatisfactionScatter from "../views/SatisfactionScatter";
import NavBar from "./navComponent";
import SubwayScatter from "../views/SubwayScatter";
import TourismScatter from "../views/TourismScatter";
import AmenityScatter from "../views/AmenityScatter";
import OwnerLineChart from "../views/OwnerLineChart";

export default function OwnerComponent() {
  const rows = 2;
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
            Owner View
          </div>
        </div>
        <NavBar />
      </nav>
      <div className="grid grid-cols-12 gap-1 p-2">
        <div className="col-span-4 grid grid-cols-6 gap-1">
          <div
            className="col-span-3 block p-2 bg-white border border-gray-200 rounded-lg shadow"
            style={{ height: getRowHeight() }}
          >
            <SuperHostChart chartName="super-host-chart" />
          </div>
          <div
            className="col-span-3 block p-2 bg-white border border-gray-200 rounded-lg shadow"
            style={{ height: getRowHeight() }}
          >
            <VerifiedHostChart chartName="verified-host-chart" />
          </div>
          <div
            className="col-span-6 block p-2 bg-white border border-gray-200 rounded-lg shadow"
            style={{ height: getRowHeight() }}
          >
            <OwnerLineChart chartName="owner-creation-chart" />
          </div>
        </div>
        <div className="col-span-8 grid grid-cols-2 gap-1">
          <div
            className="col-span-1 block p-2 bg-white border border-gray-200 rounded-lg shadow"
            style={{ height: getRowHeight() }}
          >
            <SatisfactionScatter chartName="satisfaction-scatter-chart" />
          </div>
          <div
            className="col-span-1 block p-2 bg-white border border-gray-200 rounded-lg shadow"
            style={{ height: getRowHeight() }}
          >
            <SubwayScatter chartName="subway-scatter-chart" />
          </div>
          <div
            className="col-span-1 block p-2 bg-white border border-gray-200 rounded-lg shadow"
            style={{ height: getRowHeight() }}
          >
            <TourismScatter chartName="tourism-scatter-chart" />
          </div>
          <div
            className="col-span-1 block p-2 bg-white border border-gray-200 rounded-lg shadow"
            style={{ height: getRowHeight() }}
          >
            <AmenityScatter chartName="amenity-scatter-chart" />
          </div>
        </div>
      </div>
    </div>
  );
}
