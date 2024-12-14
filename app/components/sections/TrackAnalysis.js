// components/sections/TrackAnalysis.js
'use client';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import * as d3 from 'd3';

// Mock data - replace with real data later
const albumTrackData = [
  {
    album: "Fearless",
    tracks: [
      { position: 1, danceability: 0.55, name: "Fearless" },
      { position: 2, danceability: 0.48, name: "Fifteen" },
      { position: 3, danceability: 0.52, name: "Love Story" },
      { position: 4, danceability: 0.45, name: "Hey Stephen" },
      { position: 5, danceability: 0.35, name: "White Horse" },
    ]
  },
  {
    album: "Red",
    tracks: [
      { position: 1, danceability: 0.65, name: "State of Grace" },
      { position: 2, danceability: 0.58, name: "Red" },
      { position: 3, danceability: 0.62, name: "Treacherous" },
      { position: 4, danceability: 0.55, name: "I Knew You Were Trouble" },
      { position: 5, danceability: 0.32, name: "All Too Well" },
    ]
  },
  // Add more albums...
];

export default function TrackAnalysis() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const smallMultiplesRef = useRef();

  useEffect(() => {
    if (!smallMultiplesRef.current || !inView) return;

    // Clear previous charts
    d3.select(smallMultiplesRef.current).selectAll("*").remove();

    const margin = { top: 30, right: 20, bottom: 40, left: 40 };
    const width = 250 - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    const container = d3.select(smallMultiplesRef.current)
      .append("div")
      .style("display", "grid")
      .style("grid-template-columns", "repeat(auto-fit, minmax(250px, 1fr))")
      .style("gap", "2rem");

    // Create scales
    const x = d3.scaleLinear()
      .domain([1, 5])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, 1])
      .range([height, 0]);

    // Create line generator
    const line = d3.line()
      .x(d => x(d.position))
      .y(d => y(d.danceability))
      .curve(d3.curveMonotoneX);

    // Create small multiples
    albumTrackData.forEach(album => {
      const div = container.append("div")
        .attr("class", "small-multiple");

      const svg = div.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Add title
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .attr("fill", "currentColor")
        .attr("font-weight", "bold")
        .text(album.album);

      // Add axes
      svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).ticks(5));

      svg.append("g")
        .call(d3.axisLeft(y).ticks(5).tickFormat(d => d * 100 + "%"));

      // Add line
      const path = svg.append("path")
        .datum(album.tracks)
        .attr("fill", "none")
        .attr("stroke", "#c06c84")
        .attr("stroke-width", 2)
        .attr("d", line);

      // Animate line
      const length = path.node().getTotalLength();
      path
        .attr("stroke-dasharray", length + " " + length)
        .attr("stroke-dashoffset", length)
        .transition()
        .duration(2000)
        .attr("stroke-dashoffset", 0);

      // Add points
      svg.selectAll(".point")
        .data(album.tracks)
        .enter()
        .append("circle")
        .attr("class", "point")
        .attr("cx", d => x(d.position))
        .attr("cy", d => y(d.danceability))
        .attr("r", d => d.position === 5 ? 6 : 4)
        .attr("fill", d => d.position === 5 ? "#e879f9" : "#c06c84")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1);

      // Add hover effects
      const tooltip = div.append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background-color", "rgba(0,0,0,0.8)")
        .style("color", "#fff")
        .style("padding", "8px")
        .style("border-radius", "4px")
        .style("font-size", "12px");

      svg.selectAll(".point")
        .on("mouseover", function(event, d) {
          tooltip
            .style("visibility", "visible")
            .html(`
              Track ${d.position}: ${d.name}<br/>
              Danceability: ${(d.danceability * 100).toFixed(0)}%
            `);

          d3.select(this)
            .transition()
            .duration(200)
            .attr("r", d.position === 5 ? 8 : 6);
        })
        .on("mousemove", function(event) {
          tooltip
            .style("top", (event.pageY - 10) + "px")
            .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", function(event, d) {
          tooltip.style("visibility", "hidden");
          d3.select(this)
            .transition()
            .duration(200)
            .attr("r", d.position === 5 ? 6 : 4);
        });
    });

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
          The Track 5 Pattern
        </h2>
        
        <p className="text-lg text-secondary/80 leading-relaxed">
          A fascinating pattern emerges when examining track positions within albums, 
          particularly the iconic "Track 5" placement. These songs often serve as 
          emotional pinnacles with notably low danceability, strategically positioned 
          to maximize emotional impact.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="bg-secondary/5 rounded-lg p-8"
      >
        <h3 className="text-xl font-semibold mb-6 text-center text-secondary/80">
          Track-by-Track Danceability Analysis
        </h3>
        <div ref={smallMultiplesRef} className="w-full" />
        <p className="text-sm text-secondary/60 mt-4 text-center">
          Track 5 (highlighted in purple) typically shows lower danceability scores
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-secondary/5 p-8 rounded-lg"
      >
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-accent">Track 5 Pattern</h3>
          <ul className="space-y-2 text-secondary/80">
            <li>• Typically features lowest danceability in the album</li>
            <li>• Often placed at era segment endings</li>
            <li>• Creates maximum emotional impact</li>
            <li>• Prepares for dramatic mood shifts</li>
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-accent">Notable Exception</h3>
          <p className="text-secondary/80 leading-relaxed">
            "Delicate" from Reputation stands out with higher danceability, 
            serving as a soothing midpoint rather than an emotional climax—
            proof that patterns can be strategically broken for effect.
          </p>
        </div>
      </motion.div>
    </section>
  );
}