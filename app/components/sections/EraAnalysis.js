// components/sections/EraAnalysis.js
'use client';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import * as d3 from 'd3';

// Mock data - replace with real data later
const eraData = [
  { era: "Fearless", avgDanceability: 0.45, genre: "Country", concertOrder: 2 },
  { era: "Speak Now", avgDanceability: 0.48, genre: "Country/Pop", concertOrder: 3 },
  { era: "Red", avgDanceability: 0.52, genre: "Pop/Rock", concertOrder: 4 },
  { era: "1989", avgDanceability: 0.70, genre: "Pop", concertOrder: 5 },
  { era: "Reputation", avgDanceability: 0.65, genre: "Pop", concertOrder: 6 },
  { era: "Lover", avgDanceability: 0.68, genre: "Pop", concertOrder: 1 },
  { era: "folklore", avgDanceability: 0.42, genre: "Alternative", concertOrder: 7 },
  { era: "evermore", avgDanceability: 0.40, genre: "Alternative", concertOrder: 8 },
  { era: "Midnights", avgDanceability: 0.65, genre: "Pop", concertOrder: 9 }
];

export default function EraAnalysis() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const barChartRef = useRef();
  const timelineRef = useRef();

  useEffect(() => {
    if (!barChartRef.current || !inView) return;

    // Bar Chart
    const margin = { top: 40, right: 30, bottom: 60, left: 120 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Clear previous chart
    d3.select(barChartRef.current).selectAll("*").remove();

    const svg = d3.select(barChartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales
    const x = d3.scaleLinear()
      .domain([0, 1])
      .range([0, width]);

    const y = d3.scaleBand()
      .domain(eraData.map(d => d.era))
      .range([0, height])
      .padding(0.2);

    // Add axes
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d => d * 100 + "%"));

    svg.append("g")
      .call(d3.axisLeft(y));

    // Add bars
    const bars = svg.selectAll(".bar")
      .data(eraData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("y", d => y(d.era))
      .attr("height", y.bandwidth())
      .attr("x", 0)
      .attr("fill", d => d.genre === "Pop" ? "#c06c84" : "#b392ac")
      .attr("opacity", 0.8);

    // Animate bars
    bars.transition()
      .duration(1000)
      .delay((d, i) => i * 100)
      .attr("width", d => x(d.avgDanceability));

    // Add labels
    svg.selectAll(".label")
      .data(eraData)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", d => x(d.avgDanceability) + 5)
      .attr("y", d => y(d.era) + y.bandwidth() / 2)
      .attr("dy", "0.35em")
      .text(d => (d.avgDanceability * 100).toFixed(0) + "%")
      .attr("fill", "currentColor")
      .attr("opacity", 0)
      .transition()
      .duration(1000)
      .delay((d, i) => i * 100 + 500)
      .attr("opacity", 1);

    // Timeline visualization
    const timelineSvg = d3.select(timelineRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", 100)
      .append("g")
      .attr("transform", `translate(${margin.left},20)`);

    const timelineX = d3.scaleLinear()
      .domain([1, 9])
      .range([0, width]);

    const sortedByOrder = [...eraData].sort((a, b) => a.concertOrder - b.concertOrder);

    // Add timeline points
    const timelinePoints = timelineSvg.selectAll(".timeline-point")
      .data(sortedByOrder)
      .enter()
      .append("g")
      .attr("class", "timeline-point")
      .attr("transform", d => `translate(${timelineX(d.concertOrder)},0)`);

    timelinePoints.append("circle")
      .attr("r", 6)
      .attr("fill", d => d.genre === "Pop" ? "#c06c84" : "#b392ac");

    timelinePoints.append("text")
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .attr("fill", "currentColor")
      .attr("font-size", "12px")
      .text(d => d.era);

    // Add connecting lines
    timelineSvg.selectAll(".timeline-line")
      .data(sortedByOrder.slice(0, -1))
      .enter()
      .append("line")
      .attr("x1", d => timelineX(d.concertOrder))
      .attr("x2", (d, i) => timelineX(sortedByOrder[i + 1].concertOrder))
      .attr("y1", 0)
      .attr("y2", 0)
      .attr("stroke", "#666")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "4,4");

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
          Harnessing Genre Shifts for Emotional Peaks
        </h2>
        
        <p className="text-lg text-secondary/80 leading-relaxed">
          Each Taylor Swift era brings its own unique sound and energy level. The careful 
          arrangement of these eras in concert, particularly the strategic placement of 
          high-danceability pop eras toward the end, helps create a powerful crescendo 
          effect.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="bg-secondary/5 rounded-lg p-8"
      >
        <h3 className="text-xl font-semibold mb-6 text-center text-secondary/80">
          Average Danceability by Era
        </h3>
        <div ref={barChartRef} className="w-full overflow-x-auto" />
        <p className="text-sm text-secondary/60 mt-4 text-center">
          Pop eras (shown in pink) generally feature higher danceability scores
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="bg-secondary/5 rounded-lg p-8"
      >
        <h3 className="text-xl font-semibold mb-6 text-center text-secondary/80">
          Concert Order Timeline
        </h3>
        <div ref={timelineRef} className="w-full overflow-x-auto" />
        <p className="text-sm text-secondary/60 mt-4 text-center">
          Note the strategic placement of high-danceability eras toward the end
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-accent">Early Eras</h3>
          <p className="text-secondary/80 leading-relaxed">
            Country and folk-influenced eras feature lower danceability scores, 
            allowing for deep emotional connection through complex melodies and 
            storytelling.
          </p>
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-accent">Later Eras</h3>
          <p className="text-secondary/80 leading-relaxed">
            Pop-centric eras with higher danceability are strategically placed 
            later in the show, building toward an energetic finale that keeps 
            the audience engaged.
          </p>
        </div>
      </motion.div>
    </section>
  );
}