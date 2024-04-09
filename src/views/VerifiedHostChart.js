import React, { useEffect } from "react";
import { useDataContext } from "../context/DataContext";
import * as d3 from "d3";
import Loading from "../util/Loading";

export default function VerifiedHostChart(props) {
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

    const aggregatedData = d3.group(tmpData, (d) => d.host_identity_verified); // Extract month from date

    // Calculate the average temperature for each month
    aggregatedData.forEach((values, t) => {
      const avg_price = d3.mean(values, (d) => d.price);
      aggregatedData.set(t, avg_price.toFixed(2));
    });

    // Convert the map to an array of objects
    const data = Array.from(aggregatedData, ([t, avg_price]) => ({
      is_superhost: t === "t" ? "Verified" : "Non-Verified",
      avg_price: +avg_price,
    }));

    data.sort((a, b) => {
      if (a.is_superhost.includes("Non")) {
        return 1;
      } else {
        return -1;
      }
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
    let x = d3.scaleBand().range([0, width]).padding(0.1);
    let y = d3.scaleLinear().range([height, 0]);
    x.domain(
      data.map(function (d) {
        return d.is_superhost;
      })
    );
    let yMax = d3.max(data, function (d) {
      return d.avg_price;
    });
    y.domain([0, yMax + yMax / 10]);

    var color = d3
      .scaleOrdinal()
      .domain(data.map((d) => d.is_superhost))
      .range(d3.schemeTableau10);

    // append the rectangles for the bar chart
    svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function (d) {
        return x(d.is_superhost);
      })
      .attr("width", x.bandwidth())
      .attr("y", function (d) {
        return y(d.avg_price);
      })
      .attr("height", function (d) {
        return height - y(d.avg_price);
      })
      .style("fill", (d) => color(d.is_superhost));

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
      .attr("x", (d) => x(d.is_superhost) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.avg_price) - 5)
      .attr("text-anchor", "middle")
      .text((d) => `$${d.avg_price}`);
  };

  return (
    <div className="pane">
      <div className="header">Verified Host vs Avg Price</div>
      <div className="flex-grow" id={props.chartName}>
        {data.length === 0 ? <Loading /> : <div className={props.chartName} />}
      </div>
    </div>
  );
}
