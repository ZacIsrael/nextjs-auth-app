import { useState, useRef } from 'react';
import classes from './auth-form.module.css';

// import { signIn } from 'next-auth/client'

import { signIn } from 'next-auth/react';
import { useRouter} from 'next/router';

async function createUser(email, password){

  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({email, password}),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();

  if(!response.ok){
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

function AuthForm() {

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  // if we are not logged in, send a request to backend 

  async function submitHandler(event){
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    // can add client side validation here for better user experience 

    if(isLogin){
      console.log('Login button clicked!')
      // log the user in
      const result = await signIn('credentials', {
        // do not redirect user to a new page if the login fails, keep them on the login page
        redirect: false,
        email: enteredEmail,
        password: enteredPassword
      });

      if(!result.error){
        // takes the user to a different page after they have successfully logged in
        router.replace('/profile');
      }
      console.log('Logging in: result= ', result)



    } else {
      console.log('Create new account button clicked!\n')
      // sign them up
      let newUser;
      try{
        newUser = await createUser(enteredEmail, enteredPassword);
        console.log('newUser= ', newUser, ' has been stored in the database')
      } catch (error){
        console.log('errror= ', error, ' occured when trying to sign this person up.')
      }
      
    }

  }


  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailInputRef}/>
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' required ref={passwordInputRef}/>
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? 'Login' : 'Create Account'}</button>
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AuthForm;
