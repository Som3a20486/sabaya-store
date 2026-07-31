"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { CartItem } from "@/context/CartContext";


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





function ProductContent(){


  const searchParams = useSearchParams();

  const id = searchParams.get("id");



  const { addToCart } = useCart();




  const [product,setProduct] = useState<Product | null>(null);

  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  const [loading,setLoading] = useState(true);



  const [selectedSize,setSelectedSize] = useState("");

  const [selectedColor,setSelectedColor] = useState("");



  const [activeImage,setActiveImage] = useState("");



  const [added,setAdded] = useState(false);






  useEffect(()=>{


    if(id){

      getProduct();

    }

    else{

      setLoading(false);
      

    }


  },[id]);







  async function getProduct(){


    const {data,error}=await supabase

    .from("products")

    .select("*")

    .eq("id",id)

    .single();




    if(error){

      console.log(error);
      
      setLoading(false);

      return;

    }






    setProduct(data);



    setActiveImage(

      data.images && data.images.length > 0

      ?

      data.images[0]

      :

      data.image

    );




    setLoading(false);


  }







  function handleAddToCart(){


    if(!product) return;





    if(
      product.sizes &&
      product.sizes.length > 0 &&
      !selectedSize
    ){

      toast.error(
        "⚠️ اختر المقاس أولاً"
      );

      return;

    }






    if(
      product.colors &&
      product.colors.length > 0 &&
      !selectedColor
    ){

      toast.error(
        "⚠️ اختر اللون أولاً"
      );

      return;

    }







 addToCart({
  id: product.id,
  name: product.name,
  price: product.price,
  image: activeImage,
  quantity: 1,
  selectedSize,
  selectedColor,
});




    setAdded(true);




    toast.success(

      `تم إضافة ${product.name} إلى السلة 🛒`,

      {
        duration:3000
      }

    );






    setTimeout(()=>{

      setAdded(false);

    },1500);



  }






  if(loading){


    return (

      <div className="
      min-h-screen
      flex
      items-center
      justify-center
      ">

        جاري تحميل المنتج...

      </div>

    );

  }






  if(!product){


    return (

      <div className="
      p-10
      text-center
      ">

        المنتج غير موجود

      </div>

    );


  }







  const productImages =

  product.images && product.images.length > 0

  ?

  product.images

  :

  [product.image];
  return (


    <main className="
    min-h-screen
    bg-gray-50
    p-6
    ">



      <div className="
      max-w-5xl
      mx-auto
      bg-white
      rounded-3xl
      shadow-xl
      p-8
      grid
      md:grid-cols-2
      gap-10
      ">





        <div>



          <img

          src={activeImage}

          alt={product.name}

          className="
          w-full
          h-125
          object-cover
          rounded-3xl
          "

          />






          <div className="
          flex
          gap-3
          mt-5
          overflow-x-auto
          ">


          {
            productImages.map((img,index)=>(


              <button

              key={index}

              onClick={()=>setActiveImage(img)}

              className={`

              border-2
              rounded-xl
              overflow-hidden


              ${
                activeImage === img

                ?

                "border-pink-600"

                :

                "border-transparent"

              }

              `}

              >


                <img

                src={img}

                alt={product.name}

                className="
                w-20
                h-20
                object-cover
                "

                />


              </button>


            ))

          }


          </div>



        </div>









        <div>



          <p className="
          text-pink-600
          font-bold
          ">

            {product.category}

          </p>





          <h1 className="
          text-4xl
          font-black
          mt-3
          ">

            {product.name}

          </h1>







          <p className="
          text-3xl
          text-pink-600
          font-bold
          mt-6
          ">

            {product.price} جنيه

          </p>






          <p className="
          text-gray-600
          mt-6
          leading-8
          ">

            {product.description}

          </p>









          {
            product.sizes &&
            product.sizes.length > 0 &&


            <div className="mt-8">


              <h3 className="
              font-bold
              mb-3
              ">

                المقاسات

              </h3>




              <div className="
              flex
              gap-3
              flex-wrap
              ">


              {
                product.sizes.map(size=>(


                  <button

                  key={size}

                  onClick={()=>setSelectedSize(
                    selectedSize === size ? "" : size
                  )}

                  className={`

                  border
                  px-5
                  py-2
                  rounded-xl


                  ${
                    selectedSize === size

                    ?

                    "bg-pink-600 text-white"

                    :

                    ""

                  }

                  `}

                  >

                    {size}

                  </button>


                ))

              }


              </div>


            </div>

          }









          {
            product.colors &&
            product.colors.length > 0 &&


            <div className="mt-8">


              <h3 className="
              font-bold
              mb-3
              ">

                الألوان

              </h3>





              <div className="
              flex
              gap-3
              flex-wrap
              ">



              {
                product.colors.map(color=>(


                  <button

                  key={color}

                  onClick={()=>setSelectedColor(
                    selectedColor === color ? "" : color
                  )}

                  className={`


                  px-4
                  py-2
                  rounded-full



                  ${
                    selectedColor === color

                    ?

                    "bg-pink-600 text-white"

                    :

                    "bg-pink-100"

                  }


                  `}

                  >

                    {color}

                  </button>


                ))

              }



              </div>


            </div>

          }











          <motion.button


          whileTap={{
            scale:0.9
          }}



          animate={{
            scale:added ? 1.08 : 1
          }}




          onClick={handleAddToCart}




          className={`

          w-full

          py-4

          rounded-xl

          mt-10

          font-bold

          text-white


          transition



          ${
            added

            ?

            "bg-green-600"

            :

            "bg-pink-600"

          }



          `}


          >



          {

            added

            ?

            "✅ تمت الإضافة للسلة"

            :

            "🛒 أضف إلى السلة"

          }



          </motion.button>





        </div>





      </div>



    </main>


  );


}








export default function ProductPage(){


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


      <ProductContent />


    </Suspense>


  );


}