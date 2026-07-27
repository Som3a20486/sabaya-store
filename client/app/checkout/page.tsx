"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import ShippingLabel from "@/components/ShippingLabel";



export default function CheckoutPage(){


  const router = useRouter();



  const labelRef = useRef<HTMLDivElement>(null);




  const [name,setName] = useState("");

  const [phone,setPhone] = useState("");

  const [address,setAddress] = useState("");

  const [governorate,setGovernorate] = useState("");

  const [notes,setNotes] = useState("");



  const [loading,setLoading] = useState(false);



  const [labelData,setLabelData] = useState<any>(null);







  async function createPDF(){


    if(!labelRef.current) return null;



    const canvas = await html2canvas(

      labelRef.current,

      {
        scale:2,
        useCORS:true
      }

    );



    const imgData = canvas.toDataURL(
      "image/png"
    );




    const pdf = new jsPDF(

      {
        orientation:"portrait",
        unit:"mm",
        format:[100,150]
      }

    );





    const width = 100;

    const height =
      (
        canvas.height *
        width
      )
      /
      canvas.width;





    pdf.addImage(

      imgData,

      "PNG",

      0,

      0,

      width,

      height

    );





    return pdf.output(
      "blob"
    );


  }

    async function submitOrder(){


    const cart = JSON.parse(

      localStorage.getItem("cart") || "[]"

    );




    if(cart.length === 0){

      alert("السلة فارغة");

      return;

    }






    if(
      !name ||
      !phone ||
      !address ||
      !governorate
    ){

      alert("من فضلك أكمل بيانات العميل");

      return;

    }






    setLoading(true);







    const total = cart.reduce(

      (
        sum:number,
        item:any
      ) =>

      sum + item.price * item.quantity,

      0

    );









    const {

      data:order,

      error:orderError

    } = await supabase

    .from("orders")

    .insert({

      customer_name:name,

      phone:phone,

      address:address,

      governorate:governorate,

      notes:notes,

      products:cart,

      total:total,

      status:"جديد"

    })

    .select()

    .single();







    if(orderError){


      console.log(orderError);


      alert(
        "حدث خطأ أثناء إنشاء الطلب"
      );


      setLoading(false);


      return;

    }









    // تجهيز بيانات البوليصة


    setLabelData({

      orderId:order.id,

      name:name,

      phone:phone,

      governorate:governorate,

      address:address,

      notes:notes,

      products:cart,

      total:total

    });







    // انتظار ظهور البوليصة في الصفحة


    setTimeout(async()=>{



      const pdfBlob = await createPDF();





      if(pdfBlob){



        const fileName =

        `order-${order.id}.pdf`;







        const {

          error:uploadError

        } = await supabase.storage

        .from("shipping-labels")

        .upload(

          fileName,

          pdfBlob,

          {

            contentType:"application/pdf",

            upsert:true

          }

        );








        if(uploadError){



          console.log(

            "PDF UPLOAD ERROR:",

            uploadError

          );


        }

        else{





          const {

            data:urlData

          } = supabase.storage

          .from("shipping-labels")

          .getPublicUrl(

            fileName

          );








          await supabase

          .from("orders")

          .update({

            shipping_pdf:

            urlData.publicUrl

          })

          .eq(

            "id",

            order.id

          );



        }



      }







      localStorage.removeItem("cart");



      window.dispatchEvent(

        new Event("cartUpdated")

      );







      alert(

        "تم تأكيد الطلب بنجاح ✅"

      );



      router.push("/");





    },800);



  }

    return (

    <main className="
    min-h-screen
    bg-gray-50
    p-6
    ">



      {

        labelData &&

        <div className="fixed -left-[9999px] top-0">

          <ShippingLabel

            ref={labelRef}

            orderId={labelData.orderId}

            name={labelData.name}

            phone={labelData.phone}

            governorate={labelData.governorate}

            address={labelData.address}

            notes={labelData.notes}

            products={labelData.products}

            total={labelData.total}

          />

        </div>

      }





      <div className="
      max-w-xl
      mx-auto
      bg-white
      rounded-3xl
      shadow-xl
      p-8
      ">




        <h1 className="
        text-3xl
        font-black
        text-pink-600
        text-center
        mb-8
        ">

          إتمام الطلب 🛍️

        </h1>







        <input

        placeholder="الاسم"

        value={name}

        onChange={(e)=>

          setName(e.target.value)

        }

        className="
        w-full
        border
        p-4
        rounded-xl
        mb-4
        "

        />








        <input

        placeholder="رقم الهاتف"

        value={phone}

        onChange={(e)=>

          setPhone(e.target.value)

        }

        className="
        w-full
        border
        p-4
        rounded-xl
        mb-4
        "

        />








        <input

        placeholder="المحافظة"

        value={governorate}

        onChange={(e)=>

          setGovernorate(e.target.value)

        }

        className="
        w-full
        border
        p-4
        rounded-xl
        mb-4
        "

        />








        <textarea

        placeholder="العنوان بالتفصيل"

        value={address}

        onChange={(e)=>

          setAddress(e.target.value)

        }

        className="
        w-full
        border
        p-4
        rounded-xl
        mb-4
        "

        />








        <textarea

        placeholder="ملاحظات"

        value={notes}

        onChange={(e)=>

          setNotes(e.target.value)

        }

        className="
        w-full
        border
        p-4
        rounded-xl
        mb-6
        "

        />









        <button

        onClick={submitOrder}

        disabled={loading}

        className="
        w-full
        bg-pink-600
        text-white
        py-4
        rounded-xl
        font-bold
        "

        >

        {

          loading

          ?

          "جاري تجهيز الطلب..."

          :

          "تأكيد الطلب"

        }


        </button>





      </div>


    </main>

  );


}