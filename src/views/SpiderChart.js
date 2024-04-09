import React, { useContext, useEffect } from "react";
import { useDataContext } from "../context/DataContext";
import * as d3 from "d3";
import Loading from "../util/Loading";
import { getRadarChart } from "../util/radarChart";
import { FilterContext } from "../context/FilterContext";

export default function SpiderChart(props) {
  const { cData } = useDataContext();
  const [data, setData] = cData;

  const { state } = useContext(FilterContext);

  useEffect(() => {
    draw(data);

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [data]);

  useEffect(() => {
    draw(data);
  }, [state]);

  const handleResize = () => {
    draw(data);
  };

  const draw = (d) => {
    d3.select(`.${props.chartName} > *`).remove();

    const chartData = [];
    const tmpData = d;
    const meanPrice = d3.mean(tmpData, (d) => d.price);
    const meanRate = d3.mean(tmpData, (d) => d.review_rating);
    const meanCostPerson = d3.mean(tmpData, (d) => d.price / d.accommodates);
    const meanFaci = d3.mean(tmpData, (d) => d.amen_count);
    const meanNearby = d3.mean(
      tmpData,
      (d) => d.subway_count + d.tourist_count
    );

    const maxPrice = d3.max(tmpData, (d) => d.price);
    const maxRate = d3.max(tmpData, (d) => d.review_rating);
    const maxCostPerson = d3.max(tmpData, (d) => d.price / d.accommodates);
    const maxFaci = d3.max(tmpData, (d) => d.amen_count);
    const maxNearby = d3.max(tmpData, (d) => d.subway_count + d.tourist_count);

    const avgData = [
      { axis: "Price", value: 1 - meanPrice / maxPrice, act_value: meanPrice },
      { axis: "Review Rate", value: meanRate / maxRate, act_value: meanRate },
      {
        axis: "Nearby Facilities",
        value: meanFaci / maxFaci,
        act_value: meanFaci,
      },
      {
        axis: "Amenities",
        value: meanNearby / maxNearby,
        act_value: meanNearby,
      },
      {
        axis: "Cost per Person",
        value: 1 - meanCostPerson / maxCostPerson,
        act_value: meanCostPerson,
      },
    ];

    chartData.push(avgData);

    if (state.listing) {
      const filteredData = d3.filter(
        tmpData,
        (d) => d.list_id == state.listing
      );

      const selectedCostPerons =
        filteredData[0].price / filteredData[0].accommodates;

      const selectedData = [
        {
          axis: "Price",
          value: 1 - filteredData[0].price / maxPrice,
          act_value: filteredData[0].price,
        },
        {
          axis: "Review Rate",
          value: filteredData[0].review_rating / maxRate,
          act_value: filteredData[0].review_ratin,
        },
        {
          axis: "Nearby Facilities",
          value: filteredData[0].amen_count / maxFaci,
          act_value: filteredData[0].amen_count,
        },
        {
          axis: "Amenities",
          value:
            (filteredData[0].subway_count + filteredData[0].tourist_count) /
            maxNearby,
          act_value:
            filteredData[0].subway_count + filteredData[0].tourist_count,
        },
        {
          axis: "Cost per Person",
          value: 1 - selectedCostPerons / maxCostPerson,
          act_value: selectedCostPerons,
        },
      ];

      chartData.push(selectedData);
    }

    var color = d3.scaleOrdinal().range(["#EDC951", "#CC333F"]);

    const element = document.getElementById(props.chartName);
    const margin = { top: 40, right: 40, bottom: 40, left: 40 };
    const width = element.offsetWidth - margin.left - margin.right;
    const height = element.offsetHeight - margin.top - margin.bottom;

    var radarChartOptions = {
      w: width,
      h: height,
      margin: margin,
      maxValue: 1,
      levels: 5,
      roundStrokes: false,
      color: color,
    };
    //Call function to draw the Radar chart
    getRadarChart(`.${props.chartName}`, chartData, radarChartOptions);
  };

  return (
    <div className="pane">
      <div className="header">Overall Ratings</div>
      <div className="flex-grow" id={props.chartName}>
        {data.length === 0 ? <Loading /> : <div className={props.chartName} />}
      </div>
    </div>
  );
}
