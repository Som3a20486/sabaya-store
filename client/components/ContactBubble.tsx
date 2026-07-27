"use client";

import { useState } from "react";


export default function ContactBubble(){


  const [open,setOpen] = useState(false);



  return (

    <div
      style={{
        position:"fixed",
        bottom:"30px",
        right:"30px",
        zIndex:9999,
      }}
    >




      {
        open &&

        <div

        style={{
          background:"#ffffff",
          borderRadius:"20px",
          boxShadow:"0 15px 40px rgba(0,0,0,.25)",
          padding:"15px",
          marginBottom:"18px",
          width:"220px",
          animation:"fadeIn .3s ease"
        }}

        >



          <a
href="tel:01066520534"
style={{
  display:"flex",
  alignItems:"center",
  gap:"10px",
  padding:"12px",
  color:"#db2777",
  fontWeight:"800",
  fontSize:"18px"
}}
>
📞 اتصل بنا
</a>


<a
href="https://wa.me/201066520534"
target="_blank"
style={{
  display:"flex",
  alignItems:"center",
  gap:"10px",
  padding:"12px",
  color:"#16a34a",
  fontWeight:"800",
  fontSize:"18px"
}}
>
💬 واتساب
</a>




        </div>

      }







      <button

      onClick={()=>setOpen(!open)}

      style={{

        width:"90px",

        height:"90px",

        borderRadius:"50%",

        border:"none",

        background:"#db2777",

        color:"#fff",

        fontSize:"42px",

        cursor:"pointer",

        boxShadow:
        "0 10px 35px rgba(219,39,119,.5)",

        display:"flex",

        alignItems:"center",

        justifyContent:"center",

        animation:"pulse 2s infinite"

      }}

      >

      💬

      </button>






      <style>

      {`

      @keyframes pulse {

        0% {

          transform:scale(1);

        }

        50% {

          transform:scale(1.12);

        }

        100% {

          transform:scale(1);

        }

      }



      @keyframes fadeIn {

        from {

          opacity:0;

          transform:translateY(15px);

        }

        to {

          opacity:1;

          transform:translateY(0);

        }

      }

      `}

      </style>



    </div>

  );

}