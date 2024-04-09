import React, { useEffect } from "react";
import { useDataContext } from "../context/DataContext";
import * as d3 from "d3";
import Loading from "../util/Loading";

export default function AmenityChart(props) {
  const { cData, cKeyword } = useDataContext();
  const [data, setData] = cData;
  const [keyword, setKeywords] = cKeyword;

  useEffect(() => {
    draw(keyword);

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [keyword]);

  const handleResize = () => {
    draw(keyword);
  };

  const draw = (d) => {
    d3.select(`.${props.chartName} > *`).remove();
    const tmpData = d;
    var slicedData = JSON.parse(JSON.stringify(tmpData.slice(0, 20)));

    for (let i = 0; i < slicedData.length; i++) {
      slicedData[i]["count"] = (slicedData[i]["count"] / 11123 * 100).toFixed(2);
    }

    const element = document.getElementById(props.chartName);
    const margin = { top: 20, right: 50, bottom: 20, left: 60 };
    const width = element.offsetWidth - margin.left - margin.right;
    const height = element.offsetHeight - margin.top - margin.bottom;

    const svg = d3
      .select(`.${props.chartName}`)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Scale the range of the data in the domains
    const y = d3.scaleBand().range([0, height]).padding(0.1);
    const x = d3.scaleLinear().range([0, width]);

    y.domain(
      slicedData.map(function (d) {
        return d.keyword;
      })
    );

    const xMax = d3.max(slicedData, function (d) {
      return d.count;
    });

    x.domain([0, xMax]);

    var color = d3
      .scaleOrdinal()
      .domain(slicedData.map((d) => d.keyword))
      .range(d3.schemeTableau10);

    // Append the rectangles for the bar chart
    svg
      .selectAll(".bar")
      .data(slicedData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("y", function (d) {
        return y(d.keyword);
      })
      .attr("height", y.bandwidth())
      .attr("x", 0)
      .attr("width", function (d) {
        return x(d.count);
      })
      .style("fill", function (d) {
        return color(d.keyword);
      });

    // Add the y Axis
    svg
      .append("g")
      .attr("transform", "translate(0,0)")
      .call(d3.axisLeft(y).tickSize(0));

    // Add the x Axis
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add labels on the bars for the x-axis
    svg
      .selectAll(".bar-label")
      .data(slicedData)
      .enter()
      .append("text")
      .attr("class", "bar-label")
      .attr("x", (d) => x(d.count) + 5)
      .attr("y", (d) => y(d.keyword) + y.bandwidth() / 2)
      .attr("dy", "0.35em")
      .text((d) => `${d.count}%`);
  };

  return (
    <div className="pane">
      <div className="header">Amenity Frequency Rankings</div>
      <div className="flex-grow" id={props.chartName}>
        {data.length === 0 ? <Loading /> : <div className={props.chartName} />}
      </div>
    </div>
  );
}
