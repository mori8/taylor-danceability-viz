// app/components/sections/ConclusionSection.js
'use client';

import { motion } from 'framer-motion';
import { useRef } from 'react';

export default function ConclusionSection() {
  const containerRef = useRef(null);

  return (
    <section className="min-h-screen bg-black text-white py-16">
      <div className="container mx-auto px-4" ref={containerRef}>
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <h2 className="text-5xl font-display font-bold mb-4">
            Why is Vigilante Shit More 'Danceable' than Shake it Off?
          </h2>
          <p className="text-xl text-gray-400">
            The answer challenges everything we thought we knew about danceability
          </p>
        </motion.div>

        {/* Key Findings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h3 className="text-3xl font-bold text-green-500">What We Expected</h3>
            <ul className="space-y-4 text-lg">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                High energy songs would be more danceable
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                Fast tempo would mean higher danceability
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                Concert favorites would have the highest scores
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h3 className="text-3xl font-bold text-green-500">What We Found</h3>
            <ul className="space-y-4 text-lg">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                Danceability measures predictability, not energy
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                Consistent rhythm patterns score higher than complex ones
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                Chart performance shows inverse relationship with danceability
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Final Thoughts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center space-y-8"
        >
          <p className="text-xl leading-relaxed">
            Vigilante Shit isn't more "danceable" than Shake it Off – it's just more predictable. 
            The irony lies in how we measure musical characteristics versus how we experience them.
          </p>
          
          <div className="h-px w-24 bg-green-500 mx-auto my-8" />
          
          <p className="text-lg text-gray-400">
            Perhaps this reveals something deeper about music analysis: 
            the gap between algorithmic measurement and human experience. 
            Sometimes the most engaging music isn't the most easily quantifiable.
          </p>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mt-16"
        >
          <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full text-lg transition-colors">
            Explore More Insights
          </button>
        </motion.div>
      </div>
    </section>
  );
}