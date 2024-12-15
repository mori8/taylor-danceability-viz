// components/sections/SetlistAnalysis.js
'use client';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import DanceabilityChart from '../ui/DanceabilityChart';

export default function SetlistAnalysis() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section ref={ref} className="space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto px-4 space-y-8"
      >
        <p className="text-base text-obsidian/80 leading-relaxed">
          As we trace the danceability through the entire setlist, we can see how Taylor 
          carefully orchestrates waves of energy, creating a dynamic flow that keeps the 
          audience engaged throughout the 195-minute performance.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className=""
      >
        <DanceabilityChart />
        <p className="text-sm text-secondary/60 mt-4 text-center">
          Hover over points to see song details. Background colors indicate different eras.
        </p>
      </motion.div>
    </section>
  );
}