"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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



const categories = [

  "الكل",

  "ملابس",

  "أحذية",

  "حقائب",

  "إكسسوارات",

  "إلكترونيات",

];






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



    const interval=setInterval(()=>{


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
        duration-700
        transition-all
        group-hover:scale-110
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

export default function ProductsPage(){


  return (

    <Suspense

      fallback={

        <div className="
        min-h-screen
        flex
        items-center
        justify-center
        text-xl
        ">

          جاري التحميل...

        </div>

      }

    >

      <ProductsContent />

    </Suspense>

  );

}







function ProductsContent(){


  const searchParams = useSearchParams();



  const selectedCategory =

    searchParams.get("category") || "الكل";





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







  const filteredProducts = useMemo(()=>{


    if(selectedCategory === "الكل")

      return products;



    return products.filter(

      (product)=>

        product.category === selectedCategory

    );


  },[products,selectedCategory]);







  if(loading){


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


          {
            selectedCategory === "الكل"

            ?

            "جميع المنتجات 🛍️"

            :

            `قسم ${selectedCategory}`

          }


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

              ?

              products.length

              :

              products.filter(

                (p)=>

                p.category === category

              ).length;





            return (


              <Link

                key={category}

                href={

                  category === "الكل"

                  ?

                  "/products"

                  :

                  `/products?category=${encodeURIComponent(category)}`

                }


                className={`

                px-6

                py-3

                rounded-full

                font-bold

                transition-all

                duration-300


                ${

                  selectedCategory === category

                  ?

                  "bg-pink-600 text-white shadow-xl scale-105"

                  :

                  "bg-white hover:bg-pink-100 text-gray-700 shadow"

                }

                `}

              >

                {category} ({count})


              </Link>


            );


          })}


        </div>









        {
          filteredProducts.length === 0 ?


          (

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

          )


          :


          (


          <div className="
          grid
          md:grid-cols-2
          lg:grid-cols-4
          gap-8
          ">



            {
              filteredProducts.map((product)=>(



                <div

                  key={product.id}

                  className="
                  bg-white
                  rounded-3xl
                  shadow-lg
                  overflow-hidden
                  hover:shadow-pink-300
                  hover:-translate-y-2
                  duration-300
                  "

                >



                  <div className="
                  group
                  overflow-hidden
                  relative
                  ">


                    <ProductImageSlider

                      images={product.images}

                      fallback={product.image}

                      alt={product.name}

                    />


                  </div>







                  <div className="p-5">


                    <div className="
                    flex
                    justify-between
                    items-center
                    ">


                      <span className="
                      bg-pink-100
                      text-pink-600
                      px-3
                      py-1
                      rounded-full
                      text-xs
                      font-bold
                      ">

                        {product.category}

                      </span>



                      <span className="
                      bg-red-500
                      text-white
                      px-2
                      py-1
                      rounded-full
                      text-xs
                      ">

                        جديد

                      </span>


                    </div>





                    {
                      product.images &&

                      product.images.length > 1 &&

                      (

                      <div className="mt-3">


                        <span className="
                        bg-gray-100
                        text-gray-700
                        text-xs
                        px-3
                        py-1
                        rounded-full
                        ">


                          📷 {product.images.length} صور


                        </span>


                      </div>

                      )

                    }







                    <h3 className="
                    text-xl
                    font-bold
                    mt-4
                    line-clamp-2
                    ">

                      {product.name}

                    </h3>







                    <p className="
                    text-2xl
                    font-black
                    text-pink-600
                    mt-4
                    ">

                      {product.price} جنيه

                    </p>








                    <Link

                      href={`/product?id=${product.id}`}

                      className="
                      mt-6
                      flex
                      items-center
                      justify-center
                      gap-2
                      w-full
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

                      عرض المنتج

                      <span>→</span>


                    </Link>




                  </div>





                </div>



              ))

            }





          </div>


          )

        }



      </div>


    </main>


  );


}