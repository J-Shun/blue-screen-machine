import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import Select from "../widgets/select";
import Modal from "../widgets/modal";
import { Tooltip } from "react-tooltip";
import BlueScreenDeath from "../widgets/BlueScreenDeath";
import BlueScreenUpdate from "../widgets/BlueScreenUpdate";
import MacUpdate from "../widgets/MacUpdate";
import { MdRemoveRedEye } from "react-icons/md";
import { Button, IconButton } from "../widgets/button";
import { getOS } from "../utils";
import toast from "react-hot-toast";

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
  const { t, i18n } = useTranslation();

  const [progress, setProgress] = useState(0);
  const [screenType, setScreenType] = useState(SCREEN_TYPE.BLUE_SCREEN_DEATH);
  const [isShowSideBar, setIsShowSideBar] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const [hour, setHour] = useState("0");
  const [minute, setMinute] = useState("0");
  const [mode, setMode] = useState(MODE_TYPE.INFINITE);
  const [isShowBackground, setIsShowBackground] = useState(false);

  const requestRef = useRef<number | null>(null);

  const hourInSeconds = parseInt(hour) * 3600 * 1000 || 0;
  const minuteInSeconds = parseInt(minute) * 60 * 1000 || 0;
  const manualTime = hourInSeconds + minuteInSeconds;
  const totalTime = mode === MODE_TYPE.INFINITE ? 60 * 1000 : manualTime;

  const handleClick = (type: ScreenType) => {
    setScreenType(type);
  };

  const handleLanguageClick = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const handleStart = () => {
    if (mode === MODE_TYPE.TIMING && !totalTime) {
      toast.error(t("toast.noTime"));
      return;
    }

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
    setHour("0");
    setMinute("0");
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

    let start = performance.now();
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

      // 如果是無限循環模式，則重置開始時間 & 重置進度條
      if (mode === MODE_TYPE.INFINITE && progress >= 100) {
        start = performance.now();
        setProgress(0);
        requestRef.current = requestAnimationFrame(animate);
      }

      // 如果是定時模式，則結束後跳出全螢幕
      if (mode === MODE_TYPE.TIMING && progress >= 100) {
        setIsProcessing(false);
        setIsShowSideBar(true);
        setProgress(0);
        document.exitFullscreen();
      }
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isProcessing, mode, totalTime]);

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
        setProgress(0);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <div className='w-full min-h-screen flex flex-col relative overflow-hidden cursor-none'>
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
          {t("option")}
        </h2>

        <div className='mb-8'>
          <p className='text-white text-xl mb-3'></p>
          <div className='flex gap-2'>
            <Button
              onClick={() => handleLanguageClick("zh-TW")}
              active={i18n.language === "zh-TW"}
            >
              中文
            </Button>
            <Button
              onClick={() => handleLanguageClick("en")}
              active={i18n.language === "en"}
            >
              English
            </Button>
            <Button
              onClick={() => handleLanguageClick("ja")}
              active={i18n.language === "ja"}
            >
              日本語
            </Button>
          </div>
        </div>

        <div className='mb-8'>
          <p className='text-white text-xl mb-3'>{t("selectDisplay")}</p>
          <div className='flex gap-2 flex-wrap'>
            <Button
              onClick={() =>
                handleClick(SCREEN_TYPE.BLUE_SCREEN_DEATH as ScreenType)
              }
              active={screenType === SCREEN_TYPE.BLUE_SCREEN_DEATH}
            >
              {t("background.windowsBlueScreen")}
            </Button>
            <Button
              onClick={() =>
                handleClick(SCREEN_TYPE.BLUE_SCREEN_UPDATE as ScreenType)
              }
              active={screenType === SCREEN_TYPE.BLUE_SCREEN_UPDATE}
            >
              {t("background.windowsUpdate")}
            </Button>
            <Button
              onClick={() => handleClick(SCREEN_TYPE.MAC_UPDATE as ScreenType)}
              active={screenType === SCREEN_TYPE.MAC_UPDATE}
            >
              {t("background.macUpdate")}
            </Button>
          </div>
        </div>

        <div className='mb-8'>
          <p className='text-white text-xl mb-3'>{t("selectMode")}</p>
          <div className='flex gap-2'>
            <Tooltip anchorSelect='.infinite-tip' place='top'>
              {t("tooltip.loopInfo")}
            </Tooltip>
            <a className='infinite-tip' data-tooltip-offset={10}>
              <Button
                onClick={() => setMode(MODE_TYPE.INFINITE)}
                active={mode === MODE_TYPE.INFINITE}
              >
                {t("loop")}
              </Button>
            </a>

            <Button
              onClick={() => setMode(MODE_TYPE.TIMING)}
              active={mode === MODE_TYPE.TIMING}
            >
              {t("timer")}
            </Button>
          </div>
        </div>

        {mode === MODE_TYPE.TIMING && (
          <div className='mb-8'>
            <p className='text-white text-xl mb-3'>{t("timerOption")}</p>

            <Select
              placeholder={t("hour")}
              value={hour}
              hourOptions={hourOptions}
              handleClick={handleHourClick}
            />

            <span className='text-white px-2'> : </span>

            <Select
              placeholder={t("minute")}
              value={minute}
              hourOptions={minuteOptions}
              handleClick={handleMinuteClick}
            />
          </div>
        )}

        <div className='flex gap-2 mb-8'>
          <Button onClick={handleStart}>{t("start")}</Button>
          <Button onClick={handleReset}>{t("reset")}</Button>
        </div>

        <div>
          <Tooltip anchorSelect='.show-background' place='top'>
            {t("tooltip.clickToShowBackground")}
          </Tooltip>
          <a className='show-background' data-tooltip-offset={20}>
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
