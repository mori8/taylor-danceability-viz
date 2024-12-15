"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import DanceabilityChart from "../ui/DanceabilityChart";

const sections = [
  {
    title: "The Setlist Flow",
    description:
      "The Eras Tour setlist reveals a carefully orchestrated pattern of danceability fluctuations. Each song's placement serves a specific purpose in maintaining audience engagement.",
    highlightIds: [0, 1],
  },
  {
    title: "High-Energy Transitions",
    description:
      "Notice how high-danceability songs often follow emotionally intense ballads, providing necessary moments of release and energy renewal for the audience.",
    highlightIds: [15, 16, 17],
  },
  {
    title: "Strategic Placement of Fan Favorites",
    description:
      "Fan-favorite tracks with moderate danceability are strategically placed throughout the show, ensuring consistent audience engagement.",
    highlightIds: [31, 32, 33],
  },
  {
    title: "Building to the Climax",
    description:
      "The show's finale features a succession of high-danceability songs, creating an energetic conclusion to the three-hour performance.",
    highlightIds: [38, 39, 40, 41, 42],
  },
];

export default function SetlistAnalysis() {
  const [currentSection, setCurrentSection] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const scrollTop = -rect.top;
      const sectionHeight = window.innerHeight;

      const currentIndex = Math.min(
        Math.max(0, Math.floor(scrollTop / sectionHeight)),
        sections.length - 1
      );

      setCurrentSection(currentIndex);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative bg-red-100"
      style={{ height: `${(sections.length + 1) * 100}vh` }}
    >
      {/* Sticky 컨테이너 */}
      <div className="sticky top-0 h-screen w-full bg-cream">
        <motion.div
          className="w-full h-full flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* 현재 섹션의 텍스트 */}
          <div className="p-8 max-w-5xl">
            <motion.div
              key={currentSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl md:text-2xl text-tertiary mb-4">
                {sections[currentSection].title}
              </h3>
              <p className="text-lg text-secondary/80 leading-relaxed">
                {sections[currentSection].description}
              </p>
            </motion.div>
          </div>

          {/* 차트 섹션 */}
          <div className="flex items-center justify-center">
            <DanceabilityChart
              highlightedIds={sections[currentSection].highlightIds || []}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
