import { useEffect, useState } from "react";
import { dateToCountdown, dateToCountdownObject } from "../../utils";

import "./styles.scss";

interface CountdownBoxProps {
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  onDismiss?: () => void;
  dismissed?: boolean;
  targetDate: Date;
}

const CountdownBox = (props: CountdownBoxProps) => {
  const [startTime, setStartTime] = useState(new Date());
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    setStartTime(new Date());
    const interval = setInterval(() => {
      setTimeElapsed((timeElapsed) => timeElapsed + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const { title, subtitle, onDismiss, dismissed, targetDate } = props;

  const time = dateToCountdownObject(targetDate, startTime, timeElapsed);

  return (
    <div className={`countdown-box ${dismissed && "dismissed"}`}>
      <div className="header">
        <div className="title">{title}</div>
        <div className="subtitle">{subtitle}</div>
      </div>
      <div className="countdown">
        {Object.keys(time).map((key) => (
          <div className="item">
            <div className="value">{(time as any)[key]}</div>
            <div className="label">{key}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountdownBox;
