"use client";
import { motion } from "framer-motion";

import Hero from "./components/sections/Hero";
import Introduction from "./components/sections/Introduction";
import CoreQuestion from "./components/sections/CoreQuestion";
import SetlistAnalysis from "./components/sections/SetlistAnalysis";
import EraAnalysis from "./components/sections/EraAnalysis";
import Conclusion from "./components/sections/Conclusion";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <motion.div
        className="space-y-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Introduction />
        <CoreQuestion />
        <EraAnalysis />
        <SetlistAnalysis />
        <Conclusion />
      </motion.div>
    </main>
  );
}
