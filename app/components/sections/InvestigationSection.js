// app/components/sections/InvestigationSection.js
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import AnimatedGraph from '../ui/AnimatedGraph';

const features = {
  tempo: 'Tempo Analysis',
  rhythm: 'Rhythm Patterns',
  energy: 'Energy Levels',
  valence: 'Emotional Valence'
};

export default function InvestigationSection() {
  const [selectedFeature, setSelectedFeature] = useState('tempo');
  
  return (
    <section className="min-h-screen bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <h2 className="text-4xl font-display font-bold">
            What Makes These Songs Different?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature Selection */}
            <div className="space-y-4">
              <p className="text-xl">
                Let's break down the musical elements that contribute to danceability.
              </p>
              
              <div className="space-y-2">
                {Object.entries(features).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedFeature(key)}
                    className={`block w-full text-left p-4 rounded-lg transition-colors ${
                      selectedFeature === key 
                        ? 'bg-green-600' 
                        : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Visualization */}
            <div className="bg-gray-800 rounded-lg p-6">
              <AnimatedGraph 
                data={[
                  { name: 'Vigilante Shit', tempo: 0.8, rhythm: 0.9, energy: 0.4, valence: 0.3 },
                  { name: 'Shake It Off', tempo: 0.9, rhythm: 0.7, energy: 0.8, valence: 0.9 },
                  { name: 'Cruel Summer', tempo: 0.75, rhythm: 0.6, energy: 0.7, valence: 0.8 }
                ]} 
                feature={selectedFeature}
              />
            </div>
          </div>

          {/* Analysis Text */}
          <motion.div
            className="max-w-2xl mx-auto mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          >
            <h3 className="text-2xl font-bold mb-4">Understanding the Patterns</h3>
            <p className="text-lg leading-relaxed">
              When we look at these patterns closely, we can see that songs with higher danceability scores often feature more consistent and predictable rhythm patterns, regardless of their tempo or energy levels.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}