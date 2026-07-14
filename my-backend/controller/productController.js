const {connectDB}=require("../src/config/db");



// GET ALL PRODUCTS

async function getProducts(req,res){


    try{


        const db = await connectDB();



        const products = await db
        .collection("products")
        .find({})
        .toArray();



        res.status(200).json({

            total:products.length,

            products:products

        });



    }catch(err){


        res.status(500).json({

            error:err.message

        });


    }

}




// ADD PRODUCT

async function addProduct(req,res){


    try{


        const db = await connectDB();


        const product=req.body;

        const listing = {
            ...product,
            createdAt: new Date(),
            sellerId: req.user?.id || null,
            sellerName: req.user?.name || "Anonymous"
        };

        const result = await db
        .collection("products")
        .insertOne(listing);



        res.status(201).json({

            message:"Product added successfully",

            id:result.insertedId

        });



    }catch(err){


        res.status(500).json({

            error:err.message

        });


    }

}




// GET SINGLE PRODUCT


async function getProductById(req,res){


    try{


        const db=await connectDB();



        const {ObjectId}=require("mongodb");



        const product=await db
        .collection("products")
        .findOne({

            _id:new ObjectId(req.params.id)

        });



        res.status(200).json(product);



    }catch(err){


        res.status(500).json({

            error:err.message

        });


    }

}

async function deleteProduct(req,res){

    try{


        const db=await connectDB();


        const {ObjectId}=require("mongodb");



        await db
        .collection("products")
        .deleteOne({

            _id:new ObjectId(req.params.id)

        });



        res.json({

            message:"Product deleted"

        });



    }catch(err){

        res.status(500).json({

            error:err.message

        });

    }


}



module.exports={

getProducts,

addProduct,

getProductById,

deleteProduct

};