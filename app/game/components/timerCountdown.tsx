"use client";
import { useEffect, useState } from "react";

const TIME_LIMIT = 30;

export interface ITimerProps {
  handleTimesUp: Function;
  timerHasStarted: boolean;
}

export default function Timer({ handleTimesUp, timerHasStarted }: ITimerProps) {
  const [timePassed, setTimePassed] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [remainingPathColor, setRemainingPathColor] = useState("green");

  useEffect(() => {
    if (timerHasStarted) {
      const timerInterval = setInterval(() => {
        setTimePassed((prevTimePassed) => prevTimePassed + 1);
        setTimeLeft(TIME_LIMIT - timePassed);
        setRemainingPathColor(
          timeLeft <= 5 ? "red" : timeLeft <= 10 ? "orange" : "green"
        );

        if (timeLeft === 1) {
          handleTimesUp();
          clearInterval(timerInterval);
        }
      }, 1000);

      return () => clearInterval(timerInterval);
    }
  }, [timeLeft, timePassed, timerHasStarted]);

  // Calculate the percentage of timeLeft
  const percentage = ((TIME_LIMIT - timeLeft) / TIME_LIMIT) * 100;

  return (
    <svg
      viewBox="0 0 100 5"
      xmlns="http://www.w3.org/2000/svg"
      style={{ border: "2px solid " + remainingPathColor, borderRadius: "5px" }}
      data-testid="timer-container"
    >
      <line
        x1="0"
        y1="5"
        x2={percentage}
        y2="5"
        stroke={remainingPathColor}
        strokeWidth="20"
        className="transition-all"
      />
      {timeLeft}
    </svg>
  );
}
