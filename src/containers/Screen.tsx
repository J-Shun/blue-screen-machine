import { useEffect, useState } from 'react';
import BlueScreenDeath from '../widgets/BlueScreenDeath';
import BlueScreenUpdate from '../widgets/BlueScreenUpdate';

const SCREEN_TYPE = {
  BLUSE_SCREEN_DEATH: 'bluse_screen_death',
  BLUSE_SCREEN_UPDATE: 'bluse_screen_update',
};

const Screen = () => {
  const [progress, setProgress] = useState(0);
  const [screenType, setScreenType] = useState(SCREEN_TYPE.BLUSE_SCREEN_DEATH);

  const handleClick = () => {
    setScreenType((prev) => {
      if (prev === SCREEN_TYPE.BLUSE_SCREEN_DEATH) {
        return SCREEN_TYPE.BLUSE_SCREEN_UPDATE;
      }
      return SCREEN_TYPE.BLUSE_SCREEN_DEATH;
    });
  };

  /* 更新時自動跑的數字特效 */
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

  return (
    <div className='w-full min-h-screen flex flex-col'>
      {screenType === SCREEN_TYPE.BLUSE_SCREEN_DEATH && (
        <BlueScreenDeath progress={progress} />
      )}

      {screenType === SCREEN_TYPE.BLUSE_SCREEN_UPDATE && (
        <BlueScreenUpdate progress={progress} />
      )}

      <button
        type='button'
        onClick={handleClick}
      >
        更換畫面
      </button>
    </div>
  );
};

export default Screen;
