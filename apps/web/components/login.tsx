import {useSession, signIn, signOut} from 'next-auth/react';

function LoginComp(){

    const {data: session}:any = useSession();
  
    if (session) {
      return (
        <>
          Signed in as {JSON.stringify(session.user.name)} <br />
          <button onClick={() => signOut()}>Sign out</button>
        </>
      );
    }
    return (
      <>
        Not signed in <br />
        <button onClick={() => signIn()}>Sign in</button>
      </>
    );
}
export default LoginComp