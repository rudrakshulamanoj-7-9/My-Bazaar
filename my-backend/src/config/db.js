const { MongoClient } = require("mongodb");

let db;

let client;


async function connectDB(){

    if(db){
        return db;
    }


    const uri="mongodb://localhost:27017/";

    const dbName="mybazaar";


    client=new MongoClient(uri);


    await client.connect();


    db=client.db(dbName);


    console.log(
        "MongoDB connected:",
        dbName
    );


    return db;

}



module.exports={
    connectDB
};