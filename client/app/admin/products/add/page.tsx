"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";



export default function AddProductPage(){


  const router = useRouter();


  const [name,setName] = useState("");

  const [price,setPrice] = useState("");

  const [description,setDescription] = useState("");

  const [category,setCategory] = useState("ملابس");

  const [image,setImage] = useState("");

  const [sizes,setSizes] = useState("");

  const [colors,setColors] = useState("");

  const [loading,setLoading] = useState(false);

  const [uploading,setUploading] = useState(false);






  async function uploadImage(
    e:React.ChangeEvent<HTMLInputElement>
  ){


    const file = e.target.files?.[0];


    if(!file) return;




    try{


      setUploading(true);



      const fileName =
      `${Date.now()}-${file.name}`;





      const {error} =
      await supabase.storage

      .from("product-images")

      .upload(
        fileName,
        file
      );






      if(error){

        console.log(error);

        alert("فشل رفع الصورة");

        return;

      }







      const {data} =
      supabase.storage

      .from("product-images")

      .getPublicUrl(fileName);






      setImage(
        data.publicUrl
      );



    }

    finally{

      setUploading(false);

    }


  }








  async function addProduct(
    e:React.FormEvent
  ){


    e.preventDefault();



    setLoading(true);





    const {error}=await supabase

    .from("products")

    .insert([

      {


        name,

        price:Number(price),

        description,

        category,

        image,


        sizes:
        sizes
        ?
        sizes.split(",")
        :
        [],



        colors:
        colors
        ?
        colors.split(",")
        :
        []

      }


    ]);






    if(error){

      console.log(error);

      alert("حدث خطأ أثناء الحفظ");

      setLoading(false);

      return;

    }





    alert(
      "تم إضافة المنتج بنجاح ✅"
    );



    router.push(
      "/admin/products"
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
      font-black
      text-pink-600
      mb-10
      ">

        إضافة منتج جديد 🛍️

      </h1>





      <div className="
      grid
      lg:grid-cols-2
      gap-10
      ">





        {/* معاينة العميل */}


        <motion.div

        initial={{
          opacity:0,
          x:-50
        }}

        animate={{
          opacity:1,
          x:0
        }}

        className="
        bg-white
        rounded-3xl
        shadow-xl
        p-6
        "

        >



          <h2 className="
          text-2xl
          font-bold
          text-center
          mb-6
          ">

            معاينة المنتج 👁️

          </h2>







          <motion.div

          layout

          className="
          max-w-sm
          mx-auto
          border
          rounded-3xl
          overflow-hidden
          shadow
          "

          >





            {
              image ?

              <img

              src={image}

              className="
              w-full
              h-72
              object-cover
              "

              />

              :

              <div className="
              h-72
              bg-gray-100
              flex
              items-center
              justify-center
              text-gray-400
              ">

                صورة المنتج

              </div>

            }








            <div className="p-5">



              <p className="
              text-pink-600
              ">

                {category}

              </p>





              <h3 className="
              text-2xl
              font-bold
              mt-2
              ">

                {name || "اسم المنتج"}

              </h3>







              <p className="
              text-xl
              font-bold
              text-pink-600
              mt-3
              ">

                {price || 0} جنيه

              </p>








              <p className="
              text-gray-600
              mt-3
              ">

                {
                  description ||
                  "وصف المنتج يظهر هنا"
                }

              </p>







              {
                sizes &&

                <div className="mt-5">


                  <p className="font-bold">

                    المقاسات

                  </p>


                  <div className="
                  flex
                  gap-2
                  flex-wrap
                  mt-2
                  ">


                  {
                    sizes.split(",").map(
                      (size,index)=>(


                      <span

                      key={index}

                      className="
                      border
                      rounded-lg
                      px-3
                      py-1
                      "

                      >

                        {size}

                      </span>


                    ))

                  }


                  </div>


                </div>

              }








              {
                colors &&

                <div className="mt-5">


                  <p className="font-bold">

                    الألوان

                  </p>



                  <div className="
                  flex
                  gap-2
                  flex-wrap
                  mt-2
                  ">


                  {
                    colors.split(",").map(
                      (color,index)=>(


                      <span

                      key={index}

                      className="
                      bg-pink-100
                      rounded-full
                      px-3
                      py-1
                      "

                      >

                        {color}

                      </span>


                    ))

                  }


                  </div>



                </div>

              }








              <button

              className="
              w-full
              bg-pink-600
              text-white
              py-3
              rounded-xl
              mt-6
              "

              >

                🛒 أضف للسلة

              </button>





            </div>





          </motion.div>





        </motion.div>










        {/* فورم الإدخال */}



        <form

        onSubmit={addProduct}

        className="
        bg-white
        rounded-3xl
        shadow-xl
        p-8
        space-y-5
        "

        >





          <input

          className="
          border
          rounded-xl
          p-4
          w-full
          "

          placeholder="اسم المنتج"

          value={name}

          onChange={(e)=>
            setName(e.target.value)
          }

          required

          />







          <input

          type="number"

          className="
          border
          rounded-xl
          p-4
          w-full
          "

          placeholder="السعر"

          value={price}

          onChange={(e)=>
            setPrice(e.target.value)
          }

          required

          />







          <textarea

          className="
          border
          rounded-xl
          p-4
          w-full
          "

          placeholder="وصف المنتج"

          value={description}

          onChange={(e)=>
            setDescription(e.target.value)
          }

          />








          <select

          className="
          border
          rounded-xl
          p-4
          w-full
          "

          value={category}

          onChange={(e)=>
            setCategory(e.target.value)
          }

          >


            <option>
              ملابس
            </option>


            <option>
              أحذية
            </option>


            <option>
              شنط
            </option>


            <option>
              إكسسوارات
            </option>


          </select>








          <div className="
          border
          rounded-xl
          p-4
          ">


            <label className="
            font-bold
            block
            mb-3
            ">

              صورة المنتج

            </label>




            <input

            type="file"

            accept="image/*"

            onChange={uploadImage}

            />





            {
              uploading &&

              <p className="
              text-pink-600
              mt-3
              ">

                جاري رفع الصورة...

              </p>

            }



          </div>









          <input

          className="
          border
          rounded-xl
          p-4
          w-full
          "

          placeholder="المقاسات: S,M,L أو 38,39,40"

          value={sizes}

          onChange={(e)=>
            setSizes(e.target.value)
          }

          />








          <input

          className="
          border
          rounded-xl
          p-4
          w-full
          "

          placeholder="الألوان: أسود,بيج,أبيض"

          value={colors}

          onChange={(e)=>
            setColors(e.target.value)
          }

          />








          <button

          disabled={loading}

          className="
          bg-pink-600
          text-white
          w-full
          py-4
          rounded-xl
          font-bold
          "

          >


            {
              loading
              ?
              "جاري الحفظ..."
              :
              "حفظ المنتج"
            }


          </button>





        </form>






      </div>





    </main>


  );


}