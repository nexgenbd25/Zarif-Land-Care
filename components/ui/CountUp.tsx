'use client';

import CountUp from 'react-countup';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

interface CountUpNumberProps {
  end: number;
  duration?: number;
  delay?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export default function CountUpNumber({
  end,
  duration = 2,
  delay = 0,
  suffix = '',
  prefix = '',
  className = '',
}: CountUpNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <span ref={ref} className={className}>
      {isInView ? (
        <CountUp
          end={end}
          duration={duration}
          delay={delay}
          suffix={suffix}
          prefix={prefix}
          separator=","
        />
      ) : (
        <span>
          {prefix}0{suffix}
        </span>
      )}
    </span>
  );
}