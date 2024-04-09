import React, { useEffect } from "react";
import { useDataContext } from "../context/DataContext";
import * as d3 from "d3";
import Loading from "../util/Loading";

export default function TourismScatter(props) {
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
    const filteredData = tmpData.filter((value) => value.review_rating != 0);
    const element = document.getElementById(props.chartName);
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const width = element.offsetWidth - margin.left - margin.right;
    const height = element.offsetHeight - margin.top - margin.bottom;

    // append the svg object to the body of the page
    let svg = d3
      .select(`.${props.chartName}`)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis
    var x = d3.scaleLinear().range([0, width]);
    let xMax = d3.max(filteredData, function (d) {
      return d.tourist_count;
    });

    x.domain([0, xMax]);

    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(
        d3
          .axisBottom(x)
          .tickSize(-height * 1.3)
          .ticks(10)
      )
      .select(".domain")
      .remove();

    // Add Y axis
    var y = d3.scaleLinear().range([height, 0]).nice();
    let yMax = d3.max(filteredData, function (d) {
      return d.price;
    });
    y.domain([0, yMax]);

    svg
      .append("g")
      .call(
        d3
          .axisLeft(y)
          .tickSize(-width * 1.3)
          .ticks(7)
      )
      .select(".domain")
      .remove();

    // Customization
    svg.selectAll(".tick line").attr("stroke", "#EBEBEB");

    // Add X axis label:
    svg
      .append("text")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height + margin.top - 10)
      .text("Near By Tourist Spot")
      .style("font-size", "10px");

    // Y axis label:
    svg
      .append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", -30)
      .attr("x", margin.top - 15)
      .text("Price")
      .style("font-size", "10px");

    var color = d3
      .scaleOrdinal()
      .domain(
        data.map(function (d) {
          return d.room_type;
        })
      )
      .range(d3.schemeTableau10);

    // Highlight the specie that is hovered
    var highlight = function (event, d) {
      let selected_specie = d.room_type
        .toLowerCase()
        .replaceAll(" ", "_")
        .replaceAll("/", "_");

      d3.selectAll(".dot").transition().duration(200).attr("r", 0);

      d3.selectAll("." + selected_specie)
        .transition()
        .duration(200)
        .attr("r", 7);
    };

    // Highlight the specie that is hovered
    var doNotHighlight = function (event, d) {
      d3.selectAll(".dot").transition().duration(200).attr("r", 5);
    };

    // Add dots
    svg
      .append("g")
      .selectAll("dot")
      .data(filteredData)
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        return x(d.tourist_count);
      })
      .attr("cy", function (d) {
        return y(d.price);
      })
      .attr("r", 5)
      .style("stroke", function (d) {
        return color(d.room_type);
      })
      .attr("class", function (d) {
        return (
          "dot " +
          d.room_type.toLowerCase().replaceAll(" ", "_").replaceAll("/", "_")
        );
      })
      .style("fill", "#fff")
      .style("fill-opacity", "0.1")
      .style("stroke-width", 1.0)
      .on("mouseover", highlight)
      .on("mouseleave", doNotHighlight);

    // Create groups for each legend item
    const legendGroups = svg
      .selectAll(".legend-item")
      .data(color.domain().slice().reverse())
      .enter()
      .append("g")
      .attr("class", "legend-item")

    // Add colored circles
    legendGroups
      .append("circle")
      .attr("cx", width - 45)
      .attr("cy", (d, i) => {
        return (i + 1) * 15 - 45;
      })
      .attr("r", 4)
      .style("fill", color);

    // Add text labels next to the circles
    legendGroups
      .append("text")
      .attr("x", width - 35)
      .attr("y", (d, i) => {
        return (i + 1) * 15 - 45;
      })
      .text((d, i) => d)
      .style("font-size", "10px")
      .attr("alignment-baseline", "middle");
  };

  return (
    <div className="pane">
      <div className="header">
        Number of Near By Tourist Spot vs Average Price
      </div>
      <div className="flex-grow" id={props.chartName}>
        {data.length === 0 ? <Loading /> : <div className={props.chartName} />}
      </div>
    </div>
  );
}
