// components/sections/SetlistAnalysis.js
'use client';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import * as d3 from 'd3';

// Mock setlist data - replace with real data later
const setlistData = [
  { song: "Miss Americana", era: "Lover", danceability: 0.72, position: 1 },
  { song: "Cruel Summer", era: "Lover", danceability: 0.55, position: 2 },
  { song: "The Man", era: "Lover", danceability: 0.77, position: 3 },
  { song: "Love Story", era: "Fearless", danceability: 0.45, position: 4 },
  { song: "All Too Well", era: "Red", danceability: 0.35, position: 5 },
  // Add more songs...
].map((d, i) => ({ ...d, position: i + 1 }));

const eras = {
  "Lover": "#c06c84",
  "Fearless": "#f9d423",
  "Red": "#e25822",
  // Add more eras...
};

export default function SetlistAnalysis() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const chartRef = useRef();

  useEffect(() => {
    if (!chartRef.current || !inView) return;

    const margin = { top: 40, right: 120, bottom: 60, left: 60 };
    const width = 1000 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Clear previous chart
    d3.select(chartRef.current).selectAll("*").remove();

    const svg = d3.select(chartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales
    const x = d3.scaleLinear()
      .domain([1, setlistData.length])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, 1])
      .range([height, 0]);

    // Create line generator
    const line = d3.line()
      .x(d => x(d.position))
      .y(d => y(d.danceability))
      .curve(d3.curveMonotoneX);

    // Add axes
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(setlistData.length))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    svg.append("g")
      .call(d3.axisLeft(y).ticks(5));

    // Add line
    const path = svg.append("path")
      .datum(setlistData)
      .attr("fill", "none")
      .attr("stroke", "#c06c84")
      .attr("stroke-width", 2)
      .attr("d", line);

    // Animate the line
    const length = path.node().getTotalLength();
    path
      .attr("stroke-dasharray", length + " " + length)
      .attr("stroke-dashoffset", length)
      .transition()
      .duration(2000)
      .attr("stroke-dashoffset", 0);

    // Add points
    const points = svg.selectAll(".point")
      .data(setlistData)
      .enter()
      .append("g")
      .attr("class", "point")
      .attr("transform", d => `translate(${x(d.position)},${y(d.danceability)})`);

    points.append("circle")
      .attr("r", 6)
      .attr("fill", d => eras[d.era])
      .attr("stroke", "#fff")
      .attr("stroke-width", 1);

    // Add era backgrounds
    let currentEra = setlistData[0].era;
    let eraStart = 1;
    
    setlistData.forEach((d, i) => {
      if (d.era !== currentEra || i === setlistData.length - 1) {
        svg.append("rect")
          .attr("x", x(eraStart))
          .attr("y", 0)
          .attr("width", x(i + 1) - x(eraStart))
          .attr("height", height)
          .attr("fill", eras[currentEra])
          .attr("opacity", 0.1);

        currentEra = d.era;
        eraStart = i + 1;
      }
    });

    // Add tooltips
    const tooltip = d3.select(chartRef.current)
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "rgba(0,0,0,0.8)")
      .style("color", "#fff")
      .style("padding", "8px")
      .style("border-radius", "4px");

    points
      .on("mouseover", function(event, d) {
        d3.select(this).select("circle")
          .transition()
          .duration(200)
          .attr("r", 8);

        tooltip
          .style("visibility", "visible")
          .html(`
            <strong>${d.song}</strong><br/>
            Era: ${d.era}<br/>
            Danceability: ${d.danceability.toFixed(2)}
          `);
      })
      .on("mousemove", function(event) {
        tooltip
          .style("top", (event.pageY - 10) + "px")
          .style("left", (event.pageX + 10) + "px");
      })
      .on("mouseout", function() {
        d3.select(this).select("circle")
          .transition()
          .duration(200)
          .attr("r", 6);

        tooltip.style("visibility", "hidden");
      });

  }, [inView]);

  return (
    <section ref={ref} className="space-y-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-accent">Song-to-Song Transitions</h3>
          <p className="text-secondary/80 leading-relaxed">
            After an emotionally complex, low-danceability track, a more predictable, 
            high-danceability song often follows. This creates a wave pattern that 
            helps maintain continuous audience engagement.
          </p>
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-accent">Era Transitions</h3>
          <p className="text-secondary/80 leading-relaxed">
            Era changes often mark significant shifts in danceability. Moving from a 
            folk/alternative era to a pop-centric era helps reenergize the crowd and 
            reset the emotional intensity.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="bg-secondary/5 rounded-lg p-8"
      >
        <h3 className="text-xl font-semibold mb-4 text-center text-secondary/80">
          Notable Danceability Transitions
        </h3>
        <div className="space-y-4">
          {[
            {
              from: "All Too Well (10 Min)",
              to: "Shake It Off",
              description: "A perfect example of emotional reset through danceability contrast"
            },
            {
              from: "Evermore",
              to: "Reputation",
              description: "Era transition utilizing danceability shift to create new energy"
            }
          ].map((transition, i) => (
            <div key={i} className="flex items-center space-x-4 p-4 rounded bg-secondary/10">
              <div className="flex-1">
                <p className="font-semibold text-accent">{transition.from} → {transition.to}</p>
                <p className="text-sm text-secondary/60">{transition.description}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
