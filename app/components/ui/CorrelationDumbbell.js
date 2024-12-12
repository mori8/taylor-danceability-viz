// components/ui/DumbbellPlot.js
'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function DumbbellPlot() {
 const svgRef = useRef(null);

 const data = [
  { feature: "Valence", correlation: 0.46 },
  { feature: "Loudness", correlation: 0.43 },
  { feature: "Energy", correlation: 0.3 },
  { feature: "Speechiness", correlation: 0.15 },
  { feature: "Popularity", correlation: 0.13 },
  { feature: "Liveness", correlation: 0.12 },
  { feature: "Tempo", correlation: 0.08 },
  { feature: "Instrumentalness", correlation: -0.23 },
  { feature: "Acousticness", correlation: -0.34 }
 ].sort((a, b) => b.correlation - a.correlation);

 useEffect(() => {
  if (!svgRef.current) return;

  // SVG 초기화
  d3.select(svgRef.current).selectAll("*").remove();

  // SVG 설정
  const margin = { top: 0, right: 50, bottom: 20, left: 150 };
  const width = 800 - margin.left - margin.right;
  const height = 450 - margin.top - margin.bottom;

  const svg = d3.select(svgRef.current)
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // 스케일 설정
  const y = d3.scaleBand()
    .range([0, height])
    .domain(data.map(d => d.feature))
    .padding(0.5);

  const x = d3.scaleLinear()
    .range([0, width])
    .domain([-0.5, 0.5])
    .nice();

  // 축 설정
  const xAxis = d3.axisBottom(x)
    .tickSize(-height)
    .tickFormat(d => d === 0 ? "" : d.toFixed(1));

  // x축 그리기
  svg.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(xAxis)
    .call(g => {
     g.selectAll('.domain').remove();
     g.selectAll('.tick line')
      .attr('stroke', 'rgba(38, 33, 40, 0.1)');
     g.selectAll('.tick text')
      .attr('fill', 'rgba(38, 33, 40, 0.6)')
      .attr('font-size', '12px');
    });

  // 중심선 (0) 강조
  svg.append('line')
    .attr('x1', x(0))
    .attr('x2', x(0))
    .attr('y1', 0)
    .attr('y2', height)
    .attr('stroke', 'rgba(38, 33, 40, 0.3)')
    .attr('stroke-width', 1);

  // 선 그리기
  const lines = svg.selectAll('.correlation-line')
    .data(data)
    .enter()
    .append('line')
    .attr('class', 'correlation-line')
    .attr('x1', x(0))
    .attr('x2', d => x(d.correlation))
    .attr('y1', d => y(d.feature))
    .attr('y2', d => y(d.feature))
    .attr('stroke', d => d.correlation >= 0.3 ? 'rgba(216, 96, 114, 1)' : '#979dab')
    .attr('stroke-width', 2)
    .attr('opacity', 0);

  // 원 그리기
  const circles = svg.selectAll('.correlation-circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'correlation-circle')
    .attr('cx', d => x(d.correlation))
    .attr('cy', d => y(d.feature))
    .attr('r', 8)
    .attr('fill', d => ['Valence', 'Loudness', 'Energy'].includes(d.feature) ? 'rgba(216, 96, 114, 1)' : '#979dab')
    .attr('opacity', 0);

  // 레이블 추가
  const labels = svg.selectAll('.correlation-label')
    .data(data)
    .enter()
    .append('text')
    .attr('class', 'correlation-label')
    .attr('x', -10)
    .attr('y', d => y(d.feature))
    .attr('text-anchor', 'end')
    .attr('dominant-baseline', 'middle')
    .attr('fill', d => ['Valence', 'Loudness', 'Energy'].includes(d.feature) ? 'rgba(38, 33, 40, 1)' : 'rgba(38, 33, 40, 0.6)')
    .attr('font-weight', d => ['Valence', 'Loudness', 'Energy'].includes(d.feature) ? 'bold' : 'normal')
    .text(d => d.feature)
    .attr('opacity', 0);

  // 상관계수 레이블
   const corrLabels = svg.selectAll('.correlation-value')
     .data(data)
     .enter()
     .append('text')
     .attr('class', 'correlation-value')
     .attr('x', d => d.correlation < 0 ? x(d.correlation) - 15 : x(d.correlation) + 15)
     .attr('y', d => y(d.feature))
     .attr('dominant-baseline', 'middle')
     .attr('text-anchor', d => d.correlation < 0 ? 'end' : 'start')
     .attr('fill', d => 'rgba(38, 33, 40, 0.8)')
     .attr('font-weight', d=> ['Valence', 'Loudness', 'Energy'].includes(d.feature) ? 'bold' : 'normal')
    .text(d => d.correlation.toFixed(2))
    .attr('opacity', 0);

   // 애니메이션
   lines.transition()
     .duration(1000)
     .delay((d, i) => i * 100)
     .attr('opacity', 1);

   circles.transition()
     .duration(1000)
     .delay((d, i) => i * 100)
     .attr('opacity', 1);

   labels.transition()
     .duration(1000)
     .delay((d, i) => i * 100)
     .attr('opacity', 1);

   corrLabels.transition()
     .duration(1000)
     .delay((d, i) => i * 100)
     .attr('opacity', 1);

   // 호버 효과
   const lineGroups = svg.selectAll('.correlation-group')
     .data(data)
     .enter()
     .append('g')
     .attr('class', 'correlation-group');

   lineGroups.on('mouseover', function(event, d) {
     d3.select(this.parentNode)
       .selectAll('.correlation-line')
       .attr('opacity', 0.2);
     d3.select(this.parentNode)
       .selectAll('.correlation-circle')
       .attr('opacity', 0.2);
     
     const line = d3.select(this.parentNode)
       .selectAll('.correlation-line')
       .filter(dd => dd === d)
       .attr('opacity', 1)
       .attr('stroke-width', 3);
     
     const circle = d3.select(this.parentNode)
       .selectAll('.correlation-circle')
       .filter(dd => dd === d)
       .attr('opacity', 1)
       .attr('r', 10);
   })
   .on('mouseout', function() {
     d3.select(this.parentNode)
       .selectAll('.correlation-line')
       .attr('opacity', 1)
       .attr('stroke-width', 2);
     d3.select(this.parentNode)
       .selectAll('.correlation-circle')
       .attr('opacity', 1)
       .attr('r', 8);
   });

 }, []);

 return (
   <div className="relative w-full max-w-5xl mx-auto">
     <svg ref={svgRef} className="w-full" />
   </div>
 );
}