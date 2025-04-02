const IconButton = ({
  children,
  onClick,
  onMouseUp,
  onMouseDown,
}: {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  onMouseUp?: (e: React.MouseEvent) => void;
  onMouseDown?: (e: React.MouseEvent) => void;
}) => {
  return (
    <button
      type='button'
      className='bg-gray-700 hover:bg-gray-950 text-white p-2 rounded-full text-md cursor-pointer transition duration-200'
      onClick={onClick}
      onMouseUp={onMouseUp}
      onMouseDown={onMouseDown}
    >
      {children}
    </button>
  );
};

export default IconButton;
