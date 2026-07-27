"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";


type OrderProduct = {
  name: string;
  price: string;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
};


type Order = {
  id: number;
  customer_name: string;
  phone: string;
  address: string;
  governorate: string;
  notes: string;
  products: OrderProduct[];
  total: number;
  created_at: string;
  status: string | null;
};





export default function OrdersPage() {


  const [orders, setOrders] = useState<Order[]>([]);

  const [loading, setLoading] = useState(true);





  useEffect(() => {

    getOrders();

  }, []);







  async function getOrders() {


    const { data, error } = await supabase

      .from("orders")

      .select("*")

      .order("created_at", {
        ascending: false
      });




    if(error){

      console.log(error);

    }



    if(data){

      setOrders(data as Order[]);

    }



    setLoading(false);


  }









  async function changeStatus(
    id:number,
    status:string
  ){



    const { error } = await supabase

      .from("orders")

      .update({
        status: status
      })

      .eq("id", id);





    if(error){

      alert(
        "حدث خطأ أثناء تحديث الحالة"
      );

      console.log(error);

      return;

    }






    setOrders(prev =>

      prev.map(order =>

        order.id === id

        ?

        {
          ...order,
          status: status
        }

        :

        order

      )

    );


  }









  async function deleteOrder(id:number){



    const confirmDelete = confirm(
      "هل تريد حذف الطلب؟"
    );



    if(!confirmDelete) return;





    console.log(
      "Deleting order:",
      id
    );






    const { data, error } = await supabase

      .from("orders")

      .delete()

      .eq("id", id)

      .select();





    console.log(
      "Delete data:",
      data
    );


    console.log(
      "Delete error:",
      error
    );







    if(error){


      alert(
        "فشل الحذف: " + error.message
      );


      return;


    }






    setOrders(prev =>

      prev.filter(order =>

        order.id !== id

      )

    );




    alert(
      "تم حذف الطلب بنجاح ✅"
    );



  }









  function statusColor(
    status:string | null
  ){


    if(status === "تم التسليم")

      return "bg-green-100 text-green-700";



    if(status === "تم الشحن")

      return "bg-blue-100 text-blue-700";



    if(status === "جاري التجهيز")

      return "bg-yellow-100 text-yellow-700";



    return "bg-pink-100 text-pink-700";


  }









  if(loading){


    return (

      <div className="p-10 text-center">

        جاري تحميل الطلبات...

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
      font-bold
      text-pink-600
      mb-10
      ">

        طلبات Sabaya Store 📦

      </h1>







      {
        orders.length === 0 ?


        <div className="
        bg-white
        rounded-3xl
        shadow
        p-10
        text-center
        ">

          لا يوجد طلبات

        </div>


        :




        <div className="space-y-6">



          {
            orders.map(order => (



              <div

                key={order.id}

                className="
                bg-white
                rounded-3xl
                shadow
                p-6
                "

              >





                <div className="
                flex
                justify-between
                items-center
                mb-6
                ">



                  <h2 className="
                  text-2xl
                  font-bold
                  ">

                    طلب #{order.id}

                  </h2>





                  <select

                    value={
                      order.status || "جديد"
                    }

                    onChange={(e)=>

                      changeStatus(
                        order.id,
                        e.target.value
                      )

                    }

                    className={`
                    px-4
                    py-2
                    rounded-xl
                    font-bold
                    ${statusColor(order.status)}
                    `}

                  >


                    <option>
                      جديد
                    </option>


                    <option>
                      جاري التجهيز
                    </option>


                    <option>
                      تم الشحن
                    </option>


                    <option>
                      تم التسليم
                    </option>


                  </select>



                </div>








                <div className="
                grid
                md:grid-cols-2
                gap-4
                bg-gray-50
                rounded-2xl
                p-5
                ">



                  <p>
                    👤 العميل:
                    {" "}
                    {order.customer_name}
                  </p>



                  <p>
                    📞 الهاتف:
                    {" "}
                    {order.phone}
                  </p>




                  <p>
                    📍 المحافظة:
                    {" "}
                    {order.governorate}
                  </p>




                  <p>
                    🏠 العنوان:
                    {" "}
                    {order.address}
                  </p>



                </div>







                <h3 className="
                font-bold
                text-xl
                mt-6
                mb-3
                ">

                  المنتجات

                </h3>







                {
                  order.products?.map((item,index)=>(


                    <div

                      key={index}

                      className="
                      border
                      rounded-xl
                      p-4
                      mb-3
                      "

                    >



                      <p className="font-bold">

                        {item.name}

                      </p>



                      <p>

                        الكمية:
                        {" "}
                        {item.quantity}

                      </p>




                      <p>

                        السعر:
                        {" "}
                        {item.price}
                        {" "}
                        جنيه

                      </p>






                      {
                        item.selectedSize &&

                        <p>

                          المقاس:
                          {" "}
                          {item.selectedSize}

                        </p>

                      }







                      {
                        item.selectedColor &&

                        <p>

                          اللون:
                          {" "}
                          {item.selectedColor}

                        </p>

                      }



                    </div>



                  ))
                }







                <div className="
                flex
                justify-between
                items-center
                mt-6
                ">



                  <p className="
                  text-2xl
                  font-bold
                  text-pink-600
                  ">

                    الإجمالي:
                    {" "}
                    {order.total}
                    {" "}
                    جنيه

                  </p>






                  <button

                    onClick={()=>
                      deleteOrder(order.id)
                    }

                    className="
                    bg-red-600
                    text-white
                    px-6
                    py-3
                    rounded-xl
                    "

                  >

                    حذف الطلب

                  </button>





                </div>






              </div>



            ))
          }




        </div>



      }





    </main>


  );

}