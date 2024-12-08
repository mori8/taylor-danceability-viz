// components/sections/DanceabilityCorrelationSection.js
'use client';

import { motion } from 'framer-motion';
import CorrelationHeatmap from '../ui/CorrelationHeatmap';

const correlationData = [
  { feature: "Emotional valence", correlation: 0.46 },
  { feature: "Loudness", correlation: 0.43 },
  { feature: "Energy", correlation: 0.30 },
  // ... 더 많은 상관관계 데이터
];

export default function DanceabilityCorrelationSection() {
  return (
    <section className="min-h-screen bg-gray-900 text-white py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-5xl font-display font-bold mb-12 text-center">
            What Makes Music "Danceable"?
          </h2>

          <div className="mb-12">
            <blockquote className="text-xl italic border-l-4 border-green-500 pl-6 my-8">
              "Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity."
              <footer className="text-gray-400 mt-2">- Spotify Web API</footer>
            </blockquote>

            <p className="text-xl leading-relaxed mb-8">
              This definition might not be immediately intuitive. Most people expect songs with energetic beats and loud sounds to have high danceability scores - and they're not entirely wrong.
            </p>

            <p className="text-xl leading-relaxed">
              Analysis of 130,000 Spotify tracks reveals clear correlations between danceability and other audio features that align with our intuition.
            </p>
          </div>

          {/* Correlation Visualization */}
          <div className="bg-gray-800 rounded-xl p-8 shadow-xl">
            <CorrelationHeatmap data={correlationData} />
            <p className="text-gray-400 text-center mt-4">
              Correlation between audio features in 130,000 Spotify tracks
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}