// components/charts/EraInfo.js
'use client';
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function EraInfo({ 
  data, 
  albumName, 
  totalAvgDanceability,
  genre,
  size = 200 
}) {
  const svgRef = useRef();

  useEffect(() => {
    if (!svgRef.current || !data) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const width = size - margin.left - margin.right;
    const height = size - margin.top - margin.bottom;
    const radius = Math.min(width, height) / 3;

    const svg = d3.select(svgRef.current)
      .append("svg")
      .attr("width", size)
      .attr("height", size)
      .append("g")
      .attr("transform", `translate(${size/2},${size/2-10})`);

    // Calculate average danceability for the era
    const eraDanceability = d3.mean(data, d => +d.danceability);

    // Count songs above and below total average
    const aboveAvg = data.filter(d => +d.danceability > totalAvgDanceability).length;
    const belowAvg = data.length - aboveAvg;
    const pieData = [
      { label: "Above Average", value: aboveAvg },
      { label: "Below Average", value: belowAvg }
    ];

    // Create pie chart
    const pie = d3.pie()
      .value(d => d.value)
      .sort(null);

    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);

    // Colors for pie chart
    const colors = ["#4f364b", "#cabad7"];

    // Add pie chart segments
    const arcs = svg.selectAll("arc")
      .data(pie(pieData))
      .enter()
      .append("g");

    arcs.append("path")
      .attr("d", arc)
      .attr("fill", (d, i) => colors[i])
      .attr("stroke", "white")
      .style("stroke-width", "2px");

    // Add percentage labels
    arcs.append("text")
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .style("fill", "white")
      .style("font-size", "12px")
      .text(d => `${Math.round(d.value / data.length * 100)}%`);

    // Add album name
    svg.append("text")
      .attr("y", -radius - 20)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .text(albumName.replace(" (Taylor's Version)", "").replace(" (Deluxe Edition)", ""));

    // Add info text
    const infoGroup = svg.append("g")
      .attr("transform", `translate(0,${radius + 20})`);

    infoGroup.append("text")
      .attr("y", 0)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .text(`Genre: ${genre}`);

    infoGroup.append("text")
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .text(`Avg Dance: ${(eraDanceability * 100).toFixed(1)}%`);

    // Add tooltip
    const tooltip = d3.select(svgRef.current)
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
    arcs.on("mouseover", function(event, d) {
        d3.select(this)
          .style("opacity", 0.8);
          
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        tooltip.html(`
          ${d.data.label}<br/>
          ${d.data.value} songs (${Math.round(d.data.value / data.length * 100)}%)
        `)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function() {
        d3.select(this)
          .style("opacity", 1);
          
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      });

  }, [data, albumName, totalAvgDanceability, genre, size]);

  return (
    <div ref={svgRef} className="relative" />
  );
}