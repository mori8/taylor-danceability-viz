// components/sections/Hero.js
'use client';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function Hero() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section className="h-screen relative flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-b from-tertiary/20 to-tertiary z-10" />
      
      <div 
        ref={ref}
        className="relative z-20 max-w-4xl mx-auto px-4 text-center"
      >
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-display font-semibold text-4xl md:text-6xl lg:text-7xl mb-6 text-primary"
        >
          How Taylor Swift Uses <span className="text-secondary">Danceability</span> to Orchestrate 200 Minutes of The Eras Tour?
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-secondary/60 max-w-2xl mx-auto"
        >
          An analysis of how predictable rhythms and complex melodies 
          work together to create a masterful concert experience
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
      >
        <div className="animate-bounce text-secondary/60">
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            className="w-8 h-8"
          >
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </div>
      </motion.div>
    </section>
  );
}

