"use client";

import React, { forwardRef } from "react";


type Product = {

  name:string;

  price:number;

  quantity:number;

};



type ShippingLabelProps = {

  orderId:number;

  name:string;

  phone:string;

  governorate:string;

  address:string;

  notes:string;

  products:Product[];

  total:number;

};





const ShippingLabel = forwardRef<

HTMLDivElement,

ShippingLabelProps

>(

(
{
  orderId,
  name,
  phone,
  governorate,
  address,
  notes,
  products,
  total
},

ref

)=>{



return (


<div

ref={ref}

dir="rtl"

style={{

  width:"380px",

  minHeight:"560px",

  background:"#ffffff",

  color:"#111111",

  padding:"20px",

  fontFamily:"Arial, sans-serif",

  border:"1px solid #dddddd",

  boxSizing:"border-box"

}}


>





{/* Header */}

<div

style={{

textAlign:"center",

borderBottom:"2px solid #db2777",

paddingBottom:"15px",

marginBottom:"15px"

}}

>


<h1

style={{

color:"#db2777",

fontSize:"26px",

fontWeight:"900",

margin:"0"

}}

>

✦ Sabaya Store ✦

</h1>



<p

style={{

fontSize:"16px",

fontWeight:"bold",

marginTop:"10px"

}}

>

بوليصة شحن

</p>



<p

style={{

fontSize:"14px"

}}

>

رقم الطلب #{orderId}

</p>



</div>








{/* Customer Info */}


<div

style={{

fontSize:"14px",

lineHeight:"2",

textAlign:"right"

}}

>


<p>

<strong>العميل:</strong> {name}

</p>


<p>

<strong>الهاتف:</strong> {phone}

</p>


<p>

<strong>المحافظة:</strong> {governorate}

</p>


<p>

<strong>العنوان:</strong> {address}

</p>



{

notes &&

<p>

<strong>ملاحظات:</strong> {notes}

</p>

}



</div>









{/* Products */}


<h3

style={{

marginTop:"20px",

marginBottom:"10px",

fontSize:"18px"

}}

>

المنتجات

</h3>





<div

style={{

border:"1px solid #ddd",

borderRadius:"10px",

overflow:"hidden"

}}

>


<div

style={{

display:"grid",

gridTemplateColumns:"2fr 1fr 1fr",

background:"#fce7f3",

padding:"8px",

fontWeight:"bold",

fontSize:"13px"

}}

>

<div>

المنتج

</div>


<div>

الكمية

</div>


<div>

السعر

</div>


</div>






{

products.map((item,index)=>(


<div

key={index}

style={{

display:"grid",

gridTemplateColumns:"2fr 1fr 1fr",

padding:"8px",

borderTop:"1px solid #eee",

fontSize:"13px"

}}

>


<div>

{item.name}

</div>


<div>

{item.quantity}

</div>


<div>

{item.price} ج

</div>



</div>


))

}





</div>









{/* Total */}


<div

style={{

marginTop:"20px",

background:"#db2777",

color:"#ffffff",

padding:"12px",

borderRadius:"12px",

textAlign:"center",

fontSize:"18px",

fontWeight:"bold"

}}

>

الإجمالي: {total} جنيه

</div>







<div

style={{

textAlign:"center",

marginTop:"25px",

fontSize:"14px",

fontWeight:"bold"

}}

>


شكراً لثقتكم 💗

<br/>

Sabaya Store


</div>





</div>


);


}

);



ShippingLabel.displayName="ShippingLabel";


export default ShippingLabel;