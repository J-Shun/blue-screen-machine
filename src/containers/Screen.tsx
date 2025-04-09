import { useEffect, useState, useRef } from "react";
import Select from "../widgets/select";
import Modal from "../widgets/modal";
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

const hourOptions = Array.from({ length: 25 }, (_, i) => {
  const value = i < 10 ? `0${i}` : `${i}`;
  return {
    text: value,
    value: `${i}`,
    id: `hour-${value}`,
  };
});

const minuteOptions = Array.from({ length: 60 }, (_, i) => {
  const value = i < 10 ? `0${i}` : `${i}`;
  return {
    text: value,
    value: `${i}`,
    id: `minute-${value}`,
  };
});

const Screen = () => {
  const [progress, setProgress] = useState(0);
  const [screenType, setScreenType] = useState(SCREEN_TYPE.BLUE_SCREEN_DEATH);
  const [isShowSideBar, setIsShowSideBar] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [mode, setMode] = useState(MODE_TYPE.INFINITE);
  const [isShowBackground, setIsShowBackground] = useState(false);

  const requestRef = useRef<number | null>(null);

  const hourInSeconds = parseInt(hour) * 3600 * 1000 || 0;
  const minuteInSeconds = parseInt(minute) * 60 * 1000 || 0;
  const totalTime = hourInSeconds + minuteInSeconds;

  const handleClick = (type: ScreenType) => {
    setScreenType(type);
  };

  const handleStart = () => {
    setIsProcessing(true);
    setIsShowSideBar(false);
    document.documentElement.requestFullscreen();
  };

  const handleHourClick = (e: React.MouseEvent<HTMLLIElement>) => {
    const value = (e.target as HTMLLIElement).getAttribute("data-value");
    setHour(value as string);
  };

  const handleMinuteClick = (e: React.MouseEvent<HTMLLIElement>) => {
    const value = (e.target as HTMLLIElement).getAttribute("data-value");
    setMinute(value as string);
  };

  const handleReset = () => {
    setHour("");
    setMinute("");
    setProgress(0);
  };

  const handleMouseDown = () => {
    setIsShowBackground(true);
  };

  const handleMouseUp = () => {
    setIsShowBackground(false);
  };

  /* 更新時自動跑的特效 */
  useEffect(() => {
    if (!isProcessing) return;

    const start = performance.now();
    const totalDuration = totalTime;

    // 初期速度占比
    const fastEnd = totalDuration * 0.5;

    // 中期結束點
    const pauseEnd = totalDuration * 0.85;

    // 中期波動幅度
    const pauseAmplitude = 2;

    const animate = (now: number) => {
      const elapsed = now - start;
      let progress = 0;

      if (elapsed < fastEnd) {
        // 初期快速前進到 80%
        const t = elapsed / fastEnd;
        progress = t * 80; // 直接快速前進到 80%
      } else if (elapsed < pauseEnd) {
        // 中期幾乎不動，可能在 80~85% 微波動
        const t = (elapsed - fastEnd) / (pauseEnd - fastEnd);
        progress = 80 + Math.sin(t * Math.PI * 4) * pauseAmplitude;
      } else if (elapsed < totalDuration) {
        // 後期慢慢到 100%
        const t = (elapsed - pauseEnd) / (totalDuration - pauseEnd);
        progress = 85 + t * 15; // 85% -> 100%
      } else {
        progress = 100;
      }

      setProgress((prev) => Math.max(prev, Math.min(progress, 100)));

      if (elapsed < totalDuration) {
        requestRef.current = requestAnimationFrame(animate);
      } else {
        setProgress(100); // 保底
      }
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isProcessing, totalTime]);

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

      <Modal isShow={isShowSideBar} isShowBackground={isShowBackground}>
        <h2 className='w-full text-white text-3xl font-bold text-center mb-8'>
          設定選單
        </h2>

        <div className='mb-8'>
          <p className='text-white text-xl mb-3'>選擇樣式</p>
          <div className='flex gap-2'>
            <Button
              onClick={() =>
                handleClick(SCREEN_TYPE.BLUE_SCREEN_DEATH as ScreenType)
              }
              active={screenType === SCREEN_TYPE.BLUE_SCREEN_DEATH}
            >
              Windows 藍屏
            </Button>
            <Button
              onClick={() =>
                handleClick(SCREEN_TYPE.BLUE_SCREEN_UPDATE as ScreenType)
              }
              active={screenType === SCREEN_TYPE.BLUE_SCREEN_UPDATE}
            >
              Windows 更新
            </Button>
            <Button
              onClick={() => handleClick(SCREEN_TYPE.MAC_UPDATE as ScreenType)}
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

            <Select
              placeholder='小時'
              value={hour}
              hourOptions={hourOptions}
              handleClick={handleHourClick}
            />

            <span className='text-white px-2'> : </span>

            <Select
              placeholder='分鐘'
              value={minute}
              hourOptions={minuteOptions}
              handleClick={handleMinuteClick}
            />
          </div>
        )}

        <div className='flex gap-2 mb-8'>
          <Button onClick={handleStart}>開始</Button>
          <Button onClick={handleReset}>重置</Button>
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
      </Modal>
    </div>
  );
};

export default Screen;
