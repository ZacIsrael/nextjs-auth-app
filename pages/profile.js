import UserProfile from '../components/profile/user-profile';
import { useSession, getSession } from 'next-auth/react';

function ProfilePage(props) {
  return <UserProfile />;
}

export async function getServerSideProps(context){

  // set a request key to the incoming request 
  // will be a valid session object if a user is authenticated 
  const session = await getSession({req: context.req})
  // const session = getSession(context)
  console.log('session= ', session)
  // no user logged in
  if(!session){
    return {
      // redirect the user to a different page 
      redirect: {
        destination: '/auth',
        permanent: false
      }
    };
  }

  return {
    props: {
      session: session
    }
  }


}
export default ProfilePage;
