// app/components/ui/AudioWaveform.js
'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function AudioWaveform({ audioData, color = '#1db954' }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!audioData || !svgRef.current) return;

    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const width = 400 - margin.left - margin.right;
    const height = 100 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
      .domain([0, audioData.length])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([-1, 1])
      .range([height, 0]);

    // 파형 그리기
    const line = d3.line()
      .x((d, i) => x(i))
      .y(d => y(d))
      .curve(d3.curveCardinal);

    svg.append('path')
      .datum(audioData)
      .attr('class', 'waveform')
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', 2);

  }, [audioData, color]);

  return <svg ref={svgRef} />;
}