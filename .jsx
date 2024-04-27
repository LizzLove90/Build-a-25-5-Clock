import React, { useState, useEffect } from 'react';
import './PomodoroClock.css';

const PomodoroClock = () => {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timerLabel, setTimerLabel] = useState('Session');
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  const handleReset = () => {
    clearInterval(intervalId);
    setBreakLength(5);
    setSessionLength(25);
    setTimerLabel('Session');
    setTimeLeft(25 * 60);
    setIsRunning(false);
    const beep = document.getElementById('beep');
    beep.pause();
    beep.currentTime = 0;
  };

  const handleBreakDecrement = () => {
    if (breakLength > 1) {
      setBreakLength(breakLength - 1);
    }
  };

  const handleBreakIncrement = () => {
    if (breakLength < 60) {
      setBreakLength(breakLength + 1);
    }
  };

  const handleSessionDecrement = () => {
    if (sessionLength > 1) {
      setSessionLength(sessionLength - 1);
      setTimeLeft((sessionLength - 1) * 60);
    }
  };

  const handleSessionIncrement = () => {
    if (sessionLength < 60) {
      setSessionLength(sessionLength + 1);
      setTimeLeft((sessionLength + 1) * 60);
    }
  };

  const handleStartStop = () => {
    if (!isRunning) {
      setIsRunning(true);
      const id = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 0) {
            const beep = document.getElementById('beep');
            beep.play();
            clearInterval(id);
            if (timerLabel === 'Session') {
              setTimerLabel('Break');
              setTimeLeft(breakLength * 60);
            } else {
              setTimerLabel('Session');
              setTimeLeft(sessionLength * 60);
            }
            return prevTime;
          }
          return prevTime - 1;
        });
      }, 1000);
      setIntervalId(id);
    } else {
      clearInterval(intervalId);
      setIsRunning(false);
    }
  };

  useEffect(() => {
    if (isRunning && timeLeft === 0) {
      const beep = document.getElementById('beep');
      beep.play();
    }
  }, [timeLeft, isRunning]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="pomodoro-clock">
      <h1>Pomodoro Clock</h1>
      <div className="settings">
        <div className="break-settings">
          <h2 id="break-label">Break Length</h2>
          <button id="break-decrement" onClick={handleBreakDecrement}>-</button>
          <span id="break-length">{breakLength}</span>
          <button id="break-increment" onClick={handleBreakIncrement}>+</button>
        </div>
        <div className="session-settings">
          <h2 id="session-label">Session Length</h2>
          <button id="session-decrement" onClick={handleSessionDecrement}>-</button>
          <span id="session-length">{sessionLength}</span>
          <button id="session-increment" onClick={handleSessionIncrement}>+</button>
        </div>
      </div>
      <div id="timer">
        <h2 id="timer-label">{timerLabel}</h2>
        <span id="time-left">{formatTime(timeLeft)}</span>
        <audio id="beep" src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"></audio>
        <button id="start_stop" onClick={handleStartStop}>{isRunning ? 'Stop' : 'Start'}</button>
        <button id="reset" onClick={handleReset}>Reset</button>
      </div>
    </div>
  );
};

export default PomodoroClock;
