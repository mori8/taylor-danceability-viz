// components/sections/Introduction.js
'use client';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import * as d3 from 'd3';

// Mock data - replace with real data later
const chartData = [
  { song: "All Too Well (10 Min)", peakRank: 1, danceability: 0.35, weeks: 12 },
  { song: "Cruel Summer", peakRank: 3, danceability: 0.55, weeks: 15 },
  { song: "Anti-Hero", peakRank: 2, danceability: 0.64, weeks: 14 },
  { song: "Love Story", peakRank: 4, danceability: 0.45, weeks: 10 },
  { song: "Shake It Off", peakRank: 1, danceability: 0.80, weeks: 16 }
];

export default function Introduction() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !inView) return;

    const margin = { top: 40, right: 100, bottom: 60, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Clear previous chart
    d3.select(chartRef.current).selectAll("*").remove();

    const svg = d3.select(chartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Scales
    const x = d3.scaleLinear()
      .domain([0, 1])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([16, 1])
      .range([height, 0]);

    const radius = d3.scaleLinear()
      .domain([d3.min(chartData, d => d.weeks), d3.max(chartData, d => d.weeks)])
      .range([5, 15]);

    // Add axes
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .append("text")
      .attr("x", width/2)
      .attr("y", 40)
      .attr("fill", "currentColor")
      .attr("text-anchor", "middle")
      .text("Danceability Score");

    svg.append("g")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -40)
      .attr("x", -height/2)
      .attr("fill", "currentColor")
      .attr("text-anchor", "middle")
      .text("Peak Chart Position");

    // Add points
    const points = svg.selectAll("circle")
      .data(chartData)
      .enter()
      .append("g");

    points.append("circle")
      .attr("cx", d => x(d.danceability))
      .attr("cy", d => y(d.peakRank))
      .attr("r", d => radius(d.weeks))
      .attr("fill", "#c06c84")
      .attr("opacity", 0.7)
      .attr("stroke", "#fff")
      .attr("stroke-width", 1);

    // Add labels
    points.append("text")
      .attr("x", d => x(d.danceability) + radius(d.weeks) + 5)
      .attr("y", d => y(d.peakRank))
      .attr("dy", "0.35em")
      .text(d => d.song)
      .attr("fill", "currentColor")
      .attr("font-size", "12px");

  }, [inView]);

  return (
    <section ref={ref} className="space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="space-y-6"
      >
        <h2 className="text-3xl md:text-4xl font-display text-tertiary">
          When Chart Success Contrasts with Danceability
        </h2>
        
        <p className="text-lg text-secondary/80 leading-relaxed">
          Taylor Swift's artistic journey spans multiple genres, from country to pop, 
          folk to alternative. Her most beloved hits often prioritize melodic complexity 
          and emotional storytelling over simple, predictable beats. This creates an 
          intriguing pattern: songs that achieved the highest chart success during 
          The Eras Tour often have lower danceability scores.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="bg-secondary/5 rounded-lg p-8"
      >
        <div ref={chartRef} className="w-full overflow-x-auto" />
        <p className="text-sm text-secondary/60 mt-4 text-center">
          Bubble size represents weeks on chart. Hover over points to see details.
        </p>
      </motion.div>
    </section>
  );
}