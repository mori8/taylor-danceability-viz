// components/ui/CorrelationNetwork.js
'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function CorrelationNetwork() {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // 데이터 준비
    const nodes = [
      { id: "danceability", group: "center" },
      { id: "energy", group: "highlight" },
      { id: "loudness", group: "highlight" },
      { id: "valence", group: "highlight" },
      { id: "tempo", group: "normal" },
      { id: "speechiness", group: "normal" },
      { id: "acousticness", group: "normal" },
      { id: "instrumentalness", group: "normal" },
      { id: "liveness", group: "normal" },
      { id: "popularity", group: "normal" }
    ];

    const links = [
      { source: "danceability", target: "energy", value: 0.29 },
      { source: "danceability", target: "loudness", value: 0.43 },
      { source: "danceability", target: "valence", value: 0.46 },
      { source: "danceability", target: "tempo", value: 0.08 },
      { source: "danceability", target: "speechiness", value: 0.15 },
      { source: "danceability", target: "acousticness", value: -0.34 },
      { source: "danceability", target: "instrumentalness", value: -0.23 },
      { source: "danceability", target: "liveness", value: 0.12 },
      { source: "danceability", target: "popularity", value: 0.13 }
    ];

    // SVG 설정
    const width = 800;
    const height = 600;

    d3.select(svgRef.current).selectAll("*").remove();
    
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // 색상 설정
    const nodeColor = d => {
      switch(d.group) {
        case 'center': return '#1DB954';  // Spotify green
        case 'highlight': return '#522959';  // Purple
        default: return '#979dab';  // Gray
      }
    };

    // Force simulation 설정
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links)
        .id(d => d.id)
        .distance(d => (1 - Math.abs(d.value)) * 200))  // 상관관계가 강할수록 가까이
      .force("charge", d3.forceManyBody().strength(-1000))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(50));

    // 링크 그리기
    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", d => d.value > 0 ? "#522959" : "#979dab")
      .attr("stroke-opacity", d => Math.abs(d.value))
      .attr("stroke-width", d => Math.abs(d.value) * 5);

    // 노드 컨테이너 생성
    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    // 노드 원 그리기
    node.append("circle")
      .attr("r", d => d.group === "center" ? 40 : 30)
      .attr("fill", nodeColor)
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .attr("opacity", 0.8);

    // 노드 텍스트 추가
    node.append("text")
      .text(d => d.id)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "white")
      .attr("font-size", d => d.group === "center" ? "14px" : "12px")
      .attr("font-weight", d => d.group === "center" ? "bold" : "normal");

    // 툴팁 설정
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background-color', 'rgba(0, 0, 0, 0.9)')
      .style('color', 'white')
      .style('padding', '8px')
      .style('border-radius', '4px')
      .style('font-size', '12px');

    // 호버 이벤트
    node
      .on("mouseover", function(event, d) {
        const correlations = links
          .filter(link => link.source.id === d.id || link.target.id === d.id)
          .map(link => {
            const otherNode = link.source.id === d.id ? link.target.id : link.source.id;
            return `${otherNode}: ${link.value.toFixed(3)}`;
          })
          .join('<br>');

        tooltip
          .style('visibility', 'visible')
          .html(`<strong>${d.id}</strong><br>${correlations}`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on("mouseout", () => tooltip.style('visibility', 'hidden'));

    // 시뮬레이션 업데이트
    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    // 드래그 함수들
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

  }, []);

  return (
    <div className="relative w-full max-w-4xl mx-auto bg-gray-900 rounded-xl p-6">
      <svg ref={svgRef} className="w-full" />
    </div>
  );
}