const { MongoClient } = require("mongodb");

let db;
let client;

async function connectDB() {
    if (db) {
        return db;
    }

    const uri = process.env.MONGO_URI || "mongodb://localhost:27017/";
    const dbName = process.env.MONGO_DB_NAME || "mybazaar";

    client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 5000
    });

    await client.connect();

    db = client.db(dbName);

    await db.collection("users").createIndex(
        { email: 1 },
        {
            unique: true,
            partialFilterExpression: {
                email: { $type: "string", $exists: true }
            }
        }
    );

    console.log("MongoDB connected:", dbName);

    return db;
}

module.exports = {
    connectDB
};