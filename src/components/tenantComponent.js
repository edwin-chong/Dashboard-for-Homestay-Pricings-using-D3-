import { useEffect, useState } from "react";
import PopularityChart from "../views/PopularityChart";
import AmenitiesWordle from "../views/AmenitiesWordle";
import RoomTypeChart from "../views/RoomTypeChart";
import NavBar from "./navComponent";
import ReviewRatingChart from "../views/ReviewRatingChart";
import ListingCountChart from "../views/ListingCountChart";

export default function TenantComponent() {
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
            Tenant View
          </div>
        </div>
        <NavBar />
      </nav>
      <div className="grid grid-cols-6 gap-1 p-2">
        <div className="col-span-3 grid grid-cols-6 gap-1">
          <div
            className="col-span-3 block p-2 bg-white border border-gray-200 rounded-lg shadow"
            style={{ height: getRowHeight() }}
          >
            <RoomTypeChart chartName="verified-host-chart" />
          </div>
          <div
            className="col-span-3 block p-2 bg-white border border-gray-200 rounded-lg shadow"
            style={{ height: getRowHeight() }}
          >
            <PopularityChart chartName="popularity-property-type-chart" />
          </div>
          <div
            className="col-span-3 block p-2 bg-white border border-gray-200 rounded-lg shadow"
            style={{ height: getRowHeight() }}
          >
            <ReviewRatingChart chartName="review-rating-chart" />
          </div>
          <div
            className="col-span-3 block p-2 bg-white border border-gray-200 rounded-lg shadow"
            style={{ height: getRowHeight() }}
          >
            <ListingCountChart chartName="listing-count-chart" />
          </div>
        </div>
        <div
          className="col-span-3 block p-2 bg-white border border-gray-200 rounded-lg shadow"
          style={{ height: getRowHeight(2) }}
        >
          <AmenitiesWordle chartName="amenitiesWordle" />
        </div>
      </div>
    </div>
  );
}
