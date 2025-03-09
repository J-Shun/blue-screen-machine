import Spinner from './Spinner';

const BlueScreenUpdate = ({ progress }: { progress: number }) => {
  return (
    <div className='w-full min-h-screen bg-[#0078D7] text-[#EBF3FB] text-2xl flex flex-col items-center justify-center gap-2'>
      <Spinner />
      <p>正在處理更新</p>
      <p>{progress}% 完成</p>
      <p>請勿關閉電腦</p>
    </div>
  );
};

export default BlueScreenUpdate;
