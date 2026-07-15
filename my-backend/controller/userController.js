const {connectDB}=require("../src/config/db");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");

async function getUsers(req,res){
    try{
        const db=await connectDB();
        const users=await db.collection("users")
            .find({})
            .project({ password: 0 })
            .sort({ createdAt: -1 })
            .toArray();

        res.status(200).json({ users });
    } catch(error){
        res.status(500).json({ error:error.message });
    }
}

async function registerUser(req,res){
    try{
        const db=await connectDB();
        const { name, email, password }=req.body;

        if(!name || !email || !password){
            return res.status(400).json({ message:"Name, email and password are required" });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const checkUser=await db.collection("users").findOne({ email: normalizedEmail });

        if(checkUser){
            return res.status(409).json({ message:"User already exists" });
        }

        const hashPassword=await bcrypt.hash(password,10);
        const newUser=await db.collection("users").insertOne({
            name: name.trim(),
            email: normalizedEmail,
            password:hashPassword,
            createdAt:new Date()
        });

        res.status(201).json({
            message:"Registration successful",
            user:{ id:newUser.insertedId, name: name.trim(), email: normalizedEmail }
        });
    } catch(error){
        if(error.code === 11000){
            return res.status(409).json({ message:"User already exists" });
        }
        res.status(500).json({ error:error.message });
    }
}

async function loginUser(req,res){
    try{
        const db=await connectDB();
        const { email, password }=req.body;
        const normalizedEmail = (email || "").toLowerCase().trim();

        const user=await db.collection("users").findOne({ email: normalizedEmail });

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

module.exports={ getUsers, registerUser, loginUser };
