import React, { useContext, useState } from "react";
import { CartContext } from "@/pages/_app";

// カートを見るページ
const QuentityButton: React.FC = () => {
  const { cart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);

  const handleIncrease = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  return (
    <>
      <div className="flex flex-col items-start gap-2">
        <div className="flex h-12 w-20 overflow-hidden rounded border">
          <p
            className="w-full px-4 py-3 outline-none ring-inset
                            ring-indigo-300 transition duration-100 focus:ring"
          >
            {quantity}
          </p>
          <div className="flex flex-col divide-y border-l">
            <button
              onClick={handleIncrease}
              className="flex w-6 flex-1 select-none items-center justify-center bg-white leading-none transition duration-100 hover:bg-gray-100 active:bg-gray-200"
            >
              +
            </button>
            <button
              onClick={handleDecrease}
              className="flex w-6 flex-1 select-none items-center justify-center bg-white leading-none transition duration-100 hover:bg-gray-100 active:bg-gray-200"
            >
              -
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuentityButton;
