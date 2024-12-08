// app/components/sections/OpeningSection.js
'use client';

import { useEffect, useState } from 'react';
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
          className="text-xl max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          'danceability'는 스포티파이에서 제공하는 음악 특성 중 하나입니다.
          If you're like most people, you probably think of upbeat tempos, energetic rhythms, and catchy melodies that make you want to move.
          테일러 스위프트의 투어 기간 중 스포티파이에 재진입한 곡들을 분석하며, 'danceability'가 실제로 무엇을 의미하는지 알아보자.
        </motion.p>
      </div>
    </section>
  );
}