import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import BlueScreenDeath from "../widgets/BlueScreenDeath";
import BlueScreenUpdate from "../widgets/BlueScreenUpdate";
import MacUpdate from "../widgets/MacUpdate";
import { MdRemoveRedEye } from "react-icons/md";
import { Button, IconButton } from "../widgets/button";
import { getOS } from "../utils/common";

const SCREEN_TYPE = {
  BLUE_SCREEN_DEATH: "blueScreenDeath",
  BLUE_SCREEN_UPDATE: "blueScreenUpdate",
  MAC_UPDATE: "macUpdate",
};

const MODE_TYPE = {
  INFINITE: "infinite",
  TIMING: "timing",
};

type ScreenType = keyof typeof SCREEN_TYPE;

const Modal = ({
  isShow,
  screenType,
  isProcessing,
  onClick,
  onStart,
  onReset,
}: {
  isShow: boolean;
  screenType: ScreenType;
  isProcessing: boolean;
  onClick: ({ type }: { type: ScreenType }) => void;
  onStart: () => void;
  onReset: () => void;
}) => {
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [mode, setMode] = useState(MODE_TYPE.INFINITE);
  const [isShowBackground, setIsShowBackground] = useState(false);

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

  const reset = () => {
    setHour(0);
    setMinute(0);
    onReset();
  };

  const handleMouseDown = () => {
    setIsShowBackground(true);
  };

  const handleMouseUp = () => {
    setIsShowBackground(false);
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center transition-all duration-500 ${
        isShow
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      } ${isShowBackground ? "" : "backdrop-filter backdrop-blur-lg"}`}
    >
      <div
        className={`w-116 bg-gray-800 py-12 px-6 rounded-2xl shadow-lg flex flex-col items-start transition-all duration-500 ${
          isShowBackground ? "opacity-0" : "opacity-100"
        }`}
      >
        <h2 className='w-full text-white text-3xl font-bold text-center mb-8'>
          設定選單
        </h2>

        <div className='mb-8'>
          <p className='text-white text-xl mb-3'>選擇樣式</p>
          <div className='flex gap-2'>
            <Button
              onClick={() =>
                onClick({ type: SCREEN_TYPE.BLUE_SCREEN_DEATH as ScreenType })
              }
              active={screenType === SCREEN_TYPE.BLUE_SCREEN_DEATH}
            >
              Windows 藍屏
            </Button>
            <Button
              onClick={() =>
                onClick({ type: SCREEN_TYPE.BLUE_SCREEN_UPDATE as ScreenType })
              }
              active={screenType === SCREEN_TYPE.BLUE_SCREEN_UPDATE}
            >
              Windows 更新
            </Button>
            <Button
              onClick={() =>
                onClick({ type: SCREEN_TYPE.MAC_UPDATE as ScreenType })
              }
              active={screenType === SCREEN_TYPE.MAC_UPDATE}
            >
              Mac 更新
            </Button>
          </div>
        </div>

        <div className='mb-8'>
          <p className='text-white text-xl mb-3'>選擇模式</p>
          <div className='flex gap-2'>
            <Button
              onClick={() => setMode(MODE_TYPE.INFINITE)}
              active={mode === MODE_TYPE.INFINITE}
            >
              無限循環
            </Button>

            <Button
              onClick={() => setMode(MODE_TYPE.TIMING)}
              active={mode === MODE_TYPE.TIMING}
            >
              定時
            </Button>
          </div>
        </div>

        {mode === MODE_TYPE.TIMING && (
          <div className='mb-8'>
            <p className='text-white text-xl mb-3'>時間設定</p>
            <input
              type='text'
              className='bg-gray-800 text-white px-4 py-2 w-20 rounded-md border-2 border-gray-600'
              placeholder='小時'
              onChange={handleHourChange}
              value={hour}
              min={0}
              max={24}
            />

            <span className='text-white px-2'> : </span>

            <input
              type='text'
              className='bg-gray-800 text-white px-4 py-2 w-20 rounded-md border-2 border-gray-600'
              placeholder='分鐘'
              onChange={handleMinuteChange}
              value={minute}
              min={0}
              max={60}
            />
          </div>
        )}

        <div className='flex gap-2 mb-8'>
          <Button onClick={onStart}>{isProcessing ? "暫停" : "開始"}</Button>
          <Button onClick={reset}>重置</Button>
        </div>

        <div>
          <Tooltip anchorSelect='.show-background' place='top'>
            持續點擊以顯示背景
          </Tooltip>
          <a className='show-background' data-tooltip-offset={10}>
            <IconButton onMouseUp={handleMouseUp} onMouseDown={handleMouseDown}>
              <MdRemoveRedEye />
            </IconButton>
          </a>
        </div>
      </div>
    </div>
  );
};

const Screen = () => {
  const [progress, setProgress] = useState(0);
  const [screenType, setScreenType] = useState(SCREEN_TYPE.BLUE_SCREEN_DEATH);
  const [isShowSideBar, setIsShowSideBar] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClick = ({ type }: { type: ScreenType }) => {
    setScreenType(type);
  };

  const handleStart = () => {
    setIsProcessing(true);
    setIsShowSideBar(false);
    document.documentElement.requestFullscreen();
  };

  const handleReset = () => {
    setProgress(0);
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
    }, 1000);

    return () => clearInterval(interval);
  }, [isProcessing]);

  /* 根據作業系統選擇不同的螢幕樣式 */
  useEffect(() => {
    const os = getOS();

    switch (os) {
      case "Windows":
        setScreenType(SCREEN_TYPE.BLUE_SCREEN_DEATH);
        break;
      case "MacOS":
        setScreenType(SCREEN_TYPE.MAC_UPDATE);
        break;
      default:
        setScreenType(SCREEN_TYPE.MAC_UPDATE);
        break;
    }
  }, []);

  /* 如果跳出全螢幕，就出現 Modal 並停止計算 */
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsShowSideBar(true);
        setIsProcessing(false);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <div className='w-full min-h-screen flex flex-col relative overflow-hidden'>
      {screenType === SCREEN_TYPE.BLUE_SCREEN_DEATH && (
        <BlueScreenDeath progress={progress} />
      )}

      {screenType === SCREEN_TYPE.BLUE_SCREEN_UPDATE && (
        <BlueScreenUpdate progress={progress} />
      )}

      {screenType === SCREEN_TYPE.MAC_UPDATE && (
        <MacUpdate progress={progress} />
      )}

      <Modal
        isShow={isShowSideBar}
        screenType={screenType as ScreenType}
        isProcessing={isProcessing}
        onClick={handleClick}
        onStart={handleStart}
        onReset={handleReset}
      />
    </div>
  );
};

export default Screen;
