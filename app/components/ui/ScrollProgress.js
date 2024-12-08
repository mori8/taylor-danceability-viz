// app/components/ui/ScrollProgress.js
'use client';

import { useScrollProgress } from '@/app/hooks/useScrollProgress';

export default function ScrollProgress() {
  const progress = useScrollProgress();

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-50">
      <div 
        className="h-full bg-green-500"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}