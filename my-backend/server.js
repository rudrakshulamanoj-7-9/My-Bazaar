const express=require("express");

const cors=require("cors");

const userRoutes = require("./routes/userRoutes");
const authMiddleware = require("./middleware/authMiddleware");

const {
connectDB
}=require("./src/config/db");



const {

getProducts,

addProduct,

getProductById,

deleteProduct

}=require("./controller/productController");



const app=express();


const port=5000;



app.use(cors());


app.use(express.json());

app.use("/users",userRoutes);

// connect database

connectDB();




app.get("/",(req,res)=>{


    res.send(
        "MY-BAZAAR Backend Running"
    );


});





// GET PRODUCTS

app.get(
"/products",
getProducts
);



// ADD PRODUCT

app.post(
"/products",
authMiddleware,
addProduct
);



// SINGLE PRODUCT

app.get(
"/products/:id",
getProductById
);

app.delete(
"/products/:id",
deleteProduct
);




app.listen(port,()=>{


console.log(
`Server running on http://localhost:${port}`
);


});