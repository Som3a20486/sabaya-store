"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
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

const categories = [
  "الكل",
  "ملابس",
  "أحذية",
  "حقائب",
  "إكسسوارات",
  "إلكترونيات",
];


function ProductsContent() {

  const searchParams = useSearchParams();

  const selectedCategory =
    searchParams.get("category") || "الكل";


  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    getProducts();
  }, []);



  async function getProducts() {

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", {
        ascending: false,
      });


    if (error) {

      console.log(error);
      setLoading(false);
      return;

    }


    setProducts(data as Product[]);
    setLoading(false);

  }



  const filteredProducts = useMemo(() => {

    if (selectedCategory === "الكل")
      return products;


    return products.filter(
      (product) =>
        product.category === selectedCategory
    );


  }, [products, selectedCategory]);





  if (loading) {

    return (

      <div className="
      min-h-screen
      flex
      items-center
      justify-center
      text-2xl
      font-bold
      text-pink-600
      ">

        جاري تحميل المنتجات...

      </div>

    );

  }





  return (

    <main className="
    min-h-screen
    bg-gradient-to-b
    from-pink-50
    via-white
    to-white
    py-12
    px-6
    ">


      <div className="
      max-w-7xl
      mx-auto
      ">


        <h1 className="
        text-5xl
        font-black
        text-center
        text-pink-600
        ">

          {selectedCategory === "الكل"
            ? "جميع المنتجات 🛍️"
            : `قسم ${selectedCategory}`}

        </h1>



        <p className="
        text-center
        text-gray-500
        mt-4
        text-lg
        ">

          اكتشف أحدث المنتجات المختارة بعناية

        </p>




        <div className="
        flex
        flex-wrap
        justify-center
        gap-4
        mt-10
        mb-12
        ">


          {categories.map((category)=>{


            const count =
              category === "الكل"
              ? products.length
              : products.filter(
                  (p)=>p.category === category
                ).length;



            return (

              <Link

              key={category}

              href={
                category === "الكل"
                ? "/products"
                : `/products?category=${encodeURIComponent(category)}`
              }


              className={`px-6 py-3 rounded-full font-bold transition-all duration-300 ${
                selectedCategory === category
                ? "bg-pink-600 text-white shadow-xl scale-105"
                : "bg-white hover:bg-pink-100 text-gray-700 shadow"
              }`}

              >

                {category} ({count})

              </Link>

            );


          })}


        </div>






        {filteredProducts.length === 0 ? (

          <div className="
          bg-white
          rounded-3xl
          shadow-xl
          p-16
          text-center
          ">

            <h2 className="
            text-3xl
            font-bold
            text-gray-500
            ">

              لا توجد منتجات داخل هذا القسم حالياً

            </h2>

          </div>


        ) : (


          <div className="
          grid
          md:grid-cols-2
          lg:grid-cols-4
          gap-8
          ">


            {filteredProducts.map((product)=>(


              <div

              key={product.id}

              className="
              bg-white
              rounded-3xl
              overflow-hidden
              shadow-lg
              hover:shadow-pink-300
              hover:-translate-y-2
              duration-300
              ">

                <img

                src={product.image}

                alt={product.name}

                className="
                w-full
                h-72
                object-cover
                "

                />



                <div className="p-5">


                  <span className="
                  inline-block
                  bg-pink-100
                  text-pink-600
                  px-3
                  py-1
                  rounded-full
                  text-sm
                  font-bold
                  ">

                    {product.category}

                  </span>



                  <h2 className="
                  text-2xl
                  font-bold
                  mt-4
                  line-clamp-2
                  ">

                    {product.name}

                  </h2>




                  <p className="
                  text-pink-600
                  text-2xl
                  font-black
                  mt-4
                  ">

                    {product.price} جنيه

                  </p>




                  <Link

                  href={`/product?id=${product.id}`}

                  className="
                  block
                  mt-6
                  text-center
                  bg-gradient-to-r
                  from-pink-600
                  to-rose-500
                  text-white
                  py-3
                  rounded-2xl
                  font-bold
                  hover:scale-105
                  duration-300
                  "

                  >

                    عرض التفاصيل

                  </Link>



                </div>


              </div>


            ))}


          </div>


        )}


      </div>


    </main>

  );

}





export default function ProductsPage(){

  return (

    <Suspense

    fallback={

      <div className="
      min-h-screen
      flex
      items-center
      justify-center
      ">

        جاري التحميل...

      </div>

    }

    >

      <ProductsContent />

    </Suspense>

  );

}