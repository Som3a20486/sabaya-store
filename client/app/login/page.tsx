"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";



export default function LoginPage(){


  const router = useRouter();


  const [email,setEmail] = useState("");

  const [password,setPassword] = useState("");

  const [error,setError] = useState("");

  const [loading,setLoading] = useState(false);





  async function login(e:React.FormEvent){

    e.preventDefault();


    setLoading(true);

    setError("");




    const {data,error} = await supabase

    .from("admins")

    .select("*")

    .eq("email",email)

    .eq("password",password)

    .single();





    if(error || !data){

      setError("الإيميل أو كلمة المرور غير صحيحة");

      setLoading(false);

      return;

    }





    localStorage.setItem(

      "admin",

      JSON.stringify(data)

    );



    router.push("/admin");


  }







  return (


    <main className="
    min-h-screen
    flex
    items-center
    justify-center
    bg-gradient-to-br
    from-pink-100
    via-white
    to-purple-100
    p-6
    ">



      <form

      onSubmit={login}

      className="
      bg-white/80
      backdrop-blur-xl
      shadow-xl
      rounded-3xl
      p-8
      w-full
      max-w-md
      "
      
      >



        <h1 className="
        text-4xl
        font-black
        text-center
        text-pink-600
        mb-8
        ">

          Sabaya Store

        </h1>





        <input

        type="email"

        placeholder="الإيميل"

        value={email}

        onChange={(e)=>setEmail(e.target.value)}

        className="
        border
        w-full
        p-4
        rounded-xl
        mb-4
        "

        required

        />







        <input

        type="password"

        placeholder="كلمة المرور"

        value={password}

        onChange={(e)=>setPassword(e.target.value)}

        className="
        border
        w-full
        p-4
        rounded-xl
        mb-4
        "

        required

        />







        {
          error &&

          <p className="text-red-600 mb-4">

            {error}

          </p>

        }







        <button

        disabled={loading}

        className="
        bg-pink-600
        text-white
        w-full
        py-4
        rounded-xl
        font-bold
        hover:scale-105
        transition
        "

        >

          {
            loading
            ?
            "جاري الدخول..."
            :
            "دخول"
          }


        </button>





      </form>



    </main>


  );


}