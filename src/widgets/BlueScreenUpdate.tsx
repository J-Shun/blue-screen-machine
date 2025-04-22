import Spinner from "./Spinner";
import { useTranslation } from "react-i18next";

const BlueScreenUpdate = ({ progress }: { progress: number }) => {
  const { t } = useTranslation();
  const progressInt = Math.floor(progress);
  return (
    <div className='flex-1 bg-[#0078D7] text-[#EBF3FB] text-2xl flex flex-col items-center justify-center gap-2'>
      <Spinner />
      <p>{t("windowsUpdate.info")}</p>
      <p>{t("windowsUpdate.progress", { progress: progressInt })}</p>
      <p>{t("windowsUpdate.warning")}</p>
    </div>
  );
};

export default BlueScreenUpdate;
