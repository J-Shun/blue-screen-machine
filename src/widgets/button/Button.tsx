const Button = ({
  onClick,
  children,
  active,
}: {
  onClick: () => void;
  children: React.ReactNode;
  active?: boolean;
}) => {
  return (
    <button
      type='button'
      className={`hover:bg-gray-950 text-white px-4 py-2 rounded-md translation duration-200 cursor-pointer whitespace-nowrap ${
        active ? "bg-gray-950" : "bg-gray-700"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
