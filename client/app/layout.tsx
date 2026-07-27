import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import { Cairo } from "next/font/google";
import ContactBubble from "@/components/ContactBubble";


const cairo = Cairo({

  subsets:["arabic"],

  weight:[
    "400",
    "500",
    "700",
    "800"
  ],

});





export const metadata: Metadata = {

  title:"Sabaya Store",

  description:"متجر صبايا للأزياء والإكسسوارات",

};







export default function RootLayout({

  children,

}:{

  children:React.ReactNode;

}){



  return (

    <html lang="ar" dir="rtl">


      <body className={cairo.className}>


       <Providers>

<ContactBubble />

<nav>
...
</nav>



          <Header />



          <main>

            {children}

          </main>





          <footer className="
          bg-pink-600
          text-white
          text-center
          py-8
          mt-10
          ">



            <h2 className="
            text-3xl
            font-bold
            ">

              ✦ Sabaya Store ✦

            </h2>





            <p className="mt-3">

              أناقة تبدأ من هنا 💗

            </p>





            <p className="mt-2 text-sm">

              جميع الحقوق محفوظة © 2026

            </p>





          </footer>





        </Providers>



      </body>



    </html>

  );


}