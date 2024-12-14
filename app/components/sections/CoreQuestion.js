// components/sections/CoreQuestion.js
'use client';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import * as d3 from 'd3';

export default function CoreQuestion() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const graphRef = useRef();

  useEffect(() => {
    if (!graphRef.current || !inView) return;

    // Clear previous content
    d3.select(graphRef.current).selectAll("*").remove();

    const width = 800;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };

    const svg = d3.select(graphRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create hypothetical engagement data
    const data = [
      { time: 0, engagement: 90 },
      { time: 1, engagement: 85 },
      { time: 2, engagement: 75 },
      { time: 3, engagement: 60 },
    ];

    // Create scales
    const x = d3.scaleLinear()
      .domain([0, 3])
      .range([0, width - margin.left - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([height - margin.top - margin.bottom, 0]);

    // Create line generator
    const line = d3.line()
      .x(d => x(d.time))
      .y(d => y(d.engagement))
      .curve(d3.curveMonotoneX);

    // Add axes
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(3).tickFormat(d => `${d}h`));

    svg.append("g")
      .call(d3.axisLeft(y).ticks(5));

    // Add line
    const path = svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#c06c84")
      .attr("stroke-width", 3)
      .attr("d", line);

    // Animate the line
    const length = path.node().getTotalLength();
    path
      .attr("stroke-dasharray", length + " " + length)
      .attr("stroke-dashoffset", length)
      .transition()
      .duration(2000)
      .attr("stroke-dashoffset", 0);

    // Add labels
    svg.append("text")
      .attr("x", (width - margin.left - margin.right) / 2)
      .attr("y", height - margin.bottom)
      .attr("text-anchor", "middle")
      .attr("fill", "currentColor")
      .text("Concert Duration");

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -(height - margin.top - margin.bottom) / 2)
      .attr("y", -40)
      .attr("text-anchor", "middle")
      .attr("fill", "currentColor")
      .text("Audience Engagement");

  }, [inView]);

  return (
    <section ref={ref} className="space-y-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="space-y-8"
      >
        <h2 className="text-3xl md:text-4xl font-display text-tertiary">
          The Role of High-Danceability Tracks in a Long Performance
        </h2>
        
        <p className="text-lg text-secondary/80 leading-relaxed">
          If the most celebrated songs are low in danceability and emotionally intense, 
          how does Taylor maintain audience engagement throughout a marathon concert? 
          The answer lies in strategic use of high-danceability tracks as emotional breathers.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-secondary/80">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-accent">Low Danceability Songs</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Complex melodies</li>
              <li>Unexpected musical turns</li>
              <li>Emotionally intense narratives</li>
              <li>Requires focused listening</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-accent">High Danceability Songs</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Predictable rhythms</li>
              <li>Steady, uplifting beats</li>
              <li>Easy-to-follow patterns</li>
              <li>Provides emotional reset</li>
            </ul>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="bg-secondary/5 rounded-lg p-8"
      >
        <h3 className="text-xl font-semibold mb-6 text-center text-secondary/80">
          Hypothetical Audience Engagement Over Time
          <br />
          <span className="text-sm font-normal">(with only low-danceability songs)</span>
        </h3>
        <div ref={graphRef} className="w-full overflow-x-auto" />
        <p className="text-sm text-secondary/60 mt-4 text-center">
          Without strategic high-danceability breaks, audience engagement could decline over time
        </p>
      </motion.div>
    </section>
  );
}