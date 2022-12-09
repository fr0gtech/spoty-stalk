import NextAuth from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';
async function refreshAccessToken(token:any) {
  console.log('running refreshAccessToken');
  
  try {    
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Authorization': 'Basic ' + (new Buffer(process.env.SPOTIFY_CLIENT_ID as string + ':' + process.env.SPOTIFY_CLIENT_SECRET as string).toString('base64'))
      },
      body: new URLSearchParams({
        'grant_type': 'refresh_token',
        'refresh_token': token.refreshToken,
    })
    
    }).then((e)=> e.json())
    
     return {
      accessToken: response.access_token,
      expiresAt: (Date.now() + (response.expires_in * 1000)),
     }
 // return {
    //   ...token,
    //   accessToken: refreshedTokens.access_token,
    //   accessTokenExpires: Date.now() + refreshedTokens.expires_at * 1000,
    //   refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    // }    }

    // const url =
    //   "https://oauth2.googleapis.com/token?" +
    //   new URLSearchParams({
    //     client_id: process.env.SPOTIFY_CLIENT_ID as string,
    //     client_secret: process.env.SPOTIFY_CLIENT_SECRET as string,
    //     grant_type: "refresh_token",
    //     refresh_token: token.refreshToken,
    //   })

    // const response = await fetch(url, {
    //   headers: {
    //     "Content-Type": "application/x-www-form-urlencoded",
    //   },
    //   method: "POST",
    // })

    // const refreshedTokens = await response.json()

    // if (!response.ok) {
    //   throw refreshedTokens
    // }

    // return {
    //   ...token,
    //   accessToken: refreshedTokens.access_token,
    //   accessTokenExpires: Date.now() + refreshedTokens.expires_at * 1000,
    //   refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    // }
  } catch (error) {
    console.log(error)

    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}
export default NextAuth({
  providers: [
    SpotifyProvider({
      authorization:
        'https://accounts.spotify.com/authorize?scope=streaming,user-read-email,user-read-private,user-read-playback-state,user-modify-playback-state,user-library-read,user-library-modify',
      clientId: process.env.SPOTIFY_CLIENT_ID as string,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET  as string,
    }),
  ],
  callbacks: {
    async jwt({token, account, user}:any) {
      
            // Initial sign in
      if (account && user) {
        token.expiresAt = account.expires_at;
        token.refreshToken = account.refresh_token;
        token.accessToken = account.access_token;
        // console.log('jwt',token.expiresAt, Date.now() / 1000);

        // if (Date.now() / 1000 > token.expiresAt){
        //   const newToken = await refreshAccessToken(token)
        //   token.expiresAt = newToken.expiresAt
        //   token.accessToken = newToken.accessToken
        // }
        // console.log(account.expires_at, new Date(account.expires_at));

      }
      
      return token
    },
    async session({session, user, token}:any) {
      
      // if (token){
      //   session.expiresAt = token.expiresAt
      //   session.refreshToken = token.refreshToken
      //   session.accessToken = token.accessToken
      // }
      if (token) {
        session.expiresAt = token.expiresAt
        session.accessToken = token.accessToken
        
        // this is bad because gets spammed but idk other fix
        if (Date.now() / 1000 > token.expiresAt){
          const newToken = await refreshAccessToken(token)
          session.expiresAt = newToken.expiresAt
          session.accessToken = newToken.accessToken
        }
      }
      
      console.log(token.expiresAt, new Date(token.expiresAt * 1000));
      
        // }else{
      //   session.token = await refreshAccessToken(token)
      //   return session
      // }    
      return session;
    },
  },
});