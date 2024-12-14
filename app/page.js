'use client';
import { motion } from 'framer-motion';

import Hero from './components/sections/Hero';
import Introduction from './components/sections/Introduction';
import CoreQuestion from './components/sections/CoreQuestion';
import SetlistAnalysis from './components/sections/SetlistAnalysis';
import EraAnalysis from './components/sections/EraAnalysis';
import TrackAnalysis from './components/sections/TrackAnalysis';
import Conclusion from './components/sections/Conclusion';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <motion.div 
        className="max-w-5xl mx-auto px-4 py-16 space-y-32"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Introduction />
        <CoreQuestion />
        <SetlistAnalysis />
        <EraAnalysis />
        <TrackAnalysis />
        <Conclusion />
      </motion.div>
    </main>
  );
}