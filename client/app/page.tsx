"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";



type Product = {

  id:number;

  name:string;

  price:number;

  description:string;

  category:string;

  image:string;

  sizes?:string[];

  colors?:string[];

};





export default function HomePage(){



  const [products,setProducts] =

    useState<Product[]>([]);



  const [loading,setLoading] =

    useState(true);







  useEffect(()=>{


    getProducts();


  },[]);








  async function getProducts(){



    const {data,error} =

      await supabase

      .from("products")

      .select("*")

      .order("id",{

        ascending:false

      });






    if(error){

      console.log(
        "Products Error:",
        error
      );

      setLoading(false);

      return;

    }






    if(data){

      setProducts(
        data as Product[]
      );

    }




    setLoading(false);



  }








  if(loading){


    return (

      <div className="
      min-h-screen
      flex
      items-center
      justify-center
      text-xl
      ">

        جاري تحميل المنتجات...

      </div>

    );


  }









  return (


    <main className="
    bg-gray-50
    min-h-screen
    p-6
    ">






      <section className="
      text-center
      py-14
      bg-pink-100
      rounded-3xl
      mb-10
      ">



        <h1 className="
        text-5xl
        font-black
        text-pink-600
        ">

          Sabaya Store 🛍️

        </h1>





        <p className="
        text-xl
        mt-5
        text-gray-700
        ">

          أناقتك تبدأ من هنا 💗

        </p>





        <p className="
        mt-3
        text-gray-600
        ">

          أحدث صيحات الموضة والحقائب والأحذية والإكسسوارات

        </p>




        <Link

        href="/products"

        className="
        inline-block
        mt-8
        bg-pink-600
        text-white
        px-10
        py-4
        rounded-full
        font-bold
        "

        >

          تصفح المنتجات

        </Link>




      </section>









      <section>


        <h2 className="
        text-3xl
        font-bold
        mb-8
        text-center
        ">

          أحدث المنتجات

        </h2>








        {
          products.length === 0 ?



          <div className="
          bg-white
          rounded-3xl
          shadow
          p-10
          text-center
          text-gray-500
          ">

            لا يوجد منتجات حالياً

          </div>





          :





          <div className="
          grid
          md:grid-cols-4
          gap-6
          ">



          {
            products.map(product=>(


              <div

              key={product.id}

              className="
              bg-white
              rounded-3xl
              shadow
              overflow-hidden
              hover:shadow-xl
              transition
              "

              >






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





                  <p className="
                  text-pink-600
                  text-sm
                  ">

                    {product.category}

                  </p>






                  <h3 className="
                  text-xl
                  font-bold
                  mt-2
                  ">

                    {product.name}

                  </h3>







                  <p className="
                  font-bold
                  text-lg
                  mt-3
                  ">

                    {product.price} جنيه

                  </p>







                  <Link

                  href={`/product?id=${product.id}`}

                  className="
                  block
                  text-center
                  mt-5
                  bg-black
                  text-white
                  py-3
                  rounded-xl
                  "

                  >

                    عرض المنتج

                  </Link>





                </div>






              </div>



            ))

          }



          </div>



        }




      </section>





    </main>


  );


}