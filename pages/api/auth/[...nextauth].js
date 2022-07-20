// used for logging users in and logging them out 
// {domain}/api/auth/login & {domain}/api/auth/logout

import CredentialProvider from "next-auth/providers/credentials"

import NextAuth from 'next-auth';
import { connectToClient, userExists } from "../../../lib/db";
import { verifyPassword } from "../../../lib/auth";


// NextAuth() executes and returns a handler function 
export default NextAuth({
    // object used to configure NextAuth's behaviour 
    session: {
        strategy: "jwt"
    },
    providers: [
        CredentialProvider({
            name: "credentials",
            authorize: async (credentials) => {

                console.log('credentials= ', credentials)
            
                const client = await connectToClient();
                const db = client.db();
                const user = await userExists(db, 'users', {email: credentials.email});

                if(!user){
                    // no user with the entered email
                    client.close();
                    throw new Error('No user found!');
                }
                console.log('user= ', user)

                // found a user with that email address, check for password
                const isValid = await verifyPassword(credentials.password, user.password);

                if(!isValid){
                    client.close();
                    throw new Error('Invalid password! Try again!');
                }

                client.close();

                // authorization succeeded 

                // return object that is encoded for JWT token
                return { email: user.email};
            }

        },
        )
    ]

});
