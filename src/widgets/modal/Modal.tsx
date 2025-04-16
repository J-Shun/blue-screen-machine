const Modal = ({
  children,
  isShow,
  isShowBackground = false,
}: {
  children: React.ReactNode;
  isShow: boolean;
  isShowBackground?: boolean;
}) => {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center transition-all duration-500 cursor-default ${
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
        {children}
      </div>
    </div>
  );
};

export default Modal;
