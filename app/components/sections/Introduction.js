// components/sections/Introduction.js
'use client';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import ScatterPlot from '../ui/ScatterPlot';

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

  return (
    <section ref={ref} className="max-w-5xl mx-auto px-4 py-16 space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="space-y-6"
      >
        <p className="text-obsidian/80 leading-relaxed">
        Taylor Swift’s artistic evolution has led her through country, pop, folk, and alternative sounds, resulting in a richly diverse catalog. Many of her most beloved tracks are not defined by simple beats or catchy hooks. Instead, they draw listeners in with intricate, unpredictable melodies and deep narrative storytelling. Data from The Eras Tour period reinforces this idea: <span className="text-secondary">songs that re-entered Spotify’s charts during The Eras Tour tended to show an inverse relationship between their chart success—measured by peak ranks, and weeks on chart—and their danceability</span>. In other words, the songs that fans hold closest to their hearts often lack the steady, easily digestible rhythms we might associate with conventional hits.
        </p>

        <p className="text-obsidian/80 leading-relaxed">
        Low-danceability tracks may excel at weaving emotional depth and complexity, but <span className="text-secondary">The Eras Tour lasts more than three hours</span>. This raises a question:
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="space-y-6 mx-auto max-w-4xl"
      >
        <h3 className="text-2xl font-semibold font-display px-6 text-center text-primary">
        &quot;Would the audience&apos;s engagement and energy be maintained throughout a three-plus hour show with only these &apos;low danceability&apos; songs?&quot;
        </h3>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className=""
      >
        <ScatterPlot data={chartData} />
        <p className="text-base text-secondary/70 mt-4 text-center">
          Bubble size represents weeks on chart. Click the bubble to play the song!
        </p>
      </motion.div>
    </section>
  );
}
