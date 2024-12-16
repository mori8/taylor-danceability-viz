// components/charts/EraGraph.js
'use client';
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function EraGraph({ data, albumName, color, size = 200 }) {
  const graphRef = useRef();

  useEffect(() => {
    if (!graphRef.current || !data) return;

    // Clear previous graph
    d3.select(graphRef.current).selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom: 30, left: 30 };
    const width = size - margin.left - margin.right;
    const height = size - margin.top - margin.bottom;

    const svg = d3.select(graphRef.current)
      .append("svg")
      .attr("width", size)
      .attr("height", size)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales
    const x = d3.scaleLinear()
      .domain([1, d3.max(data, d => d.track_number)])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, 1])
      .range([height, 0]);

    // Add X axis
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5));

    // Add Y axis
    svg.append("g")
      .call(d3.axisLeft(y).ticks(5));

    // Create line generator
    const line = d3.line()
      .x(d => x(d.track_number))
      .y(d => y(d.danceability))
      .curve(d3.curveMonotoneX);

    // Add the line
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 1.5)
      .attr("d", line);

    // Add points
    svg.selectAll(".point")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "point")
      .attr("cx", d => x(d.track_number))
      .attr("cy", d => y(d.danceability))
      .attr("r", 3)
      .attr("fill", color);

    // Add title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", -5)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .text(albumName);

    // Add tooltip
    const tooltip = d3.select(graphRef.current)
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", "rgba(0, 0, 0, 0.8)")
      .style("color", "white")
      .style("padding", "5px")
      .style("border-radius", "3px")
      .style("font-size", "12px");

    // Add hover effects
    svg.selectAll(".point")
      .on("mouseover", function(event, d) {
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        tooltip.html(`
          Track ${d.track_number}: ${d.name}<br/>
          Danceability: ${(d.danceability * 100).toFixed(1)}%
        `)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");

        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 5);
      })
      .on("mouseout", function() {
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);

        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 3);
      });

  }, [data, albumName, size]);

  return (
    <div ref={graphRef} className="relative" />
  );
}