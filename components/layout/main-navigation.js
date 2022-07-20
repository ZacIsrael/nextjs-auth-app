import Link from 'next/link';

import { useSession, signOut } from 'next-auth/react';

import classes from './main-navigation.module.css';

function MainNavigation() {
  // useSession returns an array containing two elements:
  // 1. session object which describes the active session 
  // 2. status, tells us whether or not the user has been authenticated 
  const { data: session, status} = useSession();

  console.log('session= ', session, '\n status= ', status)

  function logoutHandler(){
    // Next JS clears the cookie and the info from the sesion
    signOut();
  }
  return (
    <header className={classes.header}>
      <Link href='/'>
        <a>
          <div className={classes.logo}>Next Auth</div>
        </a>
      </Link>
      <nav>
        <ul>
          {/* Only show the login link if there is no session (no one is signed in) & the page is not loading */}
          {!session && status !== 'loading' &&
          (<li>
            <Link href='/auth'>Login</Link>
          </li>)
          }

          {/* if there is an active session (a user is logged in), display the profile link */}
          {session && <li>
            <Link href='/profile'>Profile</Link>
          </li>}
          {/* Only show the logout button if there is a session (a user is logged in)*/}
          { session &&
          (<li>
            <button onClick={logoutHandler}>Logout</button>
          </li>)
          }
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
