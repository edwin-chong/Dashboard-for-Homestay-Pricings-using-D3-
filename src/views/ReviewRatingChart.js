import React, { useEffect } from "react";
import { useDataContext } from "../context/DataContext";
import * as d3 from "d3";
import Loading from "../util/Loading";

export default function ReviewRatingChart(props) {
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
    const aggregatedData = d3.group(tmpData, (d) => d.review_rating); // Extract month from date

    // Calculate the average temperature for each month
    aggregatedData.forEach((values, t) => {
      const avg = d3.mean(values, (d) => d.price);
      aggregatedData.set(t, avg.toFixed(2));
    });

    // Convert the map to an array of objects
    const data = Array.from(aggregatedData, ([t, avg]) => ({
      review_rating: t,
      avg_price: +avg,
    }));

    const element = document.getElementById(props.chartName);
    const margin = { top: 20, right: 20, bottom: 20, left: 30 };
    const width = element.offsetWidth - margin.left - margin.right;
    const height = element.offsetHeight - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3
      .select(`.${props.chartName}`)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // X axis: scale and draw:
    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.review_rating)])
      .range([0, width]);
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

    // set the parameters for the histogram
    const histogram = d3
      .bin()
      .value(function (d) {
        return d.review_rating;
      }) // I need to give the vector of value
      .domain(x.domain()) // then the domain of the graphic
      .thresholds(x.ticks(40)); // then the numbers of bins

    // And apply this function to data to get the bins
    const bins = histogram(data);
    bins.forEach((element) => {
      let tmp_avg = 0;
      let count = 0;
      element.forEach((value) => {
        if (value.avg_price) {
          tmp_avg += value.avg_price;
          count++;
        }
      });
      if (count != 0) {
        element["avg_price"] = (tmp_avg / count).toFixed(2);
      } else {
        element["avg_price"] = 0;
      }
    });

    // Y axis: scale and draw:
    const y = d3.scaleLinear().range([height, 0]);
    let yMax = d3.max(bins, function (d) {
      return +d.avg_price;
    });
    y.domain([0, yMax + yMax / 10]); // d3.hist has to be called before the Y axis obviously
    svg.append("g").call(d3.axisLeft(y));
    // append the bar rectangles to the svg element

    const tooltip = d3
      .select(`.${props.chartName}`)
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "black")
      .style("color", "white")
      .style("border-radius", "5px")
      .style("padding", "8px");

    const showTooltip = function (event, d) {
      tooltip.transition().duration(100).style("opacity", 1);
      tooltip
        .html(`Range: ${d.x0} - ${d.x1} <br/> Average Price: $${d.avg_price}`)
        .style("left", event.x - 100 + "px")
        .style("top", event.y - 80 + "px");
    };

    const moveTooltip = function (event, d) {
      tooltip
        .style("left", event.x - 20 + "px")
        .style("top", event.y - 80 + "px");
    };
    // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
    const hideTooltip = function (event, d) {
      tooltip.transition().duration(100).style("opacity", 0);
    };

    svg
      .selectAll("rect")
      .data(bins)
      .join("rect")
      .attr("x", 1)
      .attr("transform", function (d) {
        return `translate(${x(d.x0)}, ${y(d.avg_price)})`;
      })
      .attr("width", function (d) {
        return x(d.x1) - x(d.x0);
      })
      .attr("height", function (d) {
        return height - y(d.avg_price);
      })
      .style("fill", "#69b3a2")
      .on("mouseover", showTooltip)
      .on("mousemove", moveTooltip)
      .on("mouseleave", hideTooltip);
  };

  return (
    <div className="pane">
      <div className="header">Review Rating vs Average Price</div>
      <div className="flex-grow" id={props.chartName}>
        {data.length === 0 ? <Loading /> : <div className={props.chartName} />}
      </div>
    </div>
  );
}
