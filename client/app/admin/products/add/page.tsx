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

  const [images,setImages] = useState<string[]>([]);

  const [sizes,setSizes] = useState("");

  const [colors,setColors] = useState("");

  const [loading,setLoading] = useState(false);

  const [uploading,setUploading] = useState(false);







  async function uploadImages(
    e:React.ChangeEvent<HTMLInputElement>
  ){


    const files = e.target.files;


    if(!files || files.length === 0) return;




    try{


      setUploading(true);



      const uploadedImages:string[] = [];




      for(const file of Array.from(files)){


        const fileName =
        `${Date.now()}-${file.name}`;



        const {error} = await supabase.storage

          .from("product-images")

          .upload(
            fileName,
            file
          );




        if(error){

          console.log(error);

          alert("فشل رفع صورة");

          continue;

        }






        const {data} = supabase.storage

          .from("product-images")

          .getPublicUrl(fileName);




        uploadedImages.push(
          data.publicUrl
        );


      }







      setImages(prev=>[

        ...prev,

        ...uploadedImages

      ]);




      if(!image && uploadedImages.length > 0){

        setImage(
          uploadedImages[0]
        );

      }





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






    const {error} = await supabase

      .from("products")

      .insert([

        {


          name,

          price:Number(price),

          description,

          category,


          image,


          images,



          sizes:

          sizes

          ?

          sizes
          .split(",")
          .map(x=>x.trim())

          :

          [],





          colors:

          colors

          ?

          colors
          .split(",")
          .map(x=>x.trim())

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








        {/* المعاينة */}



        <motion.div

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







          <div className="
          max-w-sm
          mx-auto
          border
          rounded-3xl
          overflow-hidden
          shadow
          ">




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


              <p className="text-pink-600">

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





              {
                images.length > 0 &&

                <p className="
                text-gray-500
                mt-3
                ">

                  عدد الصور:
                  {" "}
                  {images.length}

                </p>

              }



            </div>






          </div>





        </motion.div>









        {/* الفورم */}



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

          className="border rounded-xl p-4 w-full"

          placeholder="اسم المنتج"

          value={name}

          onChange={(e)=>setName(e.target.value)}

          required

          />






          <input

          type="number"

          className="border rounded-xl p-4 w-full"

          placeholder="السعر"

          value={price}

          onChange={(e)=>setPrice(e.target.value)}

          required

          />







          <textarea

          className="border rounded-xl p-4 w-full"

          placeholder="وصف المنتج"

          value={description}

          onChange={(e)=>setDescription(e.target.value)}

          />







        <select
  className="border rounded-xl p-4 w-full"
  value={category}
  onChange={(e) => setCategory(e.target.value)}
>
  <option value="ملابس">👗 ملابس</option>
  <option value="أحذية">👠 أحذية</option>
  <option value="حقائب">👜 حقائب</option>
  <option value="إكسسوارات">💍 إكسسوارات</option>
  <option value="إلكترونيات">📱 إلكترونيات</option>
</select>







          <div className="
          border
          rounded-xl
          p-4
          ">


            <label className="font-bold block mb-3">

              صور المنتج

            </label>



            <input

            type="file"

            accept="image/*"

            multiple

            onChange={uploadImages}

            />




            {
              uploading &&

              <p className="text-pink-600 mt-3">

                جاري رفع الصور...

              </p>

            }



          </div>








          <input

          className="border rounded-xl p-4 w-full"

          placeholder="المقاسات: S,M,L"

          value={sizes}

          onChange={(e)=>setSizes(e.target.value)}

          />








          <input

          className="border rounded-xl p-4 w-full"

          placeholder="الألوان: أسود,أبيض"

          value={colors}

          onChange={(e)=>setColors(e.target.value)}

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