import React, { useEffect } from "react";
import { useDataContext } from "../context/DataContext";
import * as d3 from "d3";
import Loading from "../util/Loading";

export default function ListingCountChart(props) {
  const { cData } = useDataContext();
  const [data, setData] = cData;

  useEffect(() => {
    draw(data);

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [data]);

  const handleResize = () => {
    draw(data);
  };

  const draw = (d) => {
    d3.select(`.${props.chartName} > *`).remove();
    const tmpData = d;
    const preData = {
      "Hotel Room": 0,
      "Private Room": 0,
      "Shared Room": 0,
      "Entire Home/Apt": 0,
    };

    let total = tmpData.length;
    tmpData.forEach((d) => {
      if (d.room_type == "Hotel room") {
        preData["Hotel Room"] += 1;
      } else if (d.room_type == "Private room") {
        preData["Private Room"] += 1;
      } else if (d.room_type == "Shared room") {
        preData["Shared Room"] += 1;
      } else {
        preData["Entire Home/Apt"] += 1;
      }
    });

    let data = preData;

    // set the color scale
    const color = d3
      .scaleOrdinal()
      .domain(Object.keys(data))
      .range(d3.schemeTableau10);

    const element = document.getElementById(props.chartName);
    const margin = 30;
    const width = element.offsetWidth;
    const height = element.offsetHeight;
    const radius = Math.min(width, height) / 2.5 - margin;

    let svg = d3
      .select(`.${props.chartName}`)
      .append("svg")
      .attr("width", width + margin * 2)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // Compute the position of each group on the pie:
    const pie = d3
      .pie()
      .sort(null) // Do not sort group by size
      .value((d) => d[1]);
    const data_ready = pie(Object.entries(data));

    console.log(data_ready);

    // The arc generator
    const arc = d3
      .arc()
      .innerRadius(radius * 0.5) // This is the size of the donut hole
      .outerRadius(radius * 0.8);

    // Another arc that won't be drawn. Just for labels positioning
    const outerArc = d3
      .arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
      .selectAll("allSlices")
      .data(data_ready)
      .join("path")
      .attr("d", arc)
      .attr("fill", (d) => color(d.data[1]))
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 0.7);

    // Add the polylines between chart and labels:
    svg
      .selectAll("allPolylines")
      .data(data_ready)
      .join("polyline")
      .attr("stroke", "black")
      .style("fill", "none")
      .attr("stroke-width", 1)
      .attr("points", function (d) {
        const posA = arc.centroid(d); // line insertion in the slice
        const posB = outerArc.centroid(d); // line break: we use the other arc generator that has been built only for that
        const posC = outerArc.centroid(d); // Label position = almost the same as posB
        return [posA, posB, posC];
      });

    // Add the polylines between chart and labels:
    svg
      .selectAll("allLabels")
      .data(data_ready)
      .join("text")
      .html((d) => {
        return `<tspan x="5">${d.data[0]}</tspan><tspan x="5" dy="1em">${(
          (d.data[1] / total) *
          100
        ).toFixed(2)}%</tspan>`;
      })
      .style("font-size", "10px")
      .attr("transform", function (d) {
        const pos = outerArc.centroid(d);
        return `translate(${pos})`;
      })
      .style("text-anchor", function (d) {
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        return midangle < Math.PI ? "start" : "end";
      });
  };

  return (
    <div className="pane">
      <div className="header">Room Types</div>
      <div className="flex-grow" id={props.chartName}>
        {data.length === 0 ? <Loading /> : <div className={props.chartName} />}
      </div>
    </div>
  );
}
