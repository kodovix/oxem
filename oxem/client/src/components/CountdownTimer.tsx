import { useState, useEffect } from "react";
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from "date-fns";

interface CountdownTimerProps {
  targetDate: Date;
  className?: string;
}

export default function CountdownTimer({ targetDate, className = "" }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      
      if (targetDate <= now) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = differenceInDays(targetDate, now);
      const hours = differenceInHours(targetDate, now) % 24;
      const minutes = differenceInMinutes(targetDate, now) % 60;
      const seconds = differenceInSeconds(targetDate, now) % 60;

      setTimeLeft({ days, hours, minutes, seconds });
    };

    // Update immediately
    updateCountdown();

    // Set up interval to update every second
    const interval = setInterval(updateCountdown, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [targetDate]);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className={`flex justify-between text-center ${className}`}>
      <div>
        <p className="text-lg font-bold text-blue-600">{formatNumber(timeLeft.days)}</p>
        <p className="text-xs text-gray-600">Days</p>
      </div>
      <div>
        <p className="text-lg font-bold text-blue-600">{formatNumber(timeLeft.hours)}</p>
        <p className="text-xs text-gray-600">Hours</p>
      </div>
      <div>
        <p className="text-lg font-bold text-blue-600">{formatNumber(timeLeft.minutes)}</p>
        <p className="text-xs text-gray-600">Minutes</p>
      </div>
      <div>
        <p className="text-lg font-bold text-blue-600">{formatNumber(timeLeft.seconds)}</p>
        <p className="text-xs text-gray-600">Seconds</p>
      </div>
    </div>
  );
}
