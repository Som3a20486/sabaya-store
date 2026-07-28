"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  sizes?: string[];
  colors?: string[];
};

function ProductContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  useEffect(() => {
    if (id) {
      getProduct();
    } else {
      setLoading(false);
    }
  }, [id]);

  async function getProduct() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.log(error);
      setLoading(false);
      return;
    }

    setProduct(data);
    setLoading(false);
  }

  function addToCart() {
    if (!product) return;

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const existingIndex = cart.findIndex(
      (item: Product & { quantity: number; selectedSize?: string; selectedColor?: string }) =>
        item.id === product.id &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
    );

    if (existingIndex !== -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
        selectedSize,
        selectedColor,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    window.dispatchEvent(new Event("cartUpdated"));

    alert("تم إضافة المنتج للسلة 🛒");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        جاري تحميل المنتج...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-10 text-center">
        المنتج غير موجود
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-8 grid md:grid-cols-2 gap-10">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-[500px] object-cover rounded-3xl"
        />

        <div>
          <p className="text-pink-600 font-bold">
            {product.category}
          </p>

          <h1 className="text-4xl font-black mt-3">
            {product.name}
          </h1>

          <p className="text-3xl font-bold text-pink-600 mt-6">
            {product.price} جنيه
          </p>

          <p className="text-gray-600 mt-6 leading-8">
            {product.description}
          </p>

          {product.sizes && product.sizes.length > 0 && (
            <div className="mt-8">
              <h3 className="font-bold mb-3">المقاسات</h3>

              <div className="flex gap-3 flex-wrap">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`border px-5 py-2 rounded-xl ${
                      selectedSize === size
                        ? "bg-pink-600 text-white"
                        : ""
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.colors && product.colors.length > 0 && (
            <div className="mt-8">
              <h3 className="font-bold mb-3">الألوان</h3>

              <div className="flex gap-3 flex-wrap">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-full ${
                      selectedColor === color
                        ? "bg-pink-600 text-white"
                        : "bg-pink-100"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={addToCart}
            className="bg-pink-600 text-white w-full py-4 rounded-xl mt-10 font-bold"
          >
            🛒 أضف إلى السلة
          </button>
        </div>
      </div>
    </main>
  );
}

export default function ProductPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          جاري تحميل المنتج...
        </div>
      }
    >
      <ProductContent />
    </Suspense>
  );
}