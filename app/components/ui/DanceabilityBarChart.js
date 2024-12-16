// components/charts/DanceabilityBarChart.js
'use client';
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function DanceabilityBarChart({ data, ordering = 'release', animating = false }) {
  const chartRef = useRef();

  useEffect(() => {
    if (!chartRef.current || !data) return;

    // Clear previous chart
    d3.select(chartRef.current).selectAll("*").remove();

    const margin = { top: 40, right: 30, bottom: 60, left: 60 };
    const containerWidth = window.innerWidth;
    const width = containerWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(chartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Process data
    const processedData = data.map(d => ({
      album: d.album.replace(" (Taylor's Version)", "").replace(" (Deluxe Edition)", "").replace(" (deluxe version)", ""),
      avgDanceability: d.avgDanceability
    }));

    // Sort data based on ordering type
    const orderedData = ordering === 'release' ? 
      processedData : 
      processedData.sort((a, b) => {
        const tourOrder = {
          "Lover": 1, "Fearless": 2, "evermore": 3, 
          "reputation": 4, "Speak Now": 5, "Red": 6,
          "folklore": 7, "1989": 8, "Midnights": 9
        };
        return tourOrder[a.album] - tourOrder[b.album];
      });

    // Create scales
    const x = d3.scaleBand()
      .range([0, width])
      .padding(0.3)
      .domain(orderedData.map(d => d.album));

    const y = d3.scaleLinear()
      .range([height, 0])
      .domain([0.3, 0.7]); // Updated domain to 20% - 80%

    // Add X axis
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)")
      .style("font-size", "12px");

    // Add Y axis
    svg.append("g")
      .call(d3.axisLeft(y)
        .ticks(5)
        .tickFormat(d => (d * 100) + "%"))
      .style("font-size", "12px");

    // Add horizontal grid lines
    svg.append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(y)
        .ticks(5)
        .tickSize(-width)
        .tickFormat(""))
      .style("stroke-opacity", 0.1);

    // Add bars with animation
    svg.selectAll("rect")
      .data(orderedData)
      .enter()
      .append("rect")
      .attr("x", d => x(d.album))
      .attr("width", x.bandwidth())
      .attr("y", height)
      .attr("height", 0)
      .transition()
      .duration(1000)
      .attr("y", d => y(d.avgDanceability))
      .attr("height", d => height - y(d.avgDanceability))
      .attr("fill", "#4f364b");

    // Add value labels on top of bars
    svg.selectAll(".value-label")
      .data(orderedData)
      .enter()
      .append("text")
      .attr("class", "value-label")
      .attr("x", d => x(d.album) + x.bandwidth() / 2)
      .attr("y", d => y(d.avgDanceability) - 5)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("opacity", 0)
      .text(d => (d.avgDanceability * 100).toFixed(1) + "%")
      .transition()
      .delay(1000)
      .duration(500)
      .style("opacity", 1);

    // Add title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", -margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text("Average Danceability by Album");

  }, [data, ordering, animating]);

  return (
    <div 
      ref={chartRef} 
      className="w-full overflow-x-auto bg-opacity-50 rounded-lg"
    />
  );
}