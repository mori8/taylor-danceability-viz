// components/sections/Conclusion.js
"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";

export default function Conclusion() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className="space-y-16 pb-32 relative h-screen">
      <div className="absolute inset-0 z-0">
        <Image
          src="/confetti-taylor.png"
          alt="Hero background"
          fill
          priority
          className="object-cover z-0"
          sizes="100vw"
          quality={90}
        />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="space-y-12 max-w-5xl mx-auto"
      >
        <p className="text-base text-obsidian/80 leading-relaxed">
          In the end, Taylor Swift employs danceability as more than just a
          measure of a track’s dance-friendliness. Instead, it becomes a
          foundational tool for shaping the emotional contour of a lengthy
          concert. By understanding the genre-driven differences between eras,
          the emotional patterns of specific tracks (especially the iconic fifth
          track), and how these elements intertwine in the setlist, one can see
          how a three-hour show remains consistently engaging. Low-danceability
          songs present challenging emotional depths, while high-danceability
          moments provide predictable rhythms and a light, refreshing mood.
          Swift’s careful curation of era transitions and track arrangements
          ensures that the audience never feels lost or weary.
        </p>
        <h2 className="text-3xl md:text-4xl font-display text-primary pr-20">
          Danceability emerges as the key to maintaining tension, excitement,
          and immersion throughout a long, narrative-rich live performance.
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="text-center pt-16"
      >
        <p className="text-sm text-secondary/60">
          Analysis and Visualization by Sooyohn Nam
          <br />
          Data sourced from Spotify API
        </p>
      </motion.div>
    </section>
  );
}
