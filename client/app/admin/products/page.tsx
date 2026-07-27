"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";



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



    const {data,error} = await supabase

    .from("products")

    .select("*")

    .order("id",{ascending:false});





    if(error){

      console.log(error);

    }



    if(data){

      setProducts(data as Product[]);

    }



    setLoading(false);



  }









  async function deleteProduct(id:number){



    const confirmDelete = confirm(
      "هل تريد حذف المنتج؟"
    );



    if(!confirmDelete) return;





    const {error} = await supabase

    .from("products")

    .delete()

    .eq("id",id);






    if(error){

      alert(
        "حدث خطأ أثناء الحذف"
      );

      console.log(error);

      return;

    }






    setProducts(prev=>

      prev.filter(product=>

        product.id !== id

      )

    );



    alert(
      "تم حذف المنتج ✅"
    );



  }








  if(loading){

    return (

      <div className="p-10 text-center">

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




      <div className="
      flex
      justify-between
      items-center
      mb-10
      ">



        <h1 className="
        text-4xl
        font-bold
        text-pink-600
        ">

          منتجات Sabaya Store 🛍️

        </h1>






        <Link

        href="/admin/products/add"

        className="
        bg-pink-600
        text-white
        px-6
        py-3
        rounded-xl
        font-bold
        "

        >

          + إضافة منتج

        </Link>





      </div>









      {
        products.length === 0 ?



        <div className="
        bg-white
        rounded-3xl
        shadow
        p-10
        text-center
        ">

          لا يوجد منتجات

        </div>



        :





        <div className="
        grid
        md:grid-cols-3
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
            "

            >



              <img

              src={product.image}

              className="
              w-full
              h-64
              object-cover
              "

              />







              <div className="p-5">



                <p className="text-gray-500">

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
                text-pink-600
                font-bold
                mt-3
                ">

                  {product.price} جنيه

                </p>






                <div className="
                flex
                gap-3
                mt-5
                ">




                  <Link

                  href={`/admin/products/edit?id=${product.id}`}

                  className="
                  bg-black
                  text-white
                  px-4
                  py-2
                  rounded-xl
                  "

                  >

                    تعديل

                  </Link>






                  <button

                  onClick={()=>deleteProduct(product.id)}

                  className="
                  bg-red-600
                  text-white
                  px-4
                  py-2
                  rounded-xl
                  "

                  >

                    حذف

                  </button>





                </div>





              </div>





            </div>



          ))
        }





        </div>



      }





    </main>


  );

}