"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, Eye, ShoppingBag, Star } from "lucide-react";
import { useCart } from "../context/CartContext";

type Product = {
  name: string;
  price: string;
  image: string;
};

export default function ProductCard({ name, price, image }: Product) {
    const { addToCart } = useCart();
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.5 }}
      className="group bg-white rounded-[30px] overflow-hidden shadow-xl hover:shadow-2xl duration-500"
    >
      <div className="relative overflow-hidden">

        {/* Badge */}
        <div className="absolute left-4 top-4 z-20 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
          -30%
        </div>

        {/* Icons */}
        <div className="absolute right-4 top-4 z-20 flex flex-col gap-3">

          <button className="bg-white p-3 rounded-full shadow-lg hover:bg-pink-600 hover:text-white transition">
            <Heart size={18} />
          </button>

          <button className="bg-white p-3 rounded-full shadow-lg hover:bg-pink-600 hover:text-white transition">
            <Eye size={18} />
          </button>

        </div>

        {/* Image */}

        <Image
          src={image}
          alt={name}
          width={500}
          height={500}
          className="w-full h-[420px] object-cover group-hover:scale-110 duration-700"
        />

        {/* Overlay */}

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 duration-500 flex items-center justify-center">

          <button className="bg-white text-pink-600 px-7 py-3 rounded-full font-bold flex items-center gap-2">

            <ShoppingBag size={20} />

            اشترِ الآن

          </button>

        </div>

      </div>

      <div className="p-6">

        <div className="flex justify-center gap-1 text-yellow-400 mb-3">

          <Star fill="currentColor" size={18}/>
          <Star fill="currentColor" size={18}/>
          <Star fill="currentColor" size={18}/>
          <Star fill="currentColor" size={18}/>
          <Star fill="currentColor" size={18}/>

        </div>

        <h3 className="text-2xl font-bold text-center">
          {name}
        </h3>

        <p className="text-center text-gray-500 mt-3">
          خامات ممتازة وجودة عالية.
        </p>

        <p className="text-center text-pink-600 text-3xl font-extrabold mt-5">
          {price}
        </p>

        <button
  onClick={() =>
    addToCart({
      name,
      price,
      image,
    })
  }
  className="w-full mt-6 bg-gradient-to-r from-pink-600 to-rose-500 text-white py-4 rounded-2xl font-bold hover:scale-105 duration-300"
>
  أضف إلى السلة
</button>


      </div>
    </motion.div>
  );
}