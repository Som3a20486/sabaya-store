"use client";

import { useRouter } from "next/navigation";
import { X, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function Cart({ open, onClose }: Props) {
  const router = useRouter();

  const {
    cart,
    removeFromCart,
  } = useCart();

  if (!open) return null;

  const total = cart.reduce((sum: number, item: any) => {
    const price = Number(String(item.price).replace(/[^\d]/g, ""));
    return sum + price * (item.quantity || 1);
  }, 0);

  return (
    <>
      {/* الخلفية */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-40"
      />

      {/* السلة */}
      <div className="fixed top-0 right-0 h-screen w-[420px] bg-white z-50 shadow-2xl flex flex-col">

        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">

          <h2 className="text-2xl font-bold">
            سلة المشتريات
          </h2>

          <button onClick={onClose}>
            <X />
          </button>

        </div>

        {/* المنتجات */}
        <div className="flex-1 overflow-y-auto">

          {cart.length === 0 ? (

            <div className="text-center mt-20 text-gray-500">
              السلة فارغة
            </div>

          ) : (

            cart.map((item: any, index: number) => (

              <div
                key={index}
                className="flex gap-4 p-5 border-b"
              >

                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 rounded-xl object-cover"
                />

                <div className="flex-1">

                  <h3 className="font-bold">
                    {item.name}
                  </h3>

                  <p className="text-pink-600 mt-2">
                    {item.price}
                  </p>

                  <p className="text-sm text-gray-500">
                    الكمية: {item.quantity || 1}
                  </p>

                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 />
                </button>

              </div>

            ))

          )}

        </div>

        {/* Footer */}
        <div className="border-t p-5">

          <div className="flex justify-between text-xl font-bold mb-5">
            <span>الإجمالي</span>
            <span>{total} جنيه</span>
          </div>

          <button
            onClick={() => {
              onClose();
              router.push("/checkout");
            }}
            disabled={cart.length === 0}
            className="w-full bg-pink-600 text-white py-4 rounded-xl font-bold hover:bg-pink-700 disabled:bg-gray-400"
          >
            إتمام الطلب
          </button>

        </div>

      </div>
    </>
  );
}