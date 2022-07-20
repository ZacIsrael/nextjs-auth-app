import Layout from '../components/layout/layout';
import '../styles/globals.css';

import { SessionProvider } from 'next-auth/react';

function MyApp({ Component, pageProps: {session, ...pageProps} }) {
  return (

    <SessionProvider session={session} refetchInterval={5 * 60}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
    
  );
}

export default MyApp;


// function MyApp({ Component, pageProps }) {
//   return (
//       <Layout>
//         <Component {...pageProps} />
//       </Layout>
    
//   );
// }

// export default MyApp;
