import { useEffect, useState } from "react";


function ProductTable(){

    const [products,setProducts]=useState([]);



    useEffect(()=>{

        fetchProducts();

    },[]);




    async function fetchProducts(){


        const response = await fetch(
            "/products"
        );


        const data = await response.json();


        setProducts(data.products);


    }
async function deleteProduct(id){


await fetch(
`/products/${id}`,
{

method:"DELETE"

}

);


alert(
"Deleted"
);


fetchProducts();


}



    return(

        <div>

            <h2>
                Product List
            </h2>


            <table border="1" cellPadding="10">

                <thead>

                    <tr>

                        <th>Name</th>

                        <th>Category</th>

                        <th>Price</th>

                        <th>Stock</th>

                    </tr>

                </thead>



                <tbody>


                {

                products.map((product)=>(


                <tr key={product._id}>


                    <td>
                        {product.name}
                    </td>


                    <td>
                        {product.category}
                    </td>


                    <td>
                        ₹{product.price}
                    </td>


                    <td>
                        {product.stock}
                    </td>


                </tr>


                ))


                }
                <td>

<button
onClick={()=>deleteProduct(product._id)}
>

Delete

</button>

</td>

                </tbody>


            </table>


        </div>


    );


}


export default ProductTable;