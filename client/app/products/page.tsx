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




export default function ProductsPage(){


  const [products,setProducts] = useState<Product[]>([]);

  const [loading,setLoading] = useState(true);




  useEffect(()=>{

    getProducts();

  },[]);






  async function getProducts(){


    const {data,error}=

      await supabase

      .from("products")

      .select("*")

      .order("id",{
        ascending:false
      });




    if(error){

      console.log(error);

      setLoading(false);

      return;

    }




    setProducts(data as Product[]);

    setLoading(false);


  }








  if(loading){

    return (

      <div className="
      min-h-screen
      flex
      justify-center
      items-center
      ">

        جاري تحميل المنتجات...

      </div>

    );

  }







  return (

    <main className="
    min-h-screen
    bg-gray-50
    p-6
    ">


      <h1 className="
      text-4xl
      font-bold
      text-pink-600
      mb-10
      text-center
      ">

        جميع المنتجات 🛍️

      </h1>







      {
        products.length === 0 ?


        <div className="
        bg-white
        p-10
        rounded-3xl
        shadow
        text-center
        ">

          لا يوجد منتجات

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



                <p className="
                text-pink-600
                ">

                  {product.category}

                </p>





                <h2 className="
                text-xl
                font-bold
                mt-2
                ">

                  {product.name}

                </h2>






                <p className="
                font-bold
                mt-3
                ">

                  {product.price} جنيه

                </p>






                <Link

                href={`/product?id=${product.id}`}

                className="
                block
                mt-5
                bg-black
                text-white
                text-center
                py-3
                rounded-xl
                "

                >

                  عرض التفاصيل

                </Link>




              </div>





            </div>



          ))

        }



        </div>


      }



    </main>

  );


}