// components/ui/CorrelationHeatmap.js
'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function CorrelationHeatmap() {
  const svgRef = useRef(null);

  // 상관관계 데이터
  const features = [
    'danceability', 'energy', 'loudness', 'speechiness', 
    'acousticness', 'instrumentalness', 'liveness', 'valence', 
    'tempo', 'popularity'
  ];

  const correlationData = {
    'danceability': {
      'energy': 0.29, 'loudness': 0.43, 'valence': 0.46,
      'tempo': 0.08, 'speechiness': 0.15, 'acousticness': -0.34,
      'instrumentalness': -0.23, 'liveness': 0.12, 'popularity': 0.13
    }
  };

  useEffect(() => {
    if (!svgRef.current) return;

    // SVG 초기화
    const margin = { top: 80, right: 60, bottom: 0, left: 60 };
    const size = Math.min(window.innerWidth * 0.8, 800);
    const width = size - margin.left - margin.right;
    const cellSize = Math.floor(width / (features.length - 1));
    const cellPadding = 5;

    // SVG 설정
    d3.select(svgRef.current).selectAll("*").remove();
    
    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', cellSize + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // 색상 스케일
    const colorScale = d3.scaleThreshold()
      .domain([-0.3, -0.2, 0, 0.2, 0.3, 0.4])
      .range(['#979dab', '#c5bac4', '#dfb6b2', '#ae749d', '#824d69', '#522959']);

    // 셀 그리기
    features.slice(1).forEach((col, j) => {
      const correlation = correlationData['danceability'][col] || 0;

      // 히트맵 셀
      const cell = svg.append('g')
        .attr('transform', `translate(${j * (cellSize + cellPadding)},0)`);

      cell.append('circle')
        .attr('cx', cellSize / 2)
        .attr('cy', cellSize / 2)
        .attr('r', cellSize / 2 - cellPadding)
        .attr('fill', colorScale(correlation))
        .attr('opacity', 0.8);

      // 상관계수 텍스트
      cell.append('text')
        .attr('x', cellSize / 2)
        .attr('y', cellSize / 2)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', 'white')
        .attr('font-size', '12px')
        .text(correlation.toFixed(2));

      // 호버 효과를 위한 투명한 오버레이
      cell.append('rect')
        .attr('width', cellSize)
        .attr('height', cellSize)
        .attr('fill', 'transparent')
        .attr('class', 'cell-overlay')
        .on('mouseover', function(event) {
          d3.select(this.parentNode)
            .select('circle')
            .transition()
            .duration(200)
            .attr('opacity', 1);

          // 툴팁 표시
          showTooltip(event, 'danceability', col, correlation);
        })
        .on('mouseout', function() {
          d3.select(this.parentNode)
            .select('circle')
            .transition()
            .duration(200)
            .attr('opacity', 0.8);

          // 툴팁 숨기기
          hideTooltip();
        });
    });

    // 레이블 추가
    const labels = svg.append('g').attr('class', 'labels');

    // X축 레이블
    labels.selectAll('.column-label')
      .data(features.slice(1))
      .enter()
      .append('text')
      .attr('class', 'column-label')
      .attr('x', (d, i) => i * (cellSize + cellPadding) + cellSize / 2)
      .attr('y', -10)
      .attr('text-anchor', 'start')
      .attr('transform', (d, i) => {
        return `rotate(-45 ${i * (cellSize + cellPadding) + cellSize / 2},-10)`;
      })
      .attr('fill', 'white')
      .attr('font-size', '12px')
      .attr('opacity', d => ['energy', 'loudness', 'valence'].includes(d) ? 1 : 0.6)
      .text(d => d.charAt(0).toUpperCase() + d.slice(1));

    // Y축 레이블
    labels.append('text')
      .attr('class', 'row-label')
      .attr('x', -10)
      .attr('y', cellSize / 2)
      .attr('text-anchor', 'end')
      .attr('dominant-baseline', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '12px')
      .text('Danceability');

    // 툴팁 함수
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

    function showTooltip(event, row, col, value) {
      tooltip
        .style('visibility', 'visible')
        .html(`
          <strong>${row}</strong> ↔ <strong>${col}</strong><br/>
          Correlation: ${value.toFixed(3)}
        `)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 10) + 'px');
    }

    function hideTooltip() {
      tooltip.style('visibility', 'hidden');
    }

  }, []);

  return (
    <div className="relative w-full max-w-4xl mx-auto bg-gray-900 rounded-xl p-6">
      <svg ref={svgRef} className="w-full" />
    </div>
  );
}
