const {connectDB}=require("../src/config/db");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");

async function registerUser(req,res){
    try{
        const db=await connectDB();
        const { name, email, password }=req.body;

        const checkUser=await db.collection("users").findOne({ email });

        if(checkUser){
            return res.json({ message:"User already exists" });
        }

        const hashPassword=await bcrypt.hash(password,10);
        const newUser=await db.collection("users").insertOne({
            name,
            email,
            password:hashPassword,
            createdAt:new Date()
        });

        res.json({
            message:"Registration successful",
            user:{ id:newUser.insertedId, name, email }
        });
    } catch(error){
        res.status(500).json({ error:error.message });
    }
}

async function loginUser(req,res){
    try{
        const db=await connectDB();
        const { email, password }=req.body;

        const user=await db.collection("users").findOne({ email });

        if(!user){
            return res.status(404).json({ message:"User not found" });
        }

        const match=await bcrypt.compare(password, user.password);

        if(!match){
            return res.status(401).json({ message:"Wrong password" });
        }

        const token=jwt.sign(
            { id:user._id, name:user.name, email:user.email },
            process.env.JWT_SECRET || "mybazaarsecret",
            { expiresIn:"1d" }
        );

        res.json({
            message:"Login successful",
            token,
            user:{ id:user._id, name:user.name, email:user.email }
        });
    } catch(error){
        res.status(500).json({ error:error.message });
    }
}

module.exports={ registerUser, loginUser };
