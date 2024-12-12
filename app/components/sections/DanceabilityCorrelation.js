// components/sections/DanceabilityCorrelationSection.js
"use client";

import { motion } from "framer-motion";
import DumbbellPlot from "../ui/CorrelationDumbbell";

export default function DanceabilityCorrelationSection() {
  return (
    <section className="bg-cream text-obsidian py-20">
      <div className="container mx-auto px-4 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mx-auto"
        >
          <div className="w-3/5 mx-auto flex flex-col items-end mb-20">
            <p className="font-display text-2xl text-center">
              "<b>Danceability</b> describes how suitable a track is for dancing based
              on a combination of musical elements including tempo, rhythm
              stability, beat strength, and overall regularity."
            </p>
            <footer className="text-slate-800 mt-2 font-light">- Spotify Web API</footer>
          </div>
          <div className="flex flex-col lg:flex-row">
            <div className="lg:pr-8 mb-12 lg:mb-0">
              <p className="mb-8">
                This definition might not be immediately intuitive. Most people
                expect songs with energetic beats and loud sounds to have high
                danceability scores - and they're <b>not</b> entirely wrong.
              </p>

              <p className="">
                Analysis of{" "}
                <a
                  href="https://www.kaggle.com/datasets/tomigelo/spotify-audio-features"
                  target="_blank"
                  className="underline"
                >
                  130,000 Spotify tracks
                </a>{" "}
                reveals clear correlations between danceability and other audio
                features that align with our intuition.
              </p>
            </div>

            <div className="flex-shrink-0">
              <DumbbellPlot />
              <p className="text-slate-500 text-center mt-4 text-sm">
                Correlation between danceability and other audio features in 130,000 Spotify tracks
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
