import { useEffect, useState } from "react";

export const useTimer = (initialTime = 0) => {
  const [secondsPassed, setSecondsPassed] = useState(initialTime);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsPassed(secondsPassed + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsPassed]);

  return secondsPassed;
};
