import React, { useContext } from "react";
import { CartContext } from "@/pages/_app";

type Plan = {
  id: number;
  name: string;
  explanation: string;
  price: string;
  image: string;
};

type PlanProps = {
  data: Plan[];
};

type CartState = {
  id: number;
  name: string;
  price: string;
};

// 商品一覧ページ
const Shop: React.FC<PlanProps> = ({ data }) => {
  const { cart, addToCart, removeFromCart } = useContext(CartContext);

  return (
    <div className="container mt-10 flex justify-between items-center mx-auto px-8 md:px-14 lg:px-24 w-full">
      <section>
        <p className="second-title">SHOP</p>
        <p>定期便</p>
        <p>※写真はイメージです</p>
        <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4  mb-10">
          {data ? (
            data.map((product) => (
              <>
                <ProductItem
                  key={product.id}
                  product={product}
                  cart={cart}
                  addToCart={addToCart}
                  removeFromCart={removeFromCart}
                />
              </>
            ))
          ) : (
            <p>準備中...</p>
          )}
        </div>
      </section>
    </div>
  );
};
export default Shop;

// プラン一覧の各プランを表示するコンポーネント
export const ProductItem: React.FC<{
  product: Plan;
  cart: CartState[];
  addToCart: (product: Plan) => void;
  removeFromCart: (product: Plan) => void;
}> = ({ product, cart, addToCart, removeFromCart }) => {
  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleRemoveFromCart = () => {
    removeFromCart(product);
  };

  return (
    <div>
      <div
        key={product.id}
        className="mx-auto flex w-50 flex-col justify-center bg-white rounded-2xl shadow-xl shadow-gray-400/20"
      >
        <img
          className="aspect-video w-50 rounded-t-2xl object-cover object-center"
          src={product.image}
          alt={product.name}
        />
        <div className="flex flex-col justify-between h-full p-6">
          <h1 className="text-2xl font-medium text-gray-700 pb-2">
            {product.name}
          </h1>
          <p className="text text-gray-500 leading-6">{product.explanation}</p>
          <p className="text text-gray-500 leading-6">{product.price}円</p>
        </div>
        <div className="flex justify-center mt-4 mb-4">
          <div className="rounded-lg">
            {cart.find((item) => item.id === product.id) ? (
              <div>
                <p className="text-xs mb-3">カートに商品が入っています</p>
                <button
                  onClick={handleRemoveFromCart}
                  className="items-center block w-full h-full px-4 py-2 text-sm font-medium text-center text-blue-600 transition duration-500 ease-in-out transform border-2 border-blue-500 rounded-md"
                >
                  取り消し
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                className="items-center block w-full h-full px-4 py-2 text-sm font-medium text-center text-blue-600 transition duration-500 ease-in-out transform border-2 border-blue-500 rounded-md"
              >
                ＋カートに入れる
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
