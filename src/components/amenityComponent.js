import { useEffect, useState } from "react";
import NavBar from "./navComponent";
import AmenitiesChart from "../views/AmenitiesChart";
import AmenityChart from "../views/AmenityChart";


export default function AmenityComponent() {
  const rows = 4;
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
            Amenity Dashboard
          </div>
        </div>
        <NavBar />
      </nav>
      <div className="grid grid-cols-12 gap-1 p-2">
        <div className="col-span-2 grid grid-cols-1 gap-1">
          <div
            className="col-span-1 block p-2 bg-white border border-gray-200 rounded-lg shadow"
            style={{ height: getRowHeight(3) }}
          >
            <AmenityChart chartName="amenity-ranking-chart"/>
          </div>
          <div
            className="col-span-1 block p-2 bg-white border border-gray-200 rounded-lg shadow"
            style={{ height: getRowHeight() }}
          >
            <AmenitiesChart chartName="amenity-wifi-chart" amenKey="wifi" />
          </div>
        </div>
        <div className="col-span-10 grid grid-cols-10 gap-1">
          <div
            className="col-span-2 block p-2 bg-white border border-gray-200 rounded-lg shadow"
            style={{ height: getRowHeight() }}
          >
            <AmenitiesChart
              chartName="amenity-smoke_alarm-chart"
              amenKey="smoke_alarm"
            />
          </div>
          <div
            className="col-span-2 block p-2 bg-white border border-gray-200 rounded-lg shadow"
            style={{ height: getRowHeight() }}
          >
            <AmenitiesChart chartName="amenity-heating-chart" amenKey="heating" />
          </div>
          <div
            className="col-span-2 block p-2 bg-white border border-gray-200 rounded-lg shadow"
            style={{ height: getRowHeight() }}
          >
            <AmenitiesChart chartName="amenity-tv-chart" amenKey="tv" />
          </div>
          <div
            className="col-span-2 block p-2 bg-white border border-gray-200 rounded-lg shadow"
            style={{ height: getRowHeight() }}
          >
            <AmenitiesChart
              chartName="amenity-air_conditioning-chart"
              amenKey="air_conditioning"
            />
          </div>
          <div
            className="col-span-2 block p-2 bg-white border border-gray-200 rounded-lg shadow"
            style={{ height: getRowHeight() }}
          >
            <AmenitiesChart
              chartName="amenity-hot_water-chart"
              amenKey="hot_water"
            />
          </div>
          <div
            className="col-span-2 block p-2 bg-white border border-gray-200 rounded-lg shadow"
            style={{ height: getRowHeight() }}
          >
            <AmenitiesChart chartName="amenity-iron-chart" amenKey="iron" />
          </div>
          <div
            className="col-span-2 block p-2 bg-white border border-gray-200 rounded-lg shadow"
            style={{ height: getRowHeight() }}
          >
            <AmenitiesChart
              chartName="amenity-refrigerator-chart"
              amenKey="refrigerator"
            />
          </div>
          <div
            className="col-span-2 block p-2 bg-white border border-gray-200 rounded-lg shadow"
            style={{ height: getRowHeight() }}
          >
            <AmenitiesChart chartName="amenity-shampoo-chart" amenKey="shampoo" />
          </div>
          <div
            className="col-span-2 block p-2 bg-white border border-gray-200 rounded-lg shadow"
            style={{ height: getRowHeight() }}
          >
            <AmenitiesChart chartName="amenity-coffee-chart" amenKey="coffee" />
          </div>
          <div
            className="col-span-2 block p-2 bg-white border border-gray-200 rounded-lg shadow"
            style={{ height: getRowHeight() }}
          >
            <AmenitiesChart chartName="amenity-washer-chart" amenKey="washer" />
          </div>
          <div
            className="col-span-2 block p-2 bg-white border border-gray-200 rounded-lg shadow"
            style={{ height: getRowHeight() }}
          >
            <AmenitiesChart
              chartName="amenity-dedicated_workspace-chart"
              amenKey="dedicated_workspace"
            />
          </div>
          <div
            className="col-span-2 block p-2 bg-white border border-gray-200 rounded-lg shadow"
            style={{ height: getRowHeight() }}
          >
            <AmenitiesChart chartName="amenity-oven-chart" amenKey="oven" />
          </div>
          <div
            className="col-span-2 block p-2 bg-white border border-gray-200 rounded-lg shadow"
            style={{ height: getRowHeight() }}
          >
            <AmenitiesChart
              chartName="amenity-fire_extinguisher-chart"
              amenKey="fire_extinguisher"
            />
          </div>
          <div
            className="col-span-2 block p-2 bg-white border border-gray-200 rounded-lg shadow"
            style={{ height: getRowHeight() }}
          >
            <AmenitiesChart
              chartName="amenity-self_check_in-chart"
              amenKey="self_check_in"
            />
          </div>
          <div
            className="col-span-2 block p-2 bg-white border border-gray-200 rounded-lg shadow"
            style={{ height: getRowHeight() }}
          >
            <AmenitiesChart
              chartName="amenity-first_aid_kit-chart"
              amenKey="first_aid_kit"
            />
          </div>
          <div
            className="col-span-2 block p-2 bg-white border border-gray-200 rounded-lg shadow"
            style={{ height: getRowHeight() }}
          >
            <AmenitiesChart
              chartName="amenity-free_street_parking-chart"
              amenKey="free_street_parking"
            />
          </div>
          <div
            className="col-span-2 block p-2 bg-white border border-gray-200 rounded-lg shadow"
            style={{ height: getRowHeight() }}
          >
            <AmenitiesChart
              chartName="amenity-extra_pillows_and_blankets-chart"
              amenKey="extra_pillows_and_blankets"
            />
          </div>
          <div
            className="col-span-2 block p-2 bg-white border border-gray-200 rounded-lg shadow"
            style={{ height: getRowHeight() }}
          >
            <AmenitiesChart chartName="amenity-bathtub-chart" amenKey="bathtub" />
          </div>
          <div
            className="col-span-2 block p-2 bg-white border border-gray-200 rounded-lg shadow"
            style={{ height: getRowHeight() }}
          >
            <AmenitiesChart
              chartName="amenity-pets_allowed-chart"
              amenKey="pets_allowed"
            />
          </div>
          <div
            className="col-span-2 block p-2 bg-white border border-gray-200 rounded-lg shadow"
            style={{ height: getRowHeight() }}
          >
            <AmenitiesChart chartName="amenity-gym-chart" amenKey="gym" />
          </div>
        </div>
      </div>
    </div>
  );
}
