// components/sections/CoreQuestion.js
'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function CoreQuestion() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section ref={ref} className="max-w-5xl mx-auto px-4 space-y-16 w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center w-full"
      >
        <h2 className="text-3xl md:text-4xl font-display text-primary mb-6">
        The Role of Danceability in a Long Performance
        </h2>
        <div className="relative">
        <Image src="/low-danceability.png" alt="Low Danceability" width={480} height={200} className="absolute -left-[70%] top-0" />
        <div className="max-w-3xl space-y-8 text-center">
          <p className="text-base text-obsidian/80 leading-relaxed">
            A concert is not just an event that lists hit songs. If the entire show consists only of low-danceability music filled with dramatic melodies to support her excellent lyrical delivery, the audience can become overwhelmed and tired. The key insight is that &apos;danceability&apos; means more than just how easy it is to dance to a song. It represents something more basic: the predictability of rhythm, stability of beats, and an acoustic environment that doesn&apos;t require endless effort to interpret. Highly danceable tracks provide moments of emotional rest where listeners can naturally follow a steady pulse, catch their breath, and prepare for the next complex section.
          </p>
          <p className="text-base text-obsidian/80 leading-relaxed">
            In other words, while less danceable songs draw listeners into emotional depth, more danceable songs help maintain attention in the long run. These songs let the audience relax, release tension, and stay engaged. Danceability appears not as just a musical quality but as a strategic tool, letting audiences navigate the complex emotional landscape of a concert for hours.
          </p>
        </div>
        <Image src="/high-danceability.png" alt="High Danceability" width={480} height={200} className="absolute -right-[70%] top-0" />
</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className=""
      >
      </motion.div>
    </section>
  );
}
