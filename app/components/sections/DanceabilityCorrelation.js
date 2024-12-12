// components/sections/DanceabilityCorrelationSection.js
'use client';

import { motion } from 'framer-motion';
import DumbbellPlot from '../ui/CorrelationDumbbell';

export default function DanceabilityCorrelationSection() {
  return (
    <section className="min-h-screen bg-gray-900 text-white py-24">
      <div className="container mx-auto px-4 flex flex-row">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mx-auto"
        >
          <h2 className="text-4xl font-display font-bold mb-12">
            What Makes Music "Danceable"?
          </h2>

          <div className="flex flex-col lg:flex-row">
            <div className="lg:pr-8 mb-12 lg:mb-0">
              <blockquote className="italic border-l-4 border-green-500 pl-6 my-8">
                "Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity."
                <footer className="text-gray-400 mt-2">- Spotify Web API</footer>
              </blockquote>

              <p className="leading-relaxed mb-8">
                This definition might not be immediately intuitive. Most people expect songs with energetic beats and loud sounds to have high danceability scores - and they're not entirely wrong.
              </p>

              <p className="leading-relaxed">
                Analysis of <a href="https://www.kaggle.com/datasets/tomigelo/spotify-audio-features" target="_blank" className='underline'>130,000 Spotify tracks</a> reveals clear correlations between danceability and other audio features that align with our intuition.
              </p>
            </div>

            {/* Correlation Visualization */}
            <div className="flex-shrink-0 rounded-xl shadow-xl">
              {/* <CorrelationHeatmap /> */}
              {/* <CorrelationNetwork /> */}
              <DumbbellPlot />
              <p className="text-gray-400 text-center mt-4">
                Correlation between audio features in 130,000 Spotify tracks
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}