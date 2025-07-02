'use client';

import { useEffect, useState } from 'react';

export function Progress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev + 1) % 100);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <progress className="progress progress-primary w-56 mt-5 rounded-full" value={progress} />
  );
}
