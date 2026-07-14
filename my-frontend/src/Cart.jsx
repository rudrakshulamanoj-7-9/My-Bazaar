import {
useContext
}
from "react";


import {
CartContext
}
from "./context/CartContext";



function Cart(){


const {

cart,

removeCart

}=useContext(CartContext);



return(

<div>


<h1>
My Cart
</h1>



{

cart.length===0?

<h3>
Cart Empty
</h3>


:


cart.map((item)=>(


<div key={item._id}>


<h3>
{item.name}
</h3>


<p>
₹{item.price}
</p>



<button

onClick={
()=>removeCart(item._id)
}

>

Remove

</button>


</div>


))


}



</div>

);


}


export default Cart;