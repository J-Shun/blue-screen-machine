import { AiFillApple } from "react-icons/ai";

const MacUpdate = ({ progress }: { progress: number }) => {
  const progressInt = Math.floor(progress);
  return (
    <div className='flex flex-col items-center justify-center flex-1 bg-black text-white'>
      <div className='mb-12 text-[128px]'>
        <AiFillApple />
      </div>

      <div className='w-1/6'>
        <span className='loader-bar'>
          <span
            className='loader-process'
            style={{
              width: `${progressInt}%`,
            }}
          />
        </span>
      </div>
    </div>
  );
};

export default MacUpdate;
