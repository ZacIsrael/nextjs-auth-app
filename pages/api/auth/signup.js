// {domain}/api/auth/signup, a post request will be sent 

import { hashPassword } from "../../../lib/auth";
import { connectToClient, insertEntry, userExists } from "../../../lib/db";

async function handler(req, res){
    
    if(req.method !== 'POST'){
        return;
    }
    // This code is obviously only for post requests 
    const data = req.body;
    const { email, password } = data;

    // server-side check
    if(!email || !email.includes('@') 
    || !password || password.trim().length < 7){
        // Invalid input
        res.status(422).json({
            message: 'Invalid input - password should also be atleast 7 characters long.'
        });
        return;
    }

    // connect to the client 
    const client = await connectToClient();

    // connect to the database 
    const db = client.db();


    // check if a user with this email already exists in the database
    const existingUser = await userExists(db, 'users', {email: email});
    // const existingUser2 = db.collection('users').findOne({email: email});

    if(existingUser){
        // user with this email is already in the database 
        res.status(422).json({message: 'User with this email already exists'})
        client.close();
        return;
    }

    // hashes the password
    const pw = await hashPassword(password);

    // object that will be stored in the 'users' database 
    const newUser = {
        email: email,
        password: pw 
        // should never store the password like this! Always encrypt them.
        // password: password
    }

    let result;

    try{
        // insert newUser into the 'users' collection
        result = await insertEntry(db, 'users', newUser);
        // alternative way
        // result = await db.collection('users').insertOne(newUser);

    } catch(error){
        client.close();
        res.status(500).json({
            message: 'Could not sign you up!'
        })
    }

    // close client 
    client.close();
    res.status(201).json({
        message: "Created new user!"
    })


    

}

export default handler;