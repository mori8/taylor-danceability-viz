// components/sections/Conclusion.js
'use client';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function Conclusion() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section ref={ref} className="space-y-16 pb-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="space-y-8"
      >
        <h2 className="text-3xl md:text-4xl font-display text-tertiary">
          Choreographing an Emotional Journey Through Predictable Beats
        </h2>
        
        <p className="text-xl text-secondary/80 leading-relaxed">
          Throughout The Eras Tour, danceability emerges as more than just a measure 
          of how "danceable" a song is—it's a sophisticated tool for emotional 
          pacing and audience engagement.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        <div className="bg-secondary/5 p-8 rounded-lg">
          <h3 className="text-xl font-semibold text-accent mb-4">Strategic Waves</h3>
          <p className="text-secondary/80 leading-relaxed">
            The alternation between low and high danceability creates rhythmic waves 
            that help maintain audience energy throughout the three-hour performance.
          </p>
        </div>
        
        <div className="bg-secondary/5 p-8 rounded-lg">
          <h3 className="text-xl font-semibold text-accent mb-4">Era Progression</h3>
          <p className="text-secondary/80 leading-relaxed">
            The careful arrangement of eras, culminating in high-danceability pop 
            segments, builds toward a natural and energetic finale.
          </p>
        </div>
        
        <div className="bg-secondary/5 p-8 rounded-lg">
          <h3 className="text-xl font-semibold text-accent mb-4">Track Placement</h3>
          <p className="text-secondary/80 leading-relaxed">
            Strategic positioning of tracks, especially the iconic Track 5s, creates 
            emotional peaks and valleys that keep the audience engaged.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="bg-tertiary/10 p-8 rounded-lg text-center"
      >
        <p className="text-xl font-display text-tertiary mb-4">
          The Final Note
        </p>
        <p className="text-lg text-secondary/80 leading-relaxed max-w-3xl mx-auto">
          Through this careful orchestration of danceability, Taylor Swift transforms 
          what could be an exhausting marathon into a masterfully paced journey. 
          Each song's placement, each era's sequence, contributes to a larger 
          narrative that keeps audiences captivated from the first note to the last.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="text-center pt-16"
      >
        <p className="text-sm text-secondary/60">
          Analysis and Visualization by [Your Name]<br/>
          Data sourced from Spotify API
        </p>
      </motion.div>
    </section>
  );
}