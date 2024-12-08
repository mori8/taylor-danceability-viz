// app/components/ui/RadarChart.js
'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function RadarChart({ features }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!features || !svgRef.current) return;

    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width/2},${height/2})`);

    // 각도 스케일
    const angleScale = d3.scalePoint()
      .domain(Object.keys(features))
      .range([0, 2 * Math.PI]);

    // 반지름 스케일
    const radiusScale = d3.scaleLinear()
      .domain([0, 1])
      .range([0, radius]);

    // 패스 생성기
    const radarLine = d3.lineRadial()
      .angle(d => angleScale(d[0]))
      .radius(d => radiusScale(d[1]))
      .curve(d3.curveLinearClosed);

    // 레이더 차트 그리기
    const points = Object.entries(features);
    
    svg.append('path')
      .datum(points)
      .attr('d', radarLine)
      .attr('fill', '#1db954')
      .attr('fill-opacity', 0.2)
      .attr('stroke', '#1db954')
      .attr('stroke-width', 2);

    // 축 그리기
    const axes = svg.selectAll('.axis')
      .data(points)
      .enter()
      .append('g')
      .attr('class', 'axis');

    axes.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', (d, i) => radius * Math.cos(angleScale(d[0]) - Math.PI/2))
      .attr('y2', (d, i) => radius * Math.sin(angleScale(d[0]) - Math.PI/2))
      .attr('stroke', 'white')
      .attr('stroke-opacity', 0.3);

    // 레이블 추가
    axes.append('text')
      .attr('x', (d, i) => (radius + 10) * Math.cos(angleScale(d[0]) - Math.PI/2))
      .attr('y', (d, i) => (radius + 10) * Math.sin(angleScale(d[0]) - Math.PI/2))
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .text(d => d[0])
      .attr('fill', 'white');

  }, [features]);

  return <svg ref={svgRef} />;
}