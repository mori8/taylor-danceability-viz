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
    'popularity': {
      'danceability': 0.13, 'energy': 0.12, 'loudness': 0.24,
      'valence': 0.01, 'tempo': 0.04
    },
    'danceability': {
      'energy': 0.29, 'loudness': 0.43, 'valence': 0.46,
      'tempo': 0.08
    },
    // ... 더 많은 상관관계
  };

  useEffect(() => {
    if (!svgRef.current) return;

    // SVG 초기화
    const margin = { top: 60, right: 60, bottom: 60, left: 60 };
    const size = Math.min(window.innerWidth * 0.8, 800);
    const width = size - margin.left - margin.right;
    const height = size - margin.top - margin.bottom;
    const cellSize = Math.floor(width / features.length);

    // SVG 설정
    d3.select(svgRef.current).selectAll("*").remove();
    
    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // 색상 스케일
    const colorScale = d3.scaleLinear()
      .domain([-0.5, 0, 0.5])
      .range(['#4A4E69', '#22223B', '#9A8C98'])
      .interpolate(d3.interpolateHcl);

    // 셀 그리기
    features.forEach((row, i) => {
      features.forEach((col, j) => {
        const correlation = correlationData[row]?.[col] || correlationData[col]?.[row] || (row === col ? 1 : 0);

        // 히트맵 셀
        const cell = svg.append('g')
          .attr('transform', `translate(${j * cellSize},${i * cellSize})`);

        cell.append('rect')
          .attr('width', cellSize)
          .attr('height', cellSize)
          .attr('fill', colorScale(correlation))
          .attr('rx', 4)
          .attr('opacity', 0.8);

        // 상관계수 텍스트
        if (row !== col) {
          cell.append('text')
            .attr('x', cellSize / 2)
            .attr('y', cellSize / 2)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('fill', 'white')
            .attr('font-size', '12px')
            .text(correlation.toFixed(2));
        }

        // 호버 효과를 위한 투명한 오버레이
        cell.append('rect')
          .attr('width', cellSize)
          .attr('height', cellSize)
          .attr('fill', 'transparent')
          .attr('class', 'cell-overlay')
          .on('mouseover', function() {
            d3.select(this.parentNode)
              .select('rect')
              .transition()
              .duration(200)
              .attr('opacity', 1);

            // 툴팁 표시
            showTooltip(row, col, correlation);
          })
          .on('mouseout', function() {
            d3.select(this.parentNode)
              .select('rect')
              .transition()
              .duration(200)
              .attr('opacity', 0.8);

            // 툴팁 숨기기
            hideTooltip();
          });
      });
    });

    // 레이블 추가
    const labels = svg.append('g').attr('class', 'labels');

    // X축 레이블
    labels.selectAll('.column-label')
      .data(features)
      .enter()
      .append('text')
      .attr('class', 'column-label')
      .attr('x', (d, i) => i * cellSize + cellSize / 2)
      .attr('y', -10)
      .attr('text-anchor', 'start')
      .attr('transform', (d, i) => {
        return `rotate(-45 ${i * cellSize + cellSize / 2},-10)`;
      })
      .attr('fill', 'white')
      .attr('font-size', '12px')
      .text(d => d.charAt(0).toUpperCase() + d.slice(1));

    // Y축 레이블
    labels.selectAll('.row-label')
      .data(features)
      .enter()
      .append('text')
      .attr('class', 'row-label')
      .attr('x', -10)
      .attr('y', (d, i) => i * cellSize + cellSize / 2)
      .attr('text-anchor', 'end')
      .attr('dominant-baseline', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '12px')
      .text(d => d.charAt(0).toUpperCase() + d.slice(1));

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

    function showTooltip(row, col, value) {
      tooltip
        .style('visibility', 'visible')
        .html(`
          <strong>${row}</strong> ↔ <strong>${col}</strong><br/>
          Correlation: ${value.toFixed(3)}
        `)
        .style('left', (d3.event.pageX + 10) + 'px')
        .style('top', (d3.event.pageY - 10) + 'px');
    }

    function hideTooltip() {
      tooltip.style('visibility', 'hidden');
    }

  }, []);

  return (
    <div className="relative w-full aspect-square max-w-4xl mx-auto bg-gray-900 rounded-xl p-6">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
}