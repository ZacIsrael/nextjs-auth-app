// {domain}/api/user/change-password

import { getSession } from "next-auth/react";
import { connectToClient, updateEntry, userExists } from "../../../lib/db";
import { hashPassword, verifyPassword } from "../../../lib/auth";

/*
POST is always for creating a resource ( does not matter if it was duplicated ) 
PUT is for checking if resource exists then update, else create new resource. 
PATCH is always for updating a resource.
*/

// function that changes the logged in user's password 
async function handler(req, res){

    if (req.method !== 'PATCH'){
        return;
    }

    const session = await getSession({req: req});

    // no user is logged in, this wouldn't even make sense lol. 
    // Only makes sense if the user was inactive and their session expired 
    if(!session){
        // 401 = authentication is missing
        res.status(401).json({message: 'Not authenticated!'});
        return;
    }
    // email is stored in the session data. See [...nextauth].js
    const userEmail = session.user.email;

    console.log('req.body= ', req.body)
    // extracted from input on front end page 
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    const client = await connectToClient();
    const db = client.db();
    const user = await userExists(db, 'users', {email: userEmail});
    console.log('user= ', user)

    // not ideal but we must check for the error anyway 
    if(!user){
        res.status(404).json({message: 'User not found.'})
        client.close();
        return;
    }

    const currentPassword = user.password;
    

    // check if the user's input for the old password is the same as their password stored in the database
    const passwordsAreEqual = await verifyPassword(oldPassword, currentPassword);
    console.log('passwordsAreEqual= ', passwordsAreEqual)
    if(!passwordsAreEqual){
        // user must reenter their old password because it does not match the one stored in the database 
        // 403: user does not have the permissions
        res.status(403).json({message: 'You are not authorized for this operation. Re-enter your old password again.'});
        client.close();
        return;
    }

    console.log('newPassword= ', newPassword)
    const finalPassword = await hashPassword(newPassword);
    console.log('finalPassword= ', finalPassword)
    
    let result;

    try{
        // update the user's password with the new password that they entered 
        // const result = await updateEntry(db, 'users', {email: userEmail}, { $set: {password: finalPassword}});
        result = await db.collection('users').updateOne({email: userEmail}, { $set: {password: finalPassword} });
        console.log('result= ', result)

    } catch(error){
        client.close();
        res.status(500).json({
            message: 'Could not update your password!'
        })
    }
    
    client.close();
    res.status(200).json({ message: 'Password updated!'});

}

export default handler;