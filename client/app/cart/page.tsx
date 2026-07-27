"use client";

import { useEffect, useState } from "react";
import Link from "next/link";


type CartItem = {

  id:number;

  name:string;

  price:number;

  image:string;

  quantity:number;

  selectedSize?:string;

  selectedColor?:string;

};





export default function CartPage(){


  const [cart,setCart] = useState<CartItem[]>([]);





  useEffect(()=>{

    loadCart();

  },[]);






  function loadCart(){


    const data = JSON.parse(

      localStorage.getItem("cart") || "[]"

    );


    setCart(data);


  }








  function updateCart(newCart:CartItem[]){


    localStorage.setItem(

      "cart",

      JSON.stringify(newCart)

    );



    setCart(newCart);




    window.dispatchEvent(

      new Event("cartUpdated")

    );


  }









  function increaseQuantity(id:number){


    const updated = cart.map(item=>


      item.id === id

      ?

      {

        ...item,

        quantity:item.quantity + 1

      }

      :

      item


    );



    updateCart(updated);


  }










  function decreaseQuantity(id:number){


    const updated = cart.map(item=>


      item.id === id && item.quantity > 1

      ?

      {

        ...item,

        quantity:item.quantity - 1

      }

      :

      item


    );



    updateCart(updated);


  }










  function removeItem(id:number){


    const updated = cart.filter(

      item=>item.id !== id

    );


    updateCart(updated);


  }










  const total = cart.reduce(

    (sum,item)=>

      sum + (item.price * item.quantity),

    0

  );







  return (

    <main className="
    min-h-screen
    bg-gray-50
    p-6
    ">



      <h1 className="
      text-4xl
      font-black
      text-pink-600
      mb-10
      ">

        🛒 سلة المشتريات

      </h1>






      {
        cart.length === 0 ?


        <div className="
        bg-white
        rounded-3xl
        shadow
        p-10
        text-center
        ">

          السلة فارغة

        </div>



        :



        <div className="space-y-6">






        {
          cart.map(item=>(


            <div

            key={item.id}

            className="
            bg-white
            rounded-3xl
            shadow
            p-6
            flex
            flex-col
            md:flex-row
            gap-6
            items-center
            ">



              <img

              src={item.image}

              alt={item.name}

              className="
              w-32
              h-32
              rounded-2xl
              object-cover
              "

              />






              <div className="flex-1">


                <h2 className="
                text-xl
                font-bold
                ">

                  {item.name}

                </h2>





                {
                  item.selectedSize &&

                  <p>

                    المقاس: {item.selectedSize}

                  </p>

                }





                {
                  item.selectedColor &&

                  <p>

                    اللون: {item.selectedColor}

                  </p>

                }





                <p className="
                text-pink-600
                font-bold
                mt-2
                ">

                  {item.price} جنيه

                </p>



              </div>









              <div className="
              flex
              items-center
              gap-4
              ">



                <button

                onClick={()=>decreaseQuantity(item.id)}

                className="
                bg-gray-200
                w-10
                h-10
                rounded-full
                "

                >

                  -

                </button>






                <span className="font-bold">

                  {item.quantity}

                </span>






                <button

                onClick={()=>increaseQuantity(item.id)}

                className="
                bg-pink-600
                text-white
                w-10
                h-10
                rounded-full
                "

                >

                  +

                </button>





              </div>








              <button

              onClick={()=>removeItem(item.id)}

              className="
              bg-red-600
              text-white
              px-5
              py-3
              rounded-xl
              "

              >

                حذف

              </button>






            </div>


          ))

        }








        <div className="
        bg-white
        rounded-3xl
        shadow
        p-8
        ">



          <h2 className="
          text-3xl
          font-black
          text-pink-600
          ">

            الإجمالي: {total} جنيه

          </h2>






          <Link

          href="/checkout"

          className="
          block
          text-center
          mt-6
          bg-black
          text-white
          py-4
          rounded-xl
          font-bold
          "

          >

            إتمام الطلب

          </Link>





        </div>







        </div>



      }





    </main>

  );


}