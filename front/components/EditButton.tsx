import React from "react";

interface EditButtonProps {
  onClick: () => void;
}

const EditButton: React.FC<EditButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className=" hover:text-blue-700 text-sky-500 font-bold py-2 px-4 rounded"
    >
      編集する
    </button>
  );
};

export default EditButton;