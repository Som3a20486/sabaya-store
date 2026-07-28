"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";


export type CartItem = {

  id: number;

  name: string;

price: number;

  image: string;

  quantity: number;

  selectedSize?: string;

  selectedColor?: string;

};



type CartContextType = {

  cart: CartItem[];

  addToCart: (item: CartItem) => void;

  removeFromCart: (id:number) => void;

  updateQuantity: (id:number, quantity:number) => void;

  clearCart: () => void;

};



const CartContext =

createContext<CartContextType | null>(null);





export function CartProvider({

children,

}:{

children:ReactNode;

}){


const [cart,setCart] =

useState<CartItem[]>([]);





useEffect(()=>{


const saved =

localStorage.getItem("cart");


if(saved){

setCart(JSON.parse(saved));

}


},[]);






useEffect(()=>{


localStorage.setItem(

"cart",

JSON.stringify(cart)

);


},[cart]);









function addToCart(item:CartItem){


setCart(prev=>{


const exist =

prev.find(

p =>

p.id === item.id &&

p.selectedSize === item.selectedSize &&

p.selectedColor === item.selectedColor

);






if(exist){


return prev.map(p=>


p.id === item.id &&

p.selectedSize === item.selectedSize &&

p.selectedColor === item.selectedColor


?

{

...p,

quantity:p.quantity + 1

}


:

p


);


}





return [

...prev,

{

...item,

quantity:1

}

];


});


}









function removeFromCart(id:number){


setCart(prev=>

prev.filter(

item=>item.id !== id

)

);


}









function updateQuantity(

id:number,

quantity:number

){



if(quantity <= 0){

removeFromCart(id);

return;

}



setCart(prev=>

prev.map(item=>

item.id === id

?

{

...item,

quantity

}

:

item

)

);



}









function clearCart(){


setCart([]);


}








return (


<CartContext.Provider


value={{

cart,

addToCart,

removeFromCart,

updateQuantity,

clearCart

}}


>


{children}


</CartContext.Provider>


);


}








export function useCart(){


const context =

useContext(CartContext);



if(!context){


throw new Error(

"useCart must be used inside CartProvider"

);


}



return context;


}