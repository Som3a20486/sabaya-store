"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";



export default function AdminPage() {


  const router = useRouter();


  const [productsCount, setProductsCount] = useState(0);

  const [ordersCount, setOrdersCount] = useState(0);

  const [sales, setSales] = useState(0);

  const [loading, setLoading] = useState(true);





  useEffect(() => {


    

    getDashboard();



  }, []);







  async function getDashboard() {



    const { data: products } = await supabase

      .from("products")

      .select("id");





    const { data: orders } = await supabase

      .from("orders")

      .select("total");







    setProductsCount(

      products?.length || 0

    );





    setOrdersCount(

      orders?.length || 0

    );








    const total =

      orders?.reduce(

        (sum, item) =>

          sum + Number(item.total || 0),

        0

      ) || 0;





    setSales(total);



    setLoading(false);



  }








  function logout() {


    localStorage.removeItem("admin");


    router.push("/login");


  }









  if (loading) {


    return (

      <div className="p-10 text-center">

        جاري تحميل لوحة التحكم...

      </div>

    );


  }









  return (


    <main
      className="
      relative
      min-h-screen
      overflow-hidden
      bg-gradient-to-br
      from-pink-100
      via-white
      to-purple-200
      p-6
      "
    >





      {/* الخلفية المتحركة */}

      <div className="absolute inset-0 overflow-hidden">


        <div
          className="
          admin-bg-shape
          admin-bg-animation
          w-96
          h-96
          bg-pink-400
          top-[-120px]
          left-[-120px]
          "
        />



        <div
          className="
          admin-bg-shape
          admin-bg-animation-reverse
          w-[500px]
          h-[500px]
          bg-purple-400
          bottom-[-180px]
          right-[-150px]
          "
        />



        <div
          className="
          admin-bg-shape
          admin-bg-animation
          w-80
          h-80
          bg-blue-400
          top-1/2
          left-1/2
          "
        />



      </div>









      <div className="relative z-10">






        <div className="flex justify-between items-center mb-12">


          <h1
            className="
            text-5xl
            font-black
            text-pink-700
            "
          >

            ✦ Sabaya Store Admin ✦

          </h1>





          <button

            onClick={logout}

            className="
            bg-red-600
            text-white
            px-6
            py-3
            rounded-xl
            font-bold
            hover:scale-105
            transition
            "
          >

            تسجيل خروج 🚪

          </button>



        </div>









        <div className="grid md:grid-cols-3 gap-6">





          <div
            className="
            bg-white/60
            backdrop-blur-xl
            rounded-3xl
            shadow-xl
            p-8
            border
            border-white
            "
          >


            <p className="text-gray-600 text-lg">

              عدد المنتجات

            </p>


            <h2 className="text-5xl font-bold mt-4">

              {productsCount}

            </h2>


          </div>







          <div
            className="
            bg-white/60
            backdrop-blur-xl
            rounded-3xl
            shadow-xl
            p-8
            border
            border-white
            "
          >


            <p className="text-gray-600 text-lg">

              عدد الطلبات

            </p>


            <h2 className="text-5xl font-bold mt-4">

              {ordersCount}

            </h2>


          </div>







          <div
            className="
            bg-white/60
            backdrop-blur-xl
            rounded-3xl
            shadow-xl
            p-8
            border
            border-white
            "
          >


            <p className="text-gray-600 text-lg">

              إجمالي المبيعات

            </p>


            <h2
              className="
              text-4xl
              font-bold
              mt-4
              text-pink-600
              "
            >

              {sales} جنيه

            </h2>


          </div>






        </div>









        <div
          className="
          grid
          md:grid-cols-2
          gap-8
          mt-12
          "
        >



          <Link

            href="/admin/products"

            className="
            bg-black
            text-white
            p-10
            rounded-3xl
            text-center
            text-2xl
            font-bold
            shadow-xl
            hover:scale-105
            transition
            "

          >

            🛍️ إدارة المنتجات

          </Link>






          <Link

            href="/admin/orders"

            className="
            bg-pink-600
            text-white
            p-10
            rounded-3xl
            text-center
            text-2xl
            font-bold
            shadow-xl
            hover:scale-105
            transition
            "

          >

            📦 إدارة الطلبات

          </Link>





        </div>







      </div>







    </main>


  );

}