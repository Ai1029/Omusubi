import React from "react";

interface EditButtonProps {
  onClick: () => void;
}

const EditButton: React.FC<EditButtonProps> = ({ onClick }) => {
  return (
    <div className="text-right items-right">
    <button
    onClick={onClick}
    className=" hover:text-blue-500 text-sky-300 font-bold py-2 px-4 border-b-2 border-sky-300 hover:border-blue-500">
      修正する
    </button>
    </div>
  );
};

export default EditButton;