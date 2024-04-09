import React, { useEffect } from "react";
import { useDataContext } from "../context/DataContext";
import * as d3 from "d3";
import Loading from "../util/Loading";

export default function PopularityChart(props) {
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
    const aggregatedData = d3.group(tmpData, (d) => d.room_type); // Extract month from date

    // Calculate the average temperature for each month
    aggregatedData.forEach((values, t) => {
      const avg = d3.mean(values, (d) => d.number_of_reviews);
      aggregatedData.set(t, avg.toFixed(2));
    });

    // Convert the map to an array of objects
    const data = Array.from(aggregatedData, ([t, avg]) => ({
      room_type: t,
      review_count: +avg,
    }));

    data.sort((a, b) => b.review_count - a.review_count);

    const element = document.getElementById(props.chartName);
    const margin = { top: 20, right: 20, bottom: 20, left: 30 };
    const width = element.offsetWidth - margin.left - margin.right;
    const height = element.offsetHeight - margin.top - margin.bottom;

    let svg = d3
      .select(`.${props.chartName}`)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Scale the range of the data in the domains
    let x = d3.scaleBand().range([0, width]).padding(0.1);
    let y = d3.scaleLinear().range([height, 0]);
    x.domain(
      data.map(function (d) {
        return d.room_type;
      })
    );
    let yMax = d3.max(data, function (d) {
      return d.review_count;
    });
    y.domain([0, yMax + yMax / 10]);

    var color = d3
      .scaleOrdinal()
      .domain(data.map((d) => d.room_type))
      .range(d3.schemeTableau10);

    // append the rectangles for the bar chart
    svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function (d) {
        return x(d.room_type);
      })
      .attr("width", x.bandwidth())
      .attr("y", function (d) {
        return y(d.review_count);
      })
      .attr("height", function (d) {
        return height - y(d.review_count);
      })
      .style("fill", function (d) {
        return color(d.room_type);
      });

    // add the x Axis
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // add the y Axis
    svg.append("g").call(d3.axisLeft(y));

    // Add labels on the bars for the y-axis
    svg
      .selectAll(".bar-label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "bar-label")
      .attr("x", (d) => x(d.room_type) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.review_count) - 5)
      .attr("text-anchor", "middle")
      .text((d) => `${d.review_count}`);
  };

  return (
    <div className="pane">
      <div className="header">Room Type vs Average Number of Reviews</div>
      <div className="flex-grow" id={props.chartName}>
        {data.length === 0 ? <Loading /> : <div className={props.chartName} />}
      </div>
    </div>
  );
}
