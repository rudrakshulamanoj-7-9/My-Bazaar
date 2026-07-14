import {
createContext,
useState
}
from "react";



export const CartContext =
createContext();




function CartProvider({children}){


const [cart,setCart]=useState([]);



function addToCart(product){


setCart([

...cart,

product

]);


}





function removeCart(id){


setCart(

cart.filter(
(item)=>item._id!==id
)

);


}





return(

<CartContext.Provider

value={{

cart,

addToCart,

removeCart

}}

>


{children}


</CartContext.Provider>


);


}



export default CartProvider;