import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';
import AuthForm from '../components/auth/auth-form';
import { Router, useRouter } from 'next/router';

function AuthPage() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getSession()
    .then(session => {
      // if a user is logged in, do not allow them to access the auth page,
      // redirect them if they try 
      if(session){
        router.replace('/');
      } else{
        setIsLoading(false);
      }
    })
  }, [router]);

  if(isLoading){
    return <p>Loading...</p>
  }

  return <AuthForm />;
}

export default AuthPage;
