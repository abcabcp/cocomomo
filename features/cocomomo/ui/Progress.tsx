'use client';

import { useEffect, useState } from 'react';

export function Progress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const calculateLoadProgress = () => {
      const perf = window.performance;
      if (perf) {
        const navEntry = perf.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

        if (navEntry) {
          const loadTime = navEntry.loadEventEnd - navEntry.startTime;
          const currentTime = Date.now() - navEntry.startTime;
          setProgress(Math.min(100, (currentTime / loadTime) * 100));
        }
      } else {
        setProgress(prev => Math.min(prev + 10, 95));
      }
    };

    const interval = setInterval(calculateLoadProgress, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-[17%] bg-gray-200 rounded-full h-4 mt-4 bg-gray-700">
      <div className="bg-blue-600 h-full rounded-full" style={{ width: `${progress}%` }} />
    </div>
  );
}