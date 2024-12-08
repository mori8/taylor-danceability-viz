// components/sections/ChartPerformanceSection.js
'use client';

import { motion } from 'framer-motion';
import ScatterPlot from '../ui/ScatterPlot';

const data = [
  {
    title: "Shake It Off",
    album_cover: "http://example.com/shake-it-off.jpg",
    album: "1989",
    danceability: 0.647,
    peak_rank: 1,
    average_rank: 3
  },
];

export default function ChartPerformanceSection() {
  return (
    <section className="min-h-screen bg-black text-white py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto"
        >
          <h2 className="text-5xl font-display font-bold mb-12 text-center">
            The Eras Tour Paradox
          </h2>

          <div className="mb-12 text-center">
            <p className="text-xl leading-relaxed">
              During The Eras Tour, something unexpected happened. While viral moments featured fans dancing to upbeat hits, the data tells a different story: songs that peaked higher on the charts during the tour actually tend to have lower danceability scores.
            </p>
          </div>

          {/* Large Scatter Plot */}
          <div className="h-[70vh] mb-12">
            <ScatterPlot data={data} />
          </div>

          {/* Key Examples */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
            <motion.div 
              className="bg-gray-900 p-8 rounded-xl"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold mb-4">High Chart Performance</h3>
              <div className="space-y-4">
                <p className="text-lg">
                  <span className="text-green-400 font-bold">Cruel Summer</span>
                  <br />Peak Position: #1
                  <br />Danceability: 0.552
                </p>
                <p className="text-gray-400">
                  Despite its upbeat tempo and energetic performance, this summer anthem has a relatively low danceability score.
                </p>
              </div>
            </motion.div>

            <motion.div 
              className="bg-gray-900 p-8 rounded-xl"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-2xl font-bold mb-4">Highest Danceability</h3>
              <div className="space-y-4">
                <p className="text-lg">
                  <span className="text-green-400 font-bold">Vigilante Shit</span>
                  <br />Peak Position: #15
                  <br />Danceability: 0.87
                </p>
                <p className="text-gray-400">
                  A slower, darker track with a steady baseline scores highest in danceability despite lower chart performance.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}