const {connectDB}=require("../src/config/db");

// GET ALL PRODUCTS

async function getProducts(req,res){

    try{

        const db = await connectDB();

        const products = await db
        .collection("products")
        .find({})
        .toArray();

        if(products.length < 12){
            const sampleProducts = [
                {
                    name:"iPhone 14",
                    description:"Excellent condition smartphone with 128GB storage.",
                    price:59999,
                    category:"Electronics",
                    image:"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
                    type:"sell",
                    sellerName:"Aarav",
                    createdAt:new Date()
                },
                {
                    name:"Nike Air Shoes",
                    description:"Comfortable running shoes in size 9.",
                    price:4999,
                    category:"Fashion",
                    image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
                    type:"sell",
                    sellerName:"Sneha",
                    createdAt:new Date()
                },
                {
                    name:"Dell Laptop",
                    description:"Lightweight laptop ideal for study and work.",
                    price:38999,
                    category:"Electronics",
                    image:"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80",
                    type:"sell",
                    sellerName:"Rohan",
                    createdAt:new Date()
                },
                {
                    name:"Cars stickers",
                    description:"Premium quality stickers with visor.",
                    price:2999,
                    category:"Vehicles",
                    image:"https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
                    type:"sell",
                    sellerName:"Kiran",
                    createdAt:new Date()
                },
                {
                    name:"Used Sofa",
                    description:"Comfortable sofa in good condition.",
                    price:8999,
                    category:"Furniture",
                    image:"https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
                    type:"buy",
                    sellerName:"Dev",
                    createdAt:new Date()
                },
                {
                    name:"Need a Study Table",
                    description:"Looking for a sturdy table for online classes.",
                    price:0,
                    category:"Furniture",
                    image:"https://images.unsplash.com/photo-1519947486511-46149fa0a254?auto=format&fit=crop&w=800&q=80",
                    type:"buy",
                    sellerName:"Lina",
                    createdAt:new Date()
                },
                {
                    name:"Looking for a Bicycle",
                    description:"Need a good second-hand bicycle for daily commute.",
                    price:0,
                    category:"Sports",
                    image:"https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=800&q=80",
                    type:"buy",
                    sellerName:"Suresh",
                    createdAt:new Date()
                },
                {
                    name:"Need an Office Chair",
                    description:"Want a comfortable chair for work-from-home setup.",
                    price:0,
                    category:"Home",
                    image:"https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
                    type:"buy",
                    sellerName:"Mina",
                    createdAt:new Date()
                }
            ];

            const existingNames = new Set(products.map((item) => item.name));
            const missingProducts = sampleProducts.filter((item) => !existingNames.has(item.name));

            if(missingProducts.length > 0){
                await db.collection("products").insertMany(missingProducts);
                products.push(...missingProducts);
            }

            return res.status(200).json({
                total:products.length,
                products:products
            });
        }

        res.status(200).json({
            total:products.length,
            products:products
        });

    }catch(err){
        res.status(500).json({ error:err.message });
    }
}

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
        res.status(500).json({ error:err.message });
    }
}

async function getProductById(req,res){
    try{
        const db=await connectDB();
        const {ObjectId}=require("mongodb");
        const product=await db.collection("products").findOne({ _id:new ObjectId(req.params.id) });
        res.status(200).json(product);
    }catch(err){
        res.status(500).json({ error:err.message });
    }
}

async function deleteProduct(req,res){
    try{
        const db=await connectDB();
        const {ObjectId}=require("mongodb");
        await db.collection("products").deleteOne({ _id:new ObjectId(req.params.id) });
        res.json({ message:"Product deleted" });
    }catch(err){
        res.status(500).json({ error:err.message });
    }
}

module.exports={ getProducts, addProduct, getProductById, deleteProduct };
