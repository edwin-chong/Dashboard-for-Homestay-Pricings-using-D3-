import React, { useEffect } from "react";
import { useDataContext } from "../context/DataContext";
import * as d3 from "d3";
import Loading from "../util/Loading";

export default function AmenitiesChart(props) {
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
    const key = props.amenKey;
    const aggregatedData = d3.group(tmpData, (d) => d[key]); // Extract month from date

    // Calculate the average temperature for each month
    aggregatedData.forEach((values, t) => {
      const avg_price = d3.mean(values, (d) => d.price);
      aggregatedData.set(t, avg_price.toFixed(2));
    });

    // Convert the map to an array of objects
    const clean_data = Array.from(aggregatedData, ([t, avg_price]) => ({
      amenity: t == 1 ? key : `No ${key.replaceAll("_", " ")}`,
      avg_price: +avg_price,
    }));

    const element = document.getElementById(props.chartName);
    const margin = { top: 20, right: 20, bottom: 20, left: 30 };
    const width = element.offsetWidth - margin.left - margin.right;
    const height = element.offsetHeight - margin.top - margin.bottom;

    clean_data.sort((a, b) => {
      if (a.amenity.includes("No ")) {
        return 1;
      } else {
        return -1;
      }
    });

    var color = d3
      .scaleOrdinal()
      .domain(
        clean_data.map(function (d) {
          return d.amenity;
        })
      )
      .range(d3.schemeTableau10);

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
      clean_data.map(function (d) {
        return d.amenity;
      })
    );
    let yMax = d3.max(clean_data, function (d) {
      return d.avg_price;
    });
    y.domain([0, yMax + yMax / 10]);

    // append the rectangles for the bar chart
    svg
      .selectAll(".bar")
      .data(clean_data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function (d) {
        return x(d.amenity);
      })
      .attr("width", x.bandwidth())
      .attr("y", function (d) {
        return y(d.avg_price);
      })
      .attr("height", function (d) {
        return height - y(d.avg_price);
      })
      .style("fill", function (d) {
        return color(d.amenity);
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
      .data(clean_data)
      .enter()
      .append("text")
      .attr("class", "bar-label")
      .attr("x", (d) => x(d.amenity) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.avg_price) - 5)
      .attr("text-anchor", "middle")
      .text((d) => `$${d.avg_price}`);

    // Create groups for each legend item

    if (clean_data.length > 0) {
      const increase =
        ((clean_data[0].avg_price - clean_data[1].avg_price) /
          clean_data[1].avg_price) *
        100;

      // Create a background shape (rectangle) for the text element
      const textBackground = svg
        .append("rect")
        .attr("x", width - 40) // Adjust for padding
        .attr("y", -16) // Adjust for padding
        .attr("rx", 4) // Set corner radius
        .attr("ry", 4) // Set corner radius
        .attr("width", 60) // Adjust to your preferred width
        .attr("height", 20) // Adjust to your preferred height
        .style("fill", increase > 0 ? "Green" : "Red"); // Set the background color

      // Create text elements at the random positions
      const randomText = svg
        .append("text")
        .attr("x", width - 35)
        .attr("y",-5)
        .text(
          `${
            increase > 0 ? "+" + increase.toFixed(2) : increase.toFixed(2)
          }%`
        )
        .style("fill", "white")
        .style("font-size", "12px")
        .style("alignment-baseline", "middle")
        .style("pointer-events", "none");

      // Make sure text is displayed above the background shape
      randomText.raise();
    }
  };

  return (
    <div className="pane">
      <div className="header" style={{ textTransform: "capitalize" }}>
        {props.amenKey.replaceAll("_", " ")} vs Price
      </div>
      <div className="flex-grow" id={props.chartName}>
        {data.length === 0 ? <Loading /> : <div className={props.chartName} />}
      </div>
    </div>
  );
}
