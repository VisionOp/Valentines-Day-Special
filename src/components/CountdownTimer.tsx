import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CountdownTime } from '../types';

const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<CountdownTime>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const valentinesDay = new Date(new Date().getFullYear(), 1, 14); // February 14
      if (valentinesDay.getTime() < Date.now()) {
        valentinesDay.setFullYear(valentinesDay.getFullYear() + 1);
      }

      const difference = valentinesDay.getTime() - Date.now();
      
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white/80 backdrop-blur-lg rounded-full px-6 py-2 shadow-lg"
    >
      <div className="flex items-center gap-4 text-gray-800">
        <div className="text-center">
          <div className="text-2xl font-bold">{timeLeft.days}</div>
          <div className="text-xs uppercase">Days</div>
        </div>
        <div className="text-pink-500 font-bold">:</div>
        <div className="text-center">
          <div className="text-2xl font-bold">{timeLeft.hours}</div>
          <div className="text-xs uppercase">Hours</div>
        </div>
        <div className="text-pink-500 font-bold">:</div>
        <div className="text-center">
          <div className="text-2xl font-bold">{timeLeft.minutes}</div>
          <div className="text-xs uppercase">Mins</div>
        </div>
        <div className="text-pink-500 font-bold">:</div>
        <div className="text-center">
          <div className="text-2xl font-bold">{timeLeft.seconds}</div>
          <div className="text-xs uppercase">Secs</div>
        </div>
      </div>
    </motion.div>
  );
};

export default CountdownTimer;