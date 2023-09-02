"use client";
import { useState, useEffect } from "react";

const TIME_LIMIT = 60

function Timer() {
  const [timePassed, setTimePassed] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [remainingPathColor, setRemainingPathColor] = useState("green");
  const [timerHasStarted, setTimerHasStarted] = useState(true)

  useEffect(() => {
    if (timerHasStarted) {
      const timerInterval = setInterval(() => {
        setTimePassed((prevTimePassed) => prevTimePassed + 1);
        setTimeLeft(TIME_LIMIT - timePassed);
        setRemainingPathColor(
          timeLeft <= 10 ? "red" : timeLeft <= 20 ? "orange" : "green"
        );

        if (timeLeft === 1) {
          onTimesUp();
          clearInterval(timerInterval);
        }
      }, 1000);

      return () => clearInterval(timerInterval);
    }
  }, [timeLeft, timePassed, timerHasStarted]);

  const onTimesUp = () => {
    setTimerHasStarted(false)
  };

  // Calculate the percentage of timeLeft
  const percentage = ((TIME_LIMIT - timeLeft) / TIME_LIMIT) * 100;

  return (
    <div className="base-timer">
      <svg
        className="base-timer__svg"
        viewBox="0 0 100 10"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line
          x1="0"
          y1="10"
          x2={percentage}
          y2="10"
          stroke={remainingPathColor}
          strokeWidth="20"
        />
        {timeLeft}
      </svg>
      <span id="base-timer-label" className="base-timer__label">
        {timeLeft}
      </span>
    </div>
  );
}

export default Timer;
