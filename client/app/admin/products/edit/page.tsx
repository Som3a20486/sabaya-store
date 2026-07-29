  "use client";

  import { useEffect, useState } from "react";
  import { useRouter, useSearchParams } from "next/navigation";
  import { supabase } from "@/lib/supabase";
  import { motion } from "framer-motion";



  export default function EditProductPage(){


    const router = useRouter();

    const searchParams = useSearchParams();

    const id = searchParams.get("id");




    const [name,setName] = useState("");

    const [price,setPrice] = useState("");

    const [description,setDescription] = useState("");

    const [category, setCategory] = useState("ملابس");

    const [image,setImage] = useState("");

    const [sizes,setSizes] = useState("");

    const [colors,setColors] = useState("");



    const [loading,setLoading] = useState(false);

    const [fetching,setFetching] = useState(true);








    useEffect(()=>{


      if(id){

        getProduct();

      }


    },[id]);









    async function getProduct(){



      const {data,error} = await supabase

        .from("products")

        .select("*")

        .eq("id",id)

        .single();





      if(error){

        console.log(error);

        alert("حدث خطأ أثناء تحميل المنتج");

        return;

      }






      setName(data.name || "");

      setPrice(String(data.price || ""));

      setDescription(data.description || "");

      setCategory(data.category || "ملابس");

      setImage(data.image || "");



      setSizes(

        Array.isArray(data.sizes)

        ? data.sizes.join(",")

        : ""

      );




      setColors(

        Array.isArray(data.colors)

        ? data.colors.join(",")

        : ""

      );





      setFetching(false);


    }












    async function updateProduct(

      e:React.FormEvent

    ){



      e.preventDefault();



      if(!id) return;



      setLoading(true);






      const {error} = await supabase

        .from("products")

        .update({

          name,

          price:Number(price),

          description,

          category,

          image,


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

        })

        .eq("id",id);







      if(error){

        console.log(error);

        alert("حدث خطأ أثناء التعديل");

        setLoading(false);

        return;

      }







      alert("تم تعديل المنتج بنجاح ✅");



      router.push("/admin/products");




    }









    if(fetching){


      return (

        <div className="p-10 text-center">

          جاري تحميل المنتج...

        </div>

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

          تعديل المنتج ✏️

        </h1>





        <div className="
        grid
        lg:grid-cols-2
        gap-10
        ">






          {/* معاينة المنتج */}



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


                          )

                        )
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


                          )

                        )
                      }


                    </div>


                  </div>

                }






              </div>





            </motion.div>






          </motion.div>









          {/* فورم التعديل */}



          <form

          onSubmit={updateProduct}

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




            <input

            className="
            border
            rounded-xl
            p-4
            w-full
            "

            placeholder="رابط الصورة"

            value={image}

            onChange={(e)=>
              setImage(e.target.value)
            }

            />








            <input

            className="
            border
            rounded-xl
            p-4
            w-full
            "

            placeholder="المقاسات: S,M,L"

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

            placeholder="الألوان: أسود,أبيض,بيج"

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

                "حفظ التعديلات"

              }


            </button>







          </form>







        </div>






      </main>

    );


  }