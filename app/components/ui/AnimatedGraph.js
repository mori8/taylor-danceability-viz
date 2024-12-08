// app/components/ui/AnimatedGraph.js
'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function AnimatedGraph({ data, feature }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // 스케일 설정
    const x = d3.scaleBand()
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .range([height, 0]);

    // 데이터 바인딩
    x.domain(data.map(d => d.name));
    y.domain([0, d3.max(data, d => d[feature])]);

    // 축 그리기
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-65)');

    svg.append('g')
      .call(d3.axisLeft(y));

    // 바 그래프 그리기와 애니메이션
    svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', d => x(d.name))
      .attr('width', x.bandwidth())
      .attr('y', height)
      .attr('height', 0)
      .attr('fill', '#1db954')
      .transition()
      .duration(1000)
      .attr('y', d => y(d[feature]))
      .attr('height', d => height - y(d[feature]));

  }, [data, feature]);

  return <svg ref={svgRef} className="w-full h-full" />;
}