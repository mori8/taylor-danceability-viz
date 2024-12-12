// app/components/sections/OpeningSection.js
'use client';

import { motion, useScroll, useTransform } from 'framer-motion';

export default function OpeningSection() {
  const { scrollY } = useScroll();
  
  const colorVideoOpacity = useTransform(
    scrollY,
    [0, 300, 600],
    [0, 0.3, 1]
  );

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Video background will go here */}
      <div className="absolute inset-0 z-20 bg-black/50" />
      
      <div className="relative z-30 container mx-auto h-full flex flex-col justify-center items-center text-white px-4">
        <motion.h1 
          className="text-6xl font-display font-bold mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Are Danceable Songs Really What You Think?
        </motion.h1>
        
        <motion.p 
          className="text-base max-w-3xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <b>Danceability</b> is one of Spotify's audio features, describing how suitable a track is for dancing. If you're like most people, you probably think of upbeat tempos, energetic rhythms, and catchy melodies that make you want to bust a move. Generally, it does.<br/><br/> But are these truly the elements that determine danceability? Here's an example that defies common intuition. Currently, <b>Taylor Swift's electrifying Eras Tour</b> is captivating audiences worldwide, making people want to dance. By analyzing the songs that re-entered the charts during Taylor Swift's The Eras Tour, let's uncover what danceability truly means—and why some of Taylor’s hits might not be as danceable as they appear.
        </motion.p>
      </div>
    </section>
  );
}