"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Shirt,
  ShoppingBag,
  Gem,
  Smartphone,
  Footprints,
} from "lucide-react";

const categories = [
  {
    name: "ملابس",
    icon: Shirt,
    color: "from-pink-500 to-rose-500",
  },
  {
    name: "أحذية",
    icon: Footprints,
    color: "from-fuchsia-500 to-pink-600",
  },
  {
    name: "حقائب",
    icon: ShoppingBag,
    color: "from-purple-500 to-pink-500",
  },
  {
    name: "إكسسوارات",
    icon: Gem,
    color: "from-yellow-400 to-orange-500",
  },
  {
    name: "إلكترونيات",
    icon: Smartphone,
    color: "from-cyan-500 to-blue-600",
  },
];

export default function CategorySection() {
  return (
    <section className="py-20 bg-white">

      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-5xl font-black text-center text-pink-600">
          تسوق حسب القسم
        </h2>

        <p className="text-center text-gray-500 mt-3 mb-12">
          اختار القسم اللي يناسبك
        </p>

        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-8">

          {categories.map((category, index) => {
            const Icon = category.icon;

            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <Link
                  href={`/products?category=${encodeURIComponent(category.name)}`}
                  className="group block"
                >
                  <div
                    className={`rounded-3xl p-8 text-white bg-gradient-to-br ${category.color}
                    hover:scale-105 duration-300 shadow-xl hover:shadow-2xl`}
                  >
                    <Icon
                      className="mx-auto group-hover:rotate-12 duration-300"
                      size={60}
                    />

                    <h3 className="text-2xl font-bold text-center mt-6">
                      {category.name}
                    </h3>

                    <p className="text-center mt-2 text-white/90">
                      اضغط للتسوق
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

      </div>

    </section>
  );
}