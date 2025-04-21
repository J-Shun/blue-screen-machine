import { useTranslation } from "react-i18next";

const BlueScreenDeath = ({ progress }: { progress: number }) => {
  const { t, i18n } = useTranslation();

  const progressInt = Math.floor(progress);

  return (
    <div className='flex-1 bg-[#0078D7] text-[#EBF3FB] px-[128px] pt-[128px] '>
      {i18n.language !== "ja" && <p className='text-[164px]'>:(</p>}

      <p className='text-3xl mb-4'>{t("blueScreen.info")}</p>
      <p className='text-3xl mb-8'>{t("blueScreen.gatherError")}</p>
      <p className='text-3xl mb-8'>
        {t("blueScreen.complete", { progress: progressInt })}
      </p>
      <p className='text-1xl mb-8'>{t("blueScreen.detail")}</p>
      <p className='text-1xl mb-2'>{t("blueScreen.needInfo")}</p>
      <p className='text-1xl mb-2'>{t("blueScreen.errorCode")} 0x0000005</p>
      <p className='text-1xl'>{t("blueScreen.failedData")} win32kbase.sys</p>
    </div>
  );
};

export default BlueScreenDeath;
