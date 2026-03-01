import { useState, useEffect, useRef } from 'react';
import { spinners, SpinnerName } from './spinners';

export function useSpinner(name: SpinnerName, speed: number = 1, paused: boolean = false) {
  const def = spinners[name];
  const [frame, setFrame] = useState(0);
  const frameRef = useRef(0);

  useEffect(() => {
    if (paused) return;
    const interval = def.interval / speed;
    const id = setInterval(() => {
      frameRef.current = (frameRef.current + 1) % def.frames.length;
      setFrame(frameRef.current);
    }, interval);
    return () => clearInterval(id);
  }, [name, speed, paused, def.interval, def.frames.length]);

  return def.frames[frame];
}
