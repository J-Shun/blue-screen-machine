import { useEffect, useState } from 'react';
import BlueScreenDeath from '../widgets/BlueScreenDeath';
import BlueScreenUpdate from '../widgets/BlueScreenUpdate';
import { CgScreen } from 'react-icons/cg';
import { LuMoveRight } from 'react-icons/lu';

const SCREEN_TYPE = {
  BLUSE_SCREEN_DEATH: 'bluse_screen_death',
  BLUSE_SCREEN_UPDATE: 'bluse_screen_update',
};

type ScreenType = keyof typeof SCREEN_TYPE;

const screenTypeMapping = [
  SCREEN_TYPE.BLUSE_SCREEN_DEATH,
  SCREEN_TYPE.BLUSE_SCREEN_UPDATE,
];

const Button = ({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) => {
  return (
    <button
      type='button'
      className='bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md translation duration-200 cursor-pointer'
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const IconButton = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
}) => {
  return (
    <button
      type='button'
      className='bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full text-md cursor-pointer transition duration-200'
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const SideBar = ({
  isShow,
  onClick,
  onHide,
}: {
  isShow: boolean;
  onClick: ({ type }: { type: ScreenType }) => void;
  onHide: (e: React.MouseEvent) => void;
}) => {
  const isFullScreen = document.fullscreenElement;

  const toggleFullscreen = () => {
    if (isFullScreen) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  return (
    <div
      className={`absolute right-0 top-0 bottom-0 w-86 flex flex-col items-start border-l-1 border-gray-200 px-4 py-12 transition-all
    duration-100 cursor-auto ${isShow ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <h2 className='w-full text-white text-3xl font-bold text-center mb-6'>
        設定選單
      </h2>

      <div className='mb-4'>
        <p className='text-white text-xl mb-2'>選擇樣式</p>
        <div className='flex gap-1'>
          {screenTypeMapping.map((type, index) => (
            <Button
              key={type}
              onClick={() => onClick({ type: type as ScreenType })}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </div>

      <div className='flex gap-2'>
        <IconButton onClick={toggleFullscreen}>
          <CgScreen />
        </IconButton>

        <IconButton onClick={onHide}>
          <LuMoveRight />
        </IconButton>
      </div>
    </div>
  );
};

const Screen = () => {
  const [progress, setProgress] = useState(0);
  const [screenType, setScreenType] = useState(SCREEN_TYPE.BLUSE_SCREEN_DEATH);
  const [isShowSideBar, setIsShowSideBar] = useState(true);

  const handleClick = ({ type }: { type: ScreenType }) => {
    setScreenType(type);
  };

  const handleHideSideBar = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsShowSideBar(false);
  };

  const handleShowSideBar = () => {
    setIsShowSideBar(true);
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
    <div
      className='w-full min-h-screen flex flex-col relative overflow-hidden cursor-none'
      id='screen'
      onClick={handleShowSideBar}
    >
      {screenType === SCREEN_TYPE.BLUSE_SCREEN_DEATH && (
        <BlueScreenDeath progress={progress} />
      )}

      {screenType === SCREEN_TYPE.BLUSE_SCREEN_UPDATE && (
        <BlueScreenUpdate progress={progress} />
      )}

      <SideBar
        onClick={handleClick}
        isShow={isShowSideBar}
        onHide={handleHideSideBar}
      />
    </div>
  );
};

export default Screen;
