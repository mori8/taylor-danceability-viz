"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

export default function ScatterPlot({ highlightedSongs = [] }) {
  const svgRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [data, setData] = useState(null);
  const [playingSong, setPlayingSong] = useState(null);

  useEffect(() => {
    d3.csv("/chart_performance.csv").then((rawData) => {
      const processedData = rawData.map((d) => ({
        title: d.name,
        album_cover: d.album_cover,
        album: d.album,
        danceability: parseFloat(d.danceability),
        peak_rank: parseInt(d.peak_rank, 10),
        average_rank: parseInt(d.average_rank, 10),
        audio: new Audio(`/audio/${d.name}.mp3`), // assuming the audio files are named after the song titles
      }));
      setData(processedData);
    });
  }, []);

  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth * 0.6;
      const height = window.innerHeight * 0.7;
      setDimensions({ width, height });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    if (!data || !dimensions.width || !dimensions.height) return;

    const margin = { top: 40, right: 40, bottom: 60, left: 60 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .style("border", "none")
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear().domain([0.3, 1]).range([0, width]).nice();
    const yScale = d3.scaleLinear().domain([200, 1]).range([height, 0]).nice();

    const xAxis = d3.axisBottom(xScale).tickSize(-height).tickPadding(10);
    const yAxis = d3.axisLeft(yScale).tickSize(-width).tickPadding(10);

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .attr("class", "grid")
      .selectAll("line")
      .attr("stroke", "rgba(38, 33, 40, 0.13)");

    svg
      .append("g")
      .call(yAxis)
      .attr("class", "grid")
      .selectAll("line")
      .attr("stroke", "rgba(38, 33, 40, 0.13)");

    svg
      .selectAll(".grid path")
      .attr("stroke", "rgba(255, 246, 238, 0)")
      .attr("stroke-width", 1);

    svg
      .selectAll(".grid text")
      .attr("fill", "rgba(38, 33, 40, 0.6)")
      .style("font-size", "12px");

    svg
      .append("line")
      .attr("x1", xScale(0.55))
      .attr("y1", yScale(0))
      .attr("x2", xScale(0.82))
      .attr("y2", yScale(200))
      .attr("stroke", "rgba(214, 220, 130, 1)")
      .attr("opacity", 0.8)
      .attr("stroke-dasharray", "5")
      .attr("stroke-width", 2);

    const circles = svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.danceability))
      .attr("cy", (d) => yScale(d.peak_rank))
      .attr("r", 8)
      .attr("fill", "#d86072")
      .attr("opacity", highlightedSongs.length > 0 ? 0.3 : 0.7)
      .style("cursor", (d) =>
        highlightedSongs.includes(d.title) ? "pointer" : "default"
      )
      .style("transition", "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)");

    svg
      .selectAll("text.song-title")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "song-title")
      .attr("opacity", (d) => {
      if (highlightedSongs.length === 0) return 0.5;
      return highlightedSongs.includes(d.title) ? 0.8 : 0.3;
      })
      .attr("x", (d) => xScale(d.danceability) - 16)
      .attr("y", (d) => yScale(d.peak_rank) + 4)
      .attr("text-anchor", "end")
      .attr("fill", "black")
      .style("font-size", "10px")
      .style("transition", "opacity 0.5s ease")
      .style("font-weight", (d) => (highlightedSongs.includes(d.title) ? "bold" : "normal"))
      .text((d) => d.title);

    circles.each(function (d) {
      const circle = d3.select(this);
      if (highlightedSongs.length === 0) {
        circle
          .transition()
          .duration(800)
          .ease(d3.easeCubicOut)
          .attr("r", 8)
          .attr("opacity", 0.7)
          .attr("stroke", "none")
          .attr("stroke-width", 0);
      } else if (highlightedSongs.includes(d.title)) {
        circle
          .transition()
          .duration(800)
          .ease(d3.easeCubicOut)
          .attr("r", 16)
          .attr("opacity", 1)
          .attr("stroke", "rgba(216, 96, 114, 0.4)")
          .attr("stroke-width", 4);

        // Add play/pause button
        svg
          .append("text")
          .attr("class", "play-pause-button")
          .attr("x", xScale(d.danceability) + 1)
          .attr("y", yScale(d.peak_rank) + 2)
          .attr("text-anchor", "middle")
          .attr("alignment-baseline", "middle")
          .attr("transform", "translate(-50%, -50%)")
          .attr("fill", "white")
          .style("font-size", "16px")
          .style("cursor", "pointer")
          .text(() => (playingSong?.title === d.title ? "⏸" : "▶"))
          .on("click", function () {
            if (playingSong && playingSong.title === d.title) {
              playingSong.audio.pause();
              setPlayingSong(null);
            } else {
              if (playingSong) {
                playingSong.audio.pause();
              }
              d.audio.play();
              setPlayingSong(d);
              d3.select(this).text("⏸");
            }
          });
      } else {
        circle
          .transition()
          .duration(800)
          .ease(d3.easeCubicOut)
          .attr("r", 8)
          .attr("opacity", 0.3)
          .attr("stroke", "none")
          .attr("stroke-width", 0);
      }
    });

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 10)
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .text("Danceability");

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 15)
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .text("Peak Chart Position");
  }, [data, dimensions, highlightedSongs, playingSong]);

  return (
    <div className="relative w-full h-full rounded-lg p-4">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
}