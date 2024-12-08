// app/components/sections/ParadoxSection.js
'use client';

import { motion } from 'framer-motion';
import ScatterPlot from '../ui/ScatterPlot';

const sampleData = [
  {
    title: "Shake It Off",
    album_cover: "http://example.com/shake-it-off.jpg",
    album: "1989",
    danceability: 0.647,
    peak_rank: 1,
    average_rank: 3
  },
];

export default function ParadoxSection() {
  return (
    <section className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Panel */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h2 className="text-4xl font-display font-bold">What We Expected</h2>
            <p className="text-lg">
              When songs re-enter the charts during a stadium tour, you'd expect the most danceable tracks to perform better. After all, isn't that what concerts are about?
            </p>
            <ul className="space-y-4 text-lg">
              <li>• High danceability = Better chart performance</li>
              <li>• Concert favorites rise faster</li>
              <li>• Upbeat songs lead the revival</li>
            </ul>
          </motion.div>

          {/* Right Panel */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-display font-bold mb-6">What We Found</h2>
            <ScatterPlot data={sampleData} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}