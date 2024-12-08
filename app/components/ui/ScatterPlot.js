// components/ui/ScatterPlot.js
'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

export default function ScatterPlot({ data }) {
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Responsive dimensions 설정
    const updateDimensions = () => {
      const width = window.innerWidth * 0.9; // 화면의 90%
      const height = window.innerHeight * 0.8; // 화면의 80%
      setDimensions({ width, height });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!data || !dimensions.width || !dimensions.height) return;

    const margin = { top: 40, right: 40, bottom: 60, left: 60 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    // SVG 초기화
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // 스케일 설정
    const xScale = d3.scaleLinear()
      .domain([0, 1]) // danceability는 0-1 사이
      .range([0, width])
      .nice();

    const yScale = d3.scaleLinear()
      .domain([100, 1]) // rank는 1이 최상위
      .range([height, 0])
      .nice();

    // 축 설정
    const xAxis = d3.axisBottom(xScale)
      .tickSize(-height)
      .tickPadding(10);

    const yAxis = d3.axisLeft(yScale)
      .tickSize(-width)
      .tickPadding(10);

    // 그리드라인 스타일링
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis)
      .attr('class', 'grid')
      .selectAll('line')
      .attr('stroke', 'rgba(255, 255, 255, 0.1)');

    svg.append('g')
      .call(yAxis)
      .attr('class', 'grid')
      .selectAll('line')
      .attr('stroke', 'rgba(255, 255, 255, 0.1)');

    // 축 레이블 스타일링
    svg.selectAll('.grid path')
      .attr('stroke', 'rgba(255, 255, 255, 0.2)');
    
    svg.selectAll('.grid text')
      .attr('fill', 'rgba(255, 255, 255, 0.6)')
      .style('font-size', '12px');

    // 툴팁 설정
    const tooltip = d3.select(tooltipRef.current)
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background-color', 'rgba(0, 0, 0, 0.9)')
      .style('border', '1px solid rgba(255, 255, 255, 0.2)')
      .style('border-radius', '8px')
      .style('padding', '12px')
      .style('box-shadow', '0 4px 6px rgba(0, 0, 0, 0.1)')
      .style('z-index', '10');

    // 데이터 포인트 그리기
    svg.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.danceability))
      .attr('cy', d => yScale(d.peak_rank))
      .attr('r', 8)
      .attr('fill', '#1DB954') // Spotify green
      .attr('opacity', 0.7)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 12)
          .attr('opacity', 1);

        tooltip.html(`
          <div class="flex items-center gap-3 min-w-[300px]">
            <img src="${d.album_cover}" alt="${d.album}" class="w-16 h-16 rounded-md" />
            <div>
              <p class="text-white font-bold">${d.title}</p>
              <p class="text-gray-400 text-sm">${d.album}</p>
              <p class="text-green-400 text-sm">Danceability: ${d.danceability.toFixed(3)}</p>
            </div>
          </div>
        `)
        .style('visibility', 'visible')
        .style('left', `${event.pageX + 10}px`)
        .style('top', `${event.pageY - 10}px`);
      })
      .on('mousemove', function(event) {
        tooltip
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 10}px`);
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 8)
          .attr('opacity', 0.7);

        tooltip.style('visibility', 'hidden');
      });

    // 축 레이블 추가
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 10)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .text('Danceability');

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -margin.left + 15)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .text('Peak Chart Position');

  }, [data, dimensions]);

  return (
    <div className="relative w-full h-full bg-gray-900 rounded-lg p-4">
      <svg ref={svgRef} className="w-full h-full" />
      <div ref={tooltipRef} className="tooltip" />
    </div>
  );
}