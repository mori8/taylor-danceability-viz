// app/components/sections/DeepDiveSection.js
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import AudioPlayer from '../ui/AudioPlayer';
import RadarChart from '../ui/RadarChart';

const songData = {
  'Vigilante Shit': {
    url: '/audio/vigilante-shit.mp3',
    features: {
      danceability: 0.87,
      energy: 0.4,
      valence: 0.3,
      tempo: 0.5,
      loudness: 0.6
    }
  },
  'Shake It Off': {
    url: '/audio/shake-it-off.mp3',
    features: {
      danceability: 0.647,
      energy: 0.8,
      valence: 0.9,
      tempo: 0.85,
      loudness: 0.9
    }
  },
  'Cruel Summer': {
    url: '/audio/cruel-summer.mp3',
    features: {
      danceability: 0.552,
      energy: 0.7,
      valence: 0.8,
      tempo: 0.75,
      loudness: 0.8
    }
  }
};

export default function DeepDiveSection() {
  const [selectedSong, setSelectedSong] = useState(null);
  const [isComparing, setIsComparing] = useState(false);
  const [compareSong, setCompareSong] = useState(null);

  const handleSongSelect = (songName) => {
    if (isComparing && selectedSong) {
      setCompareSong(songName);
    } else {
      setSelectedSong(songName);
    }
  };

  return (
    <section className="min-h-screen bg-black text-white py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-4xl font-display font-bold mb-4">
            The Deep Dive
          </h2>
          <p className="text-xl text-gray-300">
            Let's analyze how these songs differ in their musical characteristics.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {Object.entries(songData).map(([songName, data]) => (
            <motion.div
              key={songName}
              className={`bg-gray-900 rounded-lg p-6 ${
                selectedSong === songName ? 'ring-2 ring-green-500' : ''
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-2xl font-bold mb-4">{songName}</h3>
              <AudioPlayer 
                songUrl={data.url}
                songName={songName}
              />
              <div className="mt-6">
                <RadarChart features={data.features} />
              </div>
              <button
                onClick={() => handleSongSelect(songName)}
                className="mt-4 w-full px-4 py-2 bg-green-600 rounded-full hover:bg-green-700 transition-colors"
              >
                {selectedSong === songName ? 'Selected' : 'Select for Analysis'}
              </button>
            </motion.div>
          ))}
        </div>

        {selectedSong && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-900 rounded-lg p-6"
          >
            <h3 className="text-2xl font-bold mb-4">Detailed Analysis</h3>
            {/* 여기에 선택된 곡의 상세 분석 내용 추가 */}
          </motion.div>
        )}
      </div>
    </section>
  );
}