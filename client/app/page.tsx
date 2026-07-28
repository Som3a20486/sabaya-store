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

  images?:string[];

  sizes?:string[];

  colors?:string[];

};









function ProductImageSlider({

  images,

  fallback,

  alt,

}:{

  images?:string[];

  fallback:string;

  alt:string;

}){



  const productImages =

    images && images.length > 0

    ? images

    : fallback

    ? [fallback]

    : [];







  const [current,setCurrent] = useState(0);








  function next(){


    if(productImages.length <= 1)

      return;



    setCurrent(prev =>

      prev === productImages.length - 1

      ? 0

      : prev + 1

    );


  }









  function prev(){


    if(productImages.length <= 1)

      return;



    setCurrent(prev =>

      prev === 0

      ? productImages.length - 1

      : prev - 1

    );


  }









  useEffect(()=>{


    if(productImages.length <= 1)

      return;




    const interval = setInterval(()=>{


      next();



    },3000);






    return ()=>clearInterval(interval);



  },[productImages.length]);












  return (


    <div className="relative overflow-hidden">







      <img

      src={productImages[current]}

      alt={alt}

      className="
      w-full
      h-72
      object-cover
      transition-all
      duration-700
      "

      />









      {
        productImages.length > 1 &&

        <>





          <button

          onClick={next}

          className="
          absolute
          right-3
          top-1/2
          -translate-y-1/2
          bg-white/90
          shadow-lg
          w-10
          h-10
          rounded-full
          text-xl
          font-bold
          z-10
          "

          >

            ❯

          </button>








          <button

          onClick={prev}

          className="
          absolute
          left-3
          top-1/2
          -translate-y-1/2
          bg-white/90
          shadow-lg
          w-10
          h-10
          rounded-full
          text-xl
          font-bold
          z-10
          "

          >

            ❮

          </button>









          <div className="
          absolute
          bottom-3
          left-0
          right-0
          flex
          justify-center
          gap-2
          ">



            {
              productImages.map((_,index)=>(


                <button

                key={index}

                onClick={()=>setCurrent(index)}

                className={`
                w-2
                h-2
                rounded-full

                ${
                  current === index
                  ?
                  "bg-pink-600"
                  :
                  "bg-white"
                }

                `}

                />


              ))

            }



          </div>







        </>


      }





    </div>


  );


}
export default function HomePage(){



  const [products,setProducts] =

    useState<Product[]>([]);



  const [loading,setLoading] =

    useState(true);








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






              <ProductImageSlider


              images={product.images}


              fallback={product.image}


              alt={product.name}


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