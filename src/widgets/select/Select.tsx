import { useState } from "react";
import useClickOutside from "../../hooks/useClickOutside";

const Select = ({
  value,
  hourOptions,
  handleClick,
  placeholder,
}: {
  value: string;
  hourOptions: { text: string; value: string; id: string }[];
  handleClick: (e: React.MouseEvent<HTMLLIElement>) => void;
  placeholder?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const hourRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false));
  const text = hourOptions.find((option) => option.value === value)?.text || "";

  return (
    <span
      className='relative inline-block w-20 text-center bg-gray-800 text-white px-4 py-2 rounded-md border-2 border-gray-600 hover:cursor-pointer'
      onClick={() => setIsOpen(!isOpen)}
      ref={hourRef}
    >
      {text ? (
        <span>{text}</span>
      ) : (
        <span className='text-gray-400'>{placeholder}</span>
      )}

      {isOpen && (
        <ul className='absolute left-0 top-full w-full mt-1 border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto z-10'>
          {hourOptions.map((option) => (
            <li
              key={option.id}
              className='p-2 text-center bg-gray-800 hover:bg-gray-950 cursor-pointer'
              onClick={handleClick}
              data-value={option.value}
            >
              {option.text}
            </li>
          ))}
        </ul>
      )}
    </span>
  );
};

export default Select;
