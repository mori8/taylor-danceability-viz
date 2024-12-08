// app/components/ui/AudioPlayer.js
'use client';

import { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';

export default function AudioPlayer({ songUrl, songName }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);
  const waveformRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
      });
      
      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime);
      });

      return () => {
        audio.removeEventListener('loadedmetadata', () => {});
        audio.removeEventListener('timeupdate', () => {});
      };
    }
  }, []);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex items-center space-x-4 mb-4">
        <button
          onClick={togglePlayPause}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-green-500 hover:bg-green-600 transition-colors"
        >
          {isPlaying ? (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="white">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
        <div>
          <h3 className="font-bold">{songName}</h3>
          <p className="text-sm text-gray-400">
            {formatTime(currentTime)} / {formatTime(duration)}
          </p>
        </div>
      </div>

      <div className="relative h-24">
        <svg ref={waveformRef} className="w-full h-full" />
        <div 
          className="absolute bottom-0 left-0 h-1 bg-green-500"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        />
      </div>

      <audio ref={audioRef} src={songUrl} preload="metadata" />
    </div>
  );
}