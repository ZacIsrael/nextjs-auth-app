// helper functions for connecting to MongoDB

import { MongoClient } from 'mongodb';

// mongodb+srv://db-user:<password>@cluster0.gdf3b.mongodb.net/?retryWrites=true&w=majority
export async function connectToClient(){

    const connectionString = `mongodb+srv://${process.env.mongodb_username}:${process.env.mongodb_password}@${process.env.mongodb_clustername}.gdf3b.mongodb.net/${process.env.mongodb_database}?retryWrites=true&w=majority`;
    let client;
    try{
        client = await MongoClient.connect(connectionString);
    } catch (error) {
        // an error occured when trying to connect to MongoDB
        res.status(500).json(
            {
                message: 'Could not connect to database'
            }
        )
    }
    return client;
}

export async function insertEntry(db, collection_name, insertedObj){

    const result = db.collection(collection_name).insertOne(insertedObj);
    return result;
}

export async function userExists(db, collection_name, searchObj)
{
    return db.collection(collection_name).findOne(searchObj);
}

export async function updateEntry(db, collection_name, toBeUpdatedEntry, updateParamObj)
{
    // update the "updateParamObj" field in the "toBeUpdatedEntry" entry in the "collection_name" collection 
    return db.collection(collection_name).updateOne(toBeUpdatedEntry, updateParamObj)
}