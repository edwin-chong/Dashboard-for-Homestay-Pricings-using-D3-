import React, { useEffect } from "react";
import { useDataContext } from "../context/DataContext";
import * as d3 from "d3";
import Loading from "../util/Loading";

export default function OwnerLineChart(props) {
  const { cHost } = useDataContext();
  const [host, setHost] = cHost;

  useEffect(() => {
    draw(host);

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [host]);

  const handleResize = () => {
    draw(host);
  };

  const draw = (d) => {
    d3.select(`.${props.chartName} > *`).remove();
    const tmpData = d;
    const aggregatedData = d3.group(tmpData, (d) => d.host_since.slice(0, 7)); // Extract month from date

    // Calculate the average temperature for each month
    aggregatedData.forEach((values, t) => {
      aggregatedData.set(t, values.length);
    });

    // Convert the map to an array of objects
    let data = Array.from(aggregatedData, ([t, d]) => ({
      date: d3.timeParse("%Y-%m")(t),
      count: +d,
    }));

    data = d3.filter(data, (d) => d.date != null);

    data.sort((a, b) => {
      let dateA = new Date(a.date + "-01");
      let dateB = new Date(b.date + "-01");
      if (dateA < dateB) return -1;
      if (dateA > dateB) return 1;
      return 0;
    });

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
    let x = d3.scaleTime().range([0, width]);
    x.domain(d3.extent(data, (d) => d.date));

    // add the x Axis
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    let y = d3.scaleLinear().range([height, 0]);
    let yMax = d3.max(data, function (d) {
      return d.count;
    });
    y.domain([0, yMax + yMax / 10]);
    // add the y Axis
    svg.append("g").call(d3.axisLeft(y));
    
    // Add the line
    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#69b3a2")
      .attr("stroke-width", 1.5)
      .attr(
        "d",
        d3
          .line()
          .x((d) => x(d.date))
          .y((d) => y(d.count))
      );

    var Tooltip = d3
      .select(`.${props.chartName}`)
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px");

    // Three function that change the tooltip when user hover / move / leave a cell
    const dateFormatter = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit'});

    const mouseover = function (event, d) {
      Tooltip.style("opacity", 1);
    };
    const mousemove = function (event, d) {
      Tooltip.html(`Date: ${dateFormatter.format(d.date)} </br> Count: ${d.count}`)
        .style("left", `${event.layerX + 10}px`)
        .style("top", `${event.layerY}px`);
    };
    const mouseleave = function (event, d) {
      Tooltip.style("opacity", 0);
    };

    // Add the points
    svg
      .append("g")
      .selectAll("dot")
      .data(data)
      .join("circle")
      .attr("cx", (d) => x(d.date))
      .attr("cy", (d) => y(d.count))
      .attr("r", 3)
      .attr("fill", "#69b3a2")
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);

    // append the rectangles for the bar chart
    // svg
    //   .selectAll(".bar")
    //   .data(data)
    //   .enter()
    //   .append("rect")
    //   .attr("class", "bar")
    //   .attr("x", function (d) {
    //     return x(d.room_type);
    //   })
    //   .attr("width", x.bandwidth())
    //   .attr("y", function (d) {
    //     return y(d.review_count);
    //   })
    //   .attr("height", function (d) {
    //     return height - y(d.review_count);
    //   })

    // Add labels on the bars for the y-axis
    // svg
    //   .selectAll(".bar-label")
    //   .data(data)
    //   .enter()
    //   .append("text")
    //   .attr("class", "bar-label")
    //   .attr("x", (d) => x(d.room_type) + x.bandwidth() / 2)
    //   .attr("y", (d) => y(d.review_count) - 5)
    //   .attr("text-anchor", "middle")
    //   .text((d) => `${d.review_count}`);
  };

  return (
    <div className="pane">
      <div className="header">Onwer Creation Timeline</div>
      <div className="flex-grow" id={props.chartName}>
        {host.length === 0 ? <Loading /> : <div className={props.chartName} />}
      </div>
    </div>
  );
}
