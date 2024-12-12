// components/ui/ScatterPlot.js
"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

export default function ScatterPlot() {
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [data, setData] = useState(null);

  useEffect(() => {
    // Fetch CSV data from /public directory
    d3.csv("/chart_performance.csv").then((rawData) => {
      const processedData = rawData.map((d) => ({
        title: d.name,
        album_cover: d.album_cover,
        album: d.album,
        danceability: parseFloat(d.danceability),
        peak_rank: parseInt(d.peak_rank, 10),
        average_rank: parseInt(d.average_rank, 10),
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

    // SVG 초기화
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // 스케일 설정
    const xScale = d3
      .scaleLinear()
      .domain([0.3, 1]) // danceability는 0.3-1 사이
      .range([0, width])
      .nice();

    const yScale = d3
      .scaleLinear()
      .domain([200, 1]) // rank는 1이 최상위
      .range([height, 0])
      .nice();

    // 축 설정
    const xAxis = d3.axisBottom(xScale).tickSize(-height).tickPadding(10);

    const yAxis = d3.axisLeft(yScale).tickSize(-width).tickPadding(10);

    // 그리드라인 스타일링
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .attr("class", "grid")
      .selectAll("line")
      .attr("stroke", "rgba(38, 33, 40, 0.2)");

    svg
      .append("g")
      .call(yAxis)
      .attr("class", "grid")
      .selectAll("line")
      .attr("stroke", "rgba(38, 33, 40, 0.2)");

    // 축 레이블 스타일링
    svg.selectAll(".grid path").attr("stroke", "rgba(38, 33, 40, 0.5)");

    svg
      .selectAll(".grid text")
      .attr("fill", "rgba(38, 33, 40, 0.6)")
      .style("font-size", "12px");

    // 툴팁 설정
    const tooltip = d3
      .select(tooltipRef.current)
      .style("position", "absolute") // absolute 대신 fixed 사용
      .style("visibility", "hidden")
      .style("background-color", "rgba(255, 255, 255, 0.9)")
      .style("border-radius", "8px")
      .style("padding", "12px")
      .style("color", "black") // 텍스트 색상 추가
      .style("pointer-events", "none") // 툴팁이 마우스 이벤트를 방해하지 않도록
      .style("box-shadow", "0 4px 6px rgba(0, 0, 0, 0.1)")
      .style("z-index", "9999"); // z-index 높임

    // 데이터 포인트 그리기
    svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.danceability))
      .attr("cy", (d) => yScale(d.peak_rank))
      .attr("r", 8)
      .attr("fill", "#d86072")
      .attr("opacity", 0.8)
      .style("cursor", "pointer")
      .on("mouseover", function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 12)
          .attr("opacity", 1);

        const [mouseX, mouseY] = d3.pointer(event, svgRef.current); // SVG 내 좌표 계산
        const tooltipWidth = tooltip.node().offsetWidth;
        const tooltipHeight = tooltip.node().offsetHeight;
        const padding = 10;

        let left = mouseX + padding;
        let top = mouseY - padding;

        // 화면 경계를 넘어가지 않도록 조정
        if (left + tooltipWidth > dimensions.width) {
          left = dimensions.width - tooltipWidth - padding;
        }
        if (top < tooltipHeight) {
          top = tooltipHeight + padding;
        }

        tooltip
          .html(
            `
            <div class="flex items-center gap-3 min-w-[300px] z-50">
              <img src="${d.album_cover}" alt="${
              d.album
            }" class="w-16 h-16" />
              <div>
                <p class="text-obsidian font-bold">${d.title}</p>
                <p class="text-slate-400 text-sm">${d.album}</p>
                <p class="text-cherry text-sm">Danceability: ${d.danceability.toFixed(
                  3
                )}</p>
                <p class="text-cherry text-sm">Peak Rank: ${d.peak_rank}</p>
                <p class="text-cherry text-sm">Average Rank: ${d.average_rank}</p>
              </div>
            </div>
          `
          )
          .style("visibility", "visible")
          .style("left", `${left}px`)
          .style("top", `${top}px`);
      })
      .on("mousemove", function (event) {
        const [mouseX, mouseY] = d3.pointer(event, svgRef.current); // SVG 내 좌표 계산
        const tooltipWidth = tooltip.node().offsetWidth;
        const tooltipHeight = tooltip.node().offsetHeight;
        const padding = 10;

        let left = mouseX + padding;
        let top = mouseY - padding;

        // 화면 경계를 넘어가지 않도록 조정
        if (left + tooltipWidth > dimensions.width) {
          left = dimensions.width - tooltipWidth - padding;
        }
        if (top < tooltipHeight) {
          top = tooltipHeight + padding;
        }

        tooltip.style("left", `${left}px`).style("top", `${top}px`);
      })
      .on("mouseout", function () {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 8)
          .attr("opacity", 0.7);

        tooltip.style("visibility", "hidden"); // 툴팁 숨김 처리
      });

    // 축 레이블 추가
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
  }, [data, dimensions]);

  return (
    <div className="relative w-full h-full rounded-lg p-4">
      <svg ref={svgRef} className="w-full h-full" />
      <div ref={tooltipRef} className="tooltip" />
    </div>
  );
}
