"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import DanceabilityChart from "../ui/DanceabilityChart";

const sections = [
  {
    title: "The Setlist Flow",
    description:
      "Now, let’s take a look at the entire setlist on a track-by-track level, following the exact sequence of songs performed throughout The Eras Tour. This closer examination will reveal how the era-level strategies we’ve discussed manifest in real time—how each individual track, chosen from a diverse musical palette, contributes to a carefully orchestrated emotional journey. By analyzing the performance order and the specific danceability traits of each song, we can see how Taylor Swift balances tension and release, ensuring that the audience remains captivated from start to finish.",
    highlightIds: [],
  },
  {
    title: "Pacing Like a Marathon Runner",
    description:
      "The most intriguing discovery in Taylor Swift's The Eras Tour is its regular pattern of danceability fluctuations. Analysis of the show's flow reveals a consistent pattern: after 2-3 consecutive songs with lower danceability and emotional depth, a high-danceability song invariably follows. \nThis composition mirrors a long-distance runner's pace management. When audiences emerge from segments of deep emotional immersion, they encounter high-danceability songs that provide moments to catch their breath and recharge their energy.",
    highlightIds: [1, 2, 3, 4, 5, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 23, 24, 26, 27, 28, 29, 30, 33, 34, 35],
  },
  {
    title: "The Strategic Placement of Taylor's Most Vulnerable Songs",
    description:
      "According to Taylor, Track 5 is her most valunerable track on the album. They often feature lower danceability, allowing them to serve as moments of deep, complex immersion. Placed near the end of an era segment, these songs set the stage for a dramatic shift when the show moves to the next era. \n An intriguing exception is “Delicate” from Reputation, which, despite being a fifth track, has relatively high danceability. Here, the surrounding songs are more rhythmically complex, and “Delicate” becomes a calming intermediary rather than an emotional crescendo. This example shows that danceability can be strategically manipulated even at the track level, providing balance and surprise.",
    highlightIds: [5, 13, 15, 23, 29],
  },
  {
    title: "Building to the Climax",
    description:
      "The final sequence of The Eras Tour demonstrates perfect energy management. In the folklore ERA, Taylor places a series of songs with remarkably low danceability averaging 0.4. These tracks immerse the audience in her narrative world through lyrical melodies and deep storytelling. Following this deep emotional immersion, the 1989 and Midnights ERAs begin. Notably, Taylor meticulously selected only high-danceability tracks for these two ERAs. Unlike other ERAs that feature varying levels of danceability, almost every song in these final ERAs maintains a danceability score above 0.6. This strategic song selection consistently elevates the energy towards the show's conclusion, creating an overwhelming finale to the three-hour-plus journey..",
    highlightIds: [27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42],
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
      className="relative box-border"
      style={{ height: `${(sections.length + 1) * 100}vh` }}
    >
      {/* Sticky 컨테이너 */}
      <div className="sticky top-0 h-screen w-full">
        <motion.div
          className="w-full h-full flex flex-col items-center justify-center box-border p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* 현재 섹션의 텍스트 */}
          <div className="flex flex-col justify-between h-full box-border flex-1">
            <motion.div
              key={currentSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex gap-6 flex-row flex-1 px-4"
            >
              <h3 className="flex-shrink-0 w-80 text-3xl md:text-4xl text-primary font-display mb-4">
                {sections[currentSection].title}
              </h3>
              <pre className="text-base text-obsidian/80 leading-relaxed whitespace-pre-wrap font-sans">
                {sections[currentSection].description}
              </pre>
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
