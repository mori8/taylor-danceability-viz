// components/charts/DanceabilityChart.js
'use client';
import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const albumColors = {
  'Lover': '#f7b0cc',
  'Fearless (Taylor\'s Version)': '#efc180',
  'evermore (deluxe version)': '#c5ac90',
  'reputation': '#000003',
  'Speak Now (Taylor\'s Version)': '#bea7c4',
  'Red (Taylor\'s Version)': '#7a2e39',
  'folklore (deluxe version)': '#d1cec7',
  '1989 (Deluxe Edition)': '#b5e5f8',
  'Midnights': '#242e47'
};

const formatAlbumName = (name) => {
  return name
    .replace(" (Taylor's Version)", "")
    .replace(" (Deluxe Edition)", "")
    .replace(" (deluxe version)", "");
};

export default function DanceabilityChart({ highlightedIds = [] }) {
  const chartRef = useRef();
  const [data, setData] = useState(null);

  useEffect(() => {
    d3.csv("/tour_setlist.csv").then((rawData) => {
      const processedData = rawData
        .filter(row => row.danceability)
        .map((row, index) => ({
          ...row,
          danceability: parseFloat(row.danceability),
          id: index
        }));
      setData(processedData);
    });
  }, []);

  useEffect(() => {
    if (!chartRef.current || !data) return;

    // Clear previous chart
    d3.select(chartRef.current).selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 10, left: 60 };
    const containerWidth = window.innerWidth;
    const width = containerWidth - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    const svg = d3.select(chartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales
    const x = d3.scaleLinear()
      .domain([0, data.length - 1])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, 1])
      .range([height, 0]);

    // Draw album background sections
    let currentAlbum = data[0].album;
    let startX = 0;

    data.forEach((_, i) => {
      if (i === data.length - 1 || data[i + 1]?.album !== currentAlbum) {
        svg.append("rect")
          .attr("x", x(startX))
          .attr("y", 0)
          .attr("width", x(i + 0.5) - x(startX))
          .attr("height", height)
          .attr("fill", albumColors[currentAlbum])
          .attr("opacity", 0.6);

        svg.append("text")
          .attr("x", x(startX + (i - startX) / 2) + 8)
          .attr("y", height - 10)
          .attr("text-anchor", "middle")
          .attr("fill", "#000")
          .attr("opacity", 0.4)
          .attr("font-size", "12px")
          .text(formatAlbumName(currentAlbum));

        if (i < data.length - 1) {
          currentAlbum = data[i + 1].album;
          startX = i + 0.5;
        }
      }
    });

    // Add Y axis
    svg.append("g")
      .call(d3.axisLeft(y)
        .ticks(5))
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line")
        .attr("x2", width)
        .attr("stroke-opacity", 0.1));

    // Create line generator
    const line = d3.line()
      .x(d => x(d.id))
      .y(d => y(d.danceability))
      .curve(d3.curveMonotoneX);

    // Add the line path with lowered opacity for non-highlighted sections
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#4f364b")
      .attr("stroke-width", 2)
      .attr("opacity", 0.6) // Lower base opacity
      .attr("d", line);

    // Add points
    const points = svg.selectAll(".point")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "point")
      .attr("cx", d => x(d.id))
      .attr("cy", d => y(d.danceability))
      .attr("r", d => highlightedIds.includes(d.id) ? 10 : 4)
      .attr("fill", d => highlightedIds.includes(d.id) ? "#db3e1d" : "#4f364b")
      .attr("stroke", d => highlightedIds.includes(d.id) ? "rgba(219, 62, 29, 0.5)" : "#f7e9de")
      .attr("stroke-width", d => highlightedIds.includes(d.id) ? 8 : 1)
      .style("transition", "all 0.3s ease");

    // Add tooltip
    const tooltip = d3.select(chartRef.current)
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", "rgba(0, 0, 0, 0.8)")
      .style("color", "white")
      .style("padding", "8px")
      .style("border-radius", "4px")
      .style("pointer-events", "none")
      .style("font-size", "12px")
      .style("z-index", "1000");

    points
      .on("mouseover", function(event, d) {
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        tooltip.html(`
          <b>${d.name}</b><br/>
          Danceability: ${d.danceability}<br/>
          Era: ${formatAlbumName(d.album)}
        `)
          .style("left", (d3.pointer(event)[0] + 72) + "px")
          .style("top", (d3.pointer(event)[1] + 172) + "px")
          .style("cursor", "pointer");
      })
      .on("mouseout", function() {
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      });

  }, [data, highlightedIds]); // highlightedIds를 의존성 배열에 추가

  if (!data) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tertiary"></div>
      </div>
    );
  }

  return (
    <div 
      ref={chartRef} 
      className="w-full overflow-x-auto bg-opacity-50 rounded-lg"
    />
  );
}