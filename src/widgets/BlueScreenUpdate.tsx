import Spinner from "./Spinner";

const BlueScreenUpdate = ({ progress }: { progress: number }) => {
  const progressInt = Math.floor(progress);
  return (
    <div className='flex-1 bg-[#0078D7] text-[#EBF3FB] text-2xl flex flex-col items-center justify-center gap-2'>
      <Spinner />
      <p>正在處理更新</p>
      <p>{progressInt}% 完成</p>
      <p>請勿關閉電腦</p>
    </div>
  );
};

export default BlueScreenUpdate;
