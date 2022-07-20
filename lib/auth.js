// hold the authentication related utility functions

import { hash, compare } from 'bcryptjs';

// this function hashes a password so it is not stored in the database as plain text 
export async function hashPassword(password){
    // hashes the password
    const pw = await hash(password, 12);

    // return the hashed password 
    return pw;
}

export async function verifyPassword(password, hashedPasword){
    // compare returns a boolean that compares a plain text password and a hashedPassword from the database
    // if they are equal, true, else, false 
    const isValid = compare(password, hashedPasword);
    return isValid;
}