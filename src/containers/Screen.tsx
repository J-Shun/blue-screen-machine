import { useEffect, useState } from 'react';
// import BlueScreenDeath from '../widgets/BlueScreenDeath';
import BlueScreenUpdate from '../widgets/BlueScreenUpdate';

const Screen = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0;
        }
        return prev + 1;
      });
    }, 1250);

    return () => clearInterval(interval);
  }, []);
  return <BlueScreenUpdate progress={progress} />;
};

export default Screen;
