import React, { useEffect, useRef } from "react";
import { useDataContext } from "../context/DataContext";
import * as d3 from "d3";
import Loading from "../util/Loading";
import cloud from "d3-cloud";

export default function AmenitiesWordle(props) {
  const svgRef = useRef(null);

  const { cKeyword } = useDataContext();
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
    d3.select(`.${props.chartName + "-svg"} > *`).remove();
    const tmpKeyword = d;
    const orgMax = d3.max(tmpKeyword, (d) => d.count);
    const orgMin = d3.min(tmpKeyword, (d) => d.count);

    const desiredMin = 15;
    const desiredMax = 50;

    const element = document.getElementById(props.chartName);
    const margin = { top: 30, right: 0, bottom: 0, left: 0 };
    const width = element.offsetWidth - margin.left - margin.right;
    const height = element.offsetHeight - margin.top - margin.bottom;

    const standardizedArray = tmpKeyword.map((value) => {
      const count = value.count;
      const standardizedValue =
        ((count - orgMin) / (orgMax - orgMin)) * (desiredMax - desiredMin) +
        desiredMin;
      return {
        text: value.keyword,
        size: standardizedValue,
      };
    });

    const layout = cloud()
      .size([width, height])
      .words(standardizedArray)
      .padding(5)
      .rotate(() => ~~(Math.random() * 2) * 90)
      .font("Impact")
      .fontSize((d) => d.size)
      .on("end", renderCloud);

    layout.start();

    function renderCloud(words) {
      const colorScale = d3.scaleOrdinal(d3.schemeCategory10); // Use a categorical color scale
      const svg = d3.select(svgRef.current);
      svg
        .attr("width", layout.size()[0])
        .attr("height", layout.size()[1])
        .append("g")
        .attr(
          "transform",
          "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")"
        )
        .selectAll("text")
        .data(words)
        .enter()
        .append("text")
        .style("fill", (d, i) => colorScale(i))
        .style("font-size", (d) => d.size + "px")
        .style("font-family", "Impact")
        .attr("text-anchor", "middle")
        .attr("transform", (d) => {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text((d) => d.text);
    }
  };

  return (
    <div className="pane">
      <div className="header">Amenities Wordle</div>
      <div className="flex-grow" id={props.chartName}>
        {keyword.length === 0 ? (
          <Loading />
        ) : (
          <div className={props.chartName}>
            <svg ref={svgRef} className={props.chartName + "-svg"} />
          </div>
        )}
      </div>
    </div>
  );
}
