const BlueScreenDeath = ({ progress }: { progress: number }) => {
  const progressInt = Math.floor(progress);

  return (
    <div className='flex-1 bg-[#0078D7] text-[#EBF3FB] px-[128px] pt-[128px] '>
      <h1 className='text-[164px]'>:(</h1>
      <p className='text-3xl mb-4'>您的裝置發生問題，因此必須重新啟動。</p>
      <p className='text-3xl mb-8'>
        我們剛剛正在收集某些錯誤資訊，接著您可以重新啟動
      </p>
      <p className='text-3xl mb-8'>已完成 {progressInt}%</p>
      <p className='text-1xl mb-8'>
        如需此問題與可能修正的詳細資訊，請瀏覽 https://www.windows.com/stopcode
      </p>
      <p className='text-1xl mb-2'>致電支援人員時，請提供此資訊:</p>
      <p className='text-1xl mb-2'>停止代碼: 0x0000005</p>
      <p className='text-1xl'>失敗的項目: win32kbase.sys</p>
    </div>
  );
};

export default BlueScreenDeath;
