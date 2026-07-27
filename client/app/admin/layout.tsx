"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  const router = useRouter();

  const [admin,setAdmin] = useState<any>(null);

  const [checking,setChecking] = useState(true);





  useEffect(()=>{


    const data = localStorage.getItem("admin");



    if(!data){

      router.push("/login");

      return;

    }



    setAdmin(JSON.parse(data));

    setChecking(false);



  },[]);








  function logout(){


    localStorage.removeItem("admin");

    router.push("/login");


  }







  if(checking){

    return (

      <div className="min-h-screen flex items-center justify-center">

        جاري التحقق...

      </div>

    );

  }







  return (


    <div className="min-h-screen bg-gray-50">





      <nav
        className="
        bg-white/80
        backdrop-blur-xl
        shadow-md
        px-6
        py-4
        flex
        justify-between
        items-center
        sticky
        top-0
        z-50
        "
      >




        <h1 className="
        text-2xl
        font-black
        text-pink-600
        ">

          ✦ Sabaya Store ✦

        </h1>







        <div className="
        flex
        gap-5
        items-center
        "
        >



          <Link
            href="/admin"
            className="font-bold hover:text-pink-600"
          >

            Dashboard

          </Link>




          <Link
            href="/admin/products"
            className="font-bold hover:text-pink-600"
          >

            المنتجات

          </Link>





          <Link
            href="/admin/orders"
            className="font-bold hover:text-pink-600"
          >

            الطلبات

          </Link>






        </div>








        <div className="flex items-center gap-4">


          <span className="font-bold text-gray-700">

            👤 {admin?.name}

          </span>




          <button

            onClick={logout}

            className="
            bg-red-600
            text-white
            px-4
            py-2
            rounded-xl
            font-bold
            "

          >

            خروج

          </button>


        </div>





      </nav>






      <main>

        {children}

      </main>





    </div>


  );


}