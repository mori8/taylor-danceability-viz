// components/sections/EraAnalysis.js
"use client";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import * as d3 from "d3";
import Image from "next/image";
import DanceabilityBarChart from "../ui/DanceabilityBarChart";
import StackedBarChart from "../ui/StackedBarChart";

const eraGenres = [
  { title: "Lover", genre: "Pop" },
  { title: "Fearless", genre: "Country" },
  { title: "evermore", genre: "Alternative/Folk" },
  { title: "reputation", genre: "Pop/Electronic" },
  { title: "Speak Now", genre: "Country" },
  { title: "Red", genre: "Country/Pop" },
  { title: "folklore", genre: "Alternative/Folk" },
  { title: "1989", genre: "Pop" },
  { title: "Midnights", genre: "Pop/Electronic" },
];

export default function EraAnalysis() {
  const [data, setData] = useState(null);
  const [currentSection, setCurrentSection] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const containerTop = containerRect.top;
      const viewportHeight = window.innerHeight;

      // Calculate progress based on container position
      if (containerTop <= 0) {
        const progress = Math.abs(containerTop) / viewportHeight;
        const newSection = progress >= 0.5 ? 1 : 0;

        if (newSection !== currentSection) {
          setCurrentSection(newSection);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentSection]);

  useEffect(() => {
    d3.csv("/taylor_full_songs.csv").then((rawData) => {
      // Process data and calculate averages
      const processedData = rawData.map((d) => ({
        ...d,
        danceability: +d.danceability,
      }));

      const totalAverage = d3.mean(processedData, (d) => d.danceability);

      const albumStats = d3.group(processedData, (d) => d.album);
      const finalData = Array.from(albumStats, ([album, songs]) => {
        const aboveAverage = songs.filter(
          (s) => s.danceability > totalAverage
        ).length;
        return {
          album,
          aboveAverage,
          belowAverage: songs.length - aboveAverage,
        };
      });

      setData(finalData);
    });
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div ref={containerRef} className="relative pt-20">
      <div className="w-full mx-auto p-8 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex flex-row gap-6"
        >
          <h2 className="text-3xl md:text-4xl font-display text-primary text-left flex-1">
            How Taylor Swift weaves genre and danceability into a three-hour
            narrative is key to sustaining audience engagement.
          </h2>
          <p className="text-base text-obsidian/80 leading-relaxed text-left flex-1">
            In terms of danceability, let's examine how Taylor maintains tension
            in The Eras Tour. From country to pop, each era embodies its own
            danceability profile, creating a varied tour experience. The
            danceability of each album reflects its aesthetic—some focus on
            poetic lyrics and dramatic melodies (low danceability), while others
            emphasize catchy beats (high danceability). The bar chart below
            shows the percentage of above and below average danceability songs
            from each album, based on the average danceability of all of Taylor
            Swift's songs, and these eras are placed in order on the setlist for
            The Eras Tour.
          </p>
          <p className="text-base text-obsidian/80 leading-relaxed text-left flex-1">
            In the mid-section of the show, she selects eras with lower
            danceability, encouraging fans to focus more deeply on her
            storytelling and lyrical nuance. To ensure the audience doesn’t
            become overwhelmed, she strategically inserts <i>Reputation</i>—the
            era with some of the highest danceability—between emotionally dense
            periods like <i>evermore</i> and <i>Speak Now</i>, offering a
            momentary breath of fresh air. As the performance builds toward its
            conclusion, she lines up a sequence of high-danceability eras—
            <i>1989</i> <i>and Midnights</i>—creating a climactic surge of
            energy.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-2 mb-2"
        >
          <div className="px-3">
            <Image
              src="/era-ordered.png"
              alt="Taylor Swift Eras"
              width={1920}
              height={400}
            />
          </div>
          <div className="w-full flex px-3">
            {eraGenres.map((era) => (
              <div className="flex-1 text-center" key={era.title}>
                <h3 className="text-lg font-semibold font-display">
                  {era.title}
                </h3>
                <p className="text-sm text-secondary">{era.genre}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
          className="w-full mt-2"
        >
          <StackedBarChart data={data} ordering="tour" />
        </motion.div>
      </div>
    </div>
  );
}
