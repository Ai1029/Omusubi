import React, { useState } from "react";

// カートを見るページ
const QuantityButton: React.FC<{
  userId: number;
  price: string;
  onSubtotalChange: (userId: number, newSubtotal: number) => void;
}> = ({ userId, price, onSubtotalChange }) => {
  const [quantity, setQuantity] = useState(1);

  const handleIncrease = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  const subtotal = Number(price) * quantity;
  onSubtotalChange(userId, subtotal); // 小計を計算

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
      <div className="ml-4 pt-3 md:ml-8 md:pt-2 lg:ml-16">
        <span className="block font-bold text-gray-800 md:text-lg">
          {subtotal}円
        </span>
      </div>
    </>
  );
};

export default QuantityButton;
