// components/sections/ChartPerformanceSection.js
"use client";

import { motion } from "framer-motion";
import ScatterPlot from "../ui/ScatterPlot";

export default function ChartPerformanceSection() {
  return (
    <section className="min-h-screen bg-cream text-obsidian py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mx-auto flex flex-col items-center"
        >
          <div className="max-w-5xl mb-12 text-center">
            <p className="text-2xl font-display font-bold mb-8">
              Think you know what makes a song danceable? Here's a case that
              might surprise you...
            </p>
            <p className="">
              During the{" "}
              <a
                href="https://en.wikipedia.org/wiki/The_Eras_Tour"
                target="_blank"
                className="underline"
              >
                Taylor Swift's The Eras Tour
              </a>
              , something unexpected happened. While viral moments featured fans
              dancing to upbeat hits, the data tells a different story: songs
              that peaked higher on the charts during the tour actually tend to
              have lower danceability scores. Indeed, chart-topping hits like
              'Cruel Summer', 'Blank Space', and 'Karma' - all characterized by
              their energetic beats and high emotional valence - demonstrate
              this puzzling pattern. These songs, despite being perfect for
              stadium-wide dance parties, somehow score lower on Spotify's
              danceability metric.
            </p>
          </div>

          {/* Large Scatter Plot */}
          <div className="mb-12">
            <ScatterPlot />
          </div>

          {/* Key Examples */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
            <motion.div
              className="bg-gray-900 p-8 rounded-xl"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold mb-4">
                High Chart Performance
              </h3>
              <div className="space-y-4">
                <p className="text-lg">
                  <span className="text-cherry font-bold">Cruel Summer</span>
                  <br />
                  Peak Position: #2
                  <br />
                  Danceability: 0.552
                </p>
                <p className="text-gray-400">
                  Despite its upbeat tempo and energetic performance, this
                  summer anthem has a relatively low danceability score.
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
                  <span className="text-cherry font-bold">
                    Vigilante Shit
                  </span>
                  <br />
                  Peak Position: #15
                  <br />
                  Danceability: 0.87
                </p>
                <p className="text-gray-400">
                  A slower, darker track with a steady baseline scores highest
                  in danceability despite lower chart performance.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
