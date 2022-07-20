import ProfileForm from './profile-form';
import classes from './user-profile.module.css';
import { useSession, getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

function UserProfile() {
  // Redirect away if NOT auth (user is not logged in)
  /*
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    // getSession gets the latest session data 
    getSession()
    .then(session => {
      
      if(!session){
        // if there is no session (no user logged in), navigate to the following page
        window.location.href = '/auth';
      } else{
        setIsLoading(false);
      }
    })
  }, []);


  

  // const { data: session, status} = useSession();

  // console.log('Profile page \nsession= ', session, '\n status= ', status)
  if(isLoading){
    return <p className={classes.profile}>Loading</p>
  }
  */

  async function changePasswordHandler(passwordData){
    console.log('changePasswordHandler(): passwordData= ', passwordData)
    // send PATCH request so the password can be updated 
    const response = await fetch('/api/user/change-password', {
      method: 'PATCH',
      body: JSON.stringify(passwordData),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    console.log('data= ', data)


  }
  return (
    <section className={classes.profile}>
      <h1>Your User Profile</h1>
      <ProfileForm onChangePassword={changePasswordHandler}/>
    </section>
  );
}

export default UserProfile;
