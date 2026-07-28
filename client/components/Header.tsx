"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";


export default function Header(){


  const { cart } = useCart();


  const [cartCount,setCartCount] = useState(0);





  useEffect(()=>{


    const total = cart.reduce(

      (sum,item)=>

      sum + item.quantity,

      0

    );


    setCartCount(total);



  },[cart]);








  return (


    <nav className="
    bg-white
    shadow-md
    px-8
    py-5
    flex
    justify-between
    items-center
    ">



      <Link

      href="/"

      className="
      text-3xl
      font-extrabold
      tracking-wide
      text-pink-600
      "

      >

        ✦ Sabaya Store ✦

      </Link>








      <div className="
      flex
      gap-6
      text-gray-700
      font-bold
      ">



        <Link href="/">

          الرئيسية

        </Link>





        <Link href="/products">

          المنتجات

        </Link>








        <Link

        href="/cart"

        className="relative"

        >


          🛒 السلة






          {
            cartCount > 0 &&


            <span className="
            absolute
            -top-4
            -right-5
            bg-pink-600
            text-white
            rounded-full
            w-6
            h-6
            flex
            items-center
            justify-center
            text-sm
            ">


              {cartCount}



            </span>


          }






        </Link>





      </div>





    </nav>


  );


}