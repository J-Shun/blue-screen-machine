import { useEffect, useState } from 'react';
import BlueScreenDeath from '../widgets/BlueScreenDeath';
import BlueScreenUpdate from '../widgets/BlueScreenUpdate';
import { CgScreen } from 'react-icons/cg';
import { LuMoveRight } from 'react-icons/lu';

const SCREEN_TYPE = {
  BLUSE_SCREEN_DEATH: 'bluse_screen_death',
  BLUSE_SCREEN_UPDATE: 'bluse_screen_update',
};

const MODE_TYPE = {
  INFINITE: 'infinite',
  TIMING: 'timing',
};

type ScreenType = keyof typeof SCREEN_TYPE;

const screenTypeMapping = [
  SCREEN_TYPE.BLUSE_SCREEN_DEATH,
  SCREEN_TYPE.BLUSE_SCREEN_UPDATE,
];

const modeTypeMapping = [
  {
    text: '無限循環模式',
    value: MODE_TYPE.INFINITE,
  },
  {
    text: '定時模式',
    value: MODE_TYPE.TIMING,
  },
];

const Button = ({
  onClick,
  children,
  active,
}: {
  onClick: () => void;
  children: React.ReactNode;
  active?: boolean;
}) => {
  return (
    <button
      type='button'
      className={`hover:bg-gray-950 text-white px-4 py-2 rounded-md translation duration-200 cursor-pointer ${
        active ? 'bg-gray-950' : 'bg-gray-700'
      }`}
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
      className='bg-gray-700 hover:bg-gray-950 text-white p-2 rounded-full text-md cursor-pointer transition duration-200'
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const SideBar = ({
  isShow,
  screenType,
  isProcessing,
  onClick,
  onHide,
  onStart,
}: {
  isShow: boolean;
  screenType: ScreenType;
  isProcessing: boolean;
  onClick: ({ type }: { type: ScreenType }) => void;
  onHide: (e: React.MouseEvent) => void;
  onStart: () => void;
}) => {
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [mode, setMode] = useState(MODE_TYPE.INFINITE);

  const isFullScreen = document.fullscreenElement;

  const toggleFullscreen = () => {
    if (isFullScreen) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (isNaN(value)) return;
    if (value > 24) {
      setHour(24);
      return;
    }
    setHour(value);
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (isNaN(value)) return;
    if (value > 59) {
      setMinute(59);
      return;
    }
    setMinute(value);
  };

  return (
    <div
      className={`absolute right-0 top-0 bottom-0 w-86 flex flex-col items-start border-l-1 border-gray-200 px-4 py-12 transition-all
    duration-100 cursor-auto ${isShow ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <h2 className='w-full text-white text-3xl font-bold text-center mb-8'>
        設定選單
      </h2>

      <div className='mb-6'>
        <p className='text-white text-xl mb-2'>選擇樣式</p>
        <div className='flex gap-1'>
          {screenTypeMapping.map((type, index) => (
            <Button
              key={type}
              onClick={() => onClick({ type: type as ScreenType })}
              active={type === screenType}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </div>

      <div className='mb-6'>
        <p className='text-white text-xl mb-2'>選擇模式</p>
        <div className='flex gap-1'>
          {modeTypeMapping.map((item) => (
            <Button
              key={item.value}
              onClick={() => setMode(item.value)}
              active={mode === item.value}
            >
              {item.text}
            </Button>
          ))}
        </div>
      </div>

      {mode === MODE_TYPE.TIMING && (
        <div className='mb-6'>
          <p className='text-white text-xl mb-2'>時間設定</p>
          <input
            type='text'
            className='bg-gray-800 text-white px-4 py-2 w-20 rounded-md'
            placeholder='小時'
            onChange={handleHourChange}
            value={hour}
            min={0}
            max={24}
          />
          <span className='text-white'> : </span>

          <input
            type='text'
            className='bg-gray-800 text-white px-4 py-2 w-20 rounded-md'
            placeholder='分鐘'
            onChange={handleMinuteChange}
            value={minute}
            min={0}
            max={60}
          />
        </div>
      )}

      <div className='mb-6'>
        <Button onClick={onStart}>{isProcessing ? '暫停' : '開始'}</Button>
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
  const [isProcessing, setIsProcessing] = useState(false);

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

  const toggleStart = () => {
    setIsProcessing((prev) => !prev);
  };

  /* 更新時自動跑的數字特效 */
  useEffect(() => {
    if (!isProcessing) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0;
        }
        return prev + 1;
      });
    }, 1250);

    return () => clearInterval(interval);
  }, [isProcessing]);

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
        isShow={isShowSideBar}
        screenType={screenType as ScreenType}
        isProcessing={isProcessing}
        onClick={handleClick}
        onHide={handleHideSideBar}
        onStart={toggleStart}
      />
    </div>
  );
};

export default Screen;
