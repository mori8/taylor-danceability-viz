// components/charts/StackedBarChart.js
"use client";
import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function StackedBarChart({
  data,
  ordering = "release",
  animating = false,
}) {
  const chartRef = useRef();

  useEffect(() => {
    if (!chartRef.current || !data) return;

    // Clear previous chart
    d3.select(chartRef.current).selectAll("*").remove();

    const margin = { top: 40, right: 60, bottom: 60, left: 0 };
    const containerWidth = window.innerWidth;
    const width = containerWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Process data for stacking
    const processedData = data.map((d) => {
      const totalSongs = d.aboveAverage + d.belowAverage;
      return {
        album: d.album
          .replace(" (Taylor's Version)", "")
          .replace(" (deluxe edition)", "")
          .replace(" (Deluxe Edition)", "")
          .replace(" (The Til Dawn Edition)", ""),
        "Below Average": (d.belowAverage / totalSongs) * 100,
        "Above Average": (d.aboveAverage / totalSongs) * 100,
      };
    });

    // Sort data based on ordering type
    const orderedData =
      ordering === "release"
        ? processedData.sort((a, b) => {
            const releasedOrder = {
              Fearless: 1,
              "Speak Now": 2,
              Red: 3,
              1989: 4,
              reputation: 5,
              Lover: 6,
              folklore: 7,
              evermore: 8,
              Midnights: 9,
            };
            return releasedOrder[a.album] - releasedOrder[b.album];
          })
        : processedData.sort((a, b) => {
            const tourOrder = {
              Lover: 1,
              Fearless: 2,
              evermore: 3,
              reputation: 4,
              "Speak Now": 5,
              Red: 6,
              folklore: 7,
              1989: 8,
              Midnights: 9,
            };
            return tourOrder[a.album] - tourOrder[b.album];
          });

    // Stack the data
    const stack = d3
      .stack()
      .keys(["Above Average", "Below Average"])
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetNone);

    const stackedData = stack(orderedData);

    // Create scales
    const x = d3.scaleBand().range([0, width]).padding(0.12); // Reduced padding value

    const y = d3.scaleLinear().range([height, 0]);

    // Set domains
    x.domain(orderedData.map((d) => d.album));
    y.domain([0, 100]);

    // Add X axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("", "middle")
      .attr("dx", "-.8em")
      .attr("dy", ".15em");

    // Add Y axis
    svg.append("g").call(d3.axisLeft(y).ticks(5));

    // Color scale
    const color = d3
      .scaleOrdinal()
      .domain(["Above Average", "Below Average"])
      .range(["#db3e1d", "#dbbdab"]);

    // Create bars
    const bars = svg
      .append("g")
      .selectAll("g")
      .data(stackedData)
      .enter()
      .append("g")
      .attr("fill", (d) => color(d.key));

    // Add bars with transition
    bars
      .selectAll("rect")
      .data((d) => d)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.data.album))
      .attr("width", x.bandwidth() * 1) // Adjusted width
      .attr("y", height)
      .attr("height", 0)
      .transition()
      .duration(1000)
      .attr("y", (d) => y(d[1]))
      .attr("height", (d) => y(d[0]) - y(d[1]));

    // Add line for "Above Average"
    const line = d3
      .line()
      .curve(d3.curveBumpX)
      .x((d) => x(d.album) + x.bandwidth() / 2)
      .y((d) => y(d["Above Average"]));

    svg
      .append("path")
      .datum(orderedData)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 1.5)
      .attr("d", line);

    // Add points and labels for "Above Average"
    svg
      .selectAll(".point")
      .data(orderedData)
      .enter()
      .append("circle")
      .attr("cx", (d) => x(d.album) + x.bandwidth() / 2)
      .attr("cy", (d) => y(d["Above Average"]))
      .attr("r", 3)
      .attr("fill", "black");

    svg
      .selectAll(".label")
      .data(orderedData)
      .enter()
      .append("text")
      .attr("x", (d) => x(d.album) + x.bandwidth() / 2)
      .attr("y", (d) => y(d["Above Average"]) + 20)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .attr("fill", "#f7e9d2")
      .text((d) => d["Above Average"].toFixed(1) + "%");

    // Add legend
    const legend = svg
      .append("g")
      .attr("font-size", "10px")
      .attr("text-anchor", "start")
      .selectAll("g")
      .data(color.domain().slice().reverse())
      .enter()
      .append("g")
      .attr("transform", (d, i) => `translate(0,${i * 20 - 20})`);

    legend
      .append("rect")
      .attr("x", width - 49)
      .attr("y", -20)
      .attr("width", 12)
      .attr("height", 12)
      .attr("fill", color);

    legend
      .append("text")
      .attr("x", width - 54)
      .attr("y", -14)
      .attr("dy", "0.32em")
      .text((d) => d)
      .style("text-anchor", "end");
  }, [data, ordering, animating]);

  return (
    <div
      ref={chartRef}
      className="w-full overflow-x-auto bg-opacity-50 rounded-lg"
    />
  );
}
