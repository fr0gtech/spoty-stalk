import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

async function refreshAccessToken(token: any) {
  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        Authorization:
          "Basic " +
          new Buffer(
            ((process.env.SPOTIFY_CLIENT_ID as string) +
              ":" +
              process.env.SPOTIFY_CLIENT_SECRET) as string
          ).toString("base64"),
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      }),
    }).then((e) => e.json());
    return {
      accessToken: response.access_token,
      expiresAt: Date.now() / 1000 + response.expires_in,
    };
  } catch (error) {
    console.log(error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export default NextAuth({
  providers: [
    SpotifyProvider({
      authorization:
        "https://accounts.spotify.com/authorize?scope=streaming,user-read-email,user-read-private,user-read-playback-state,user-modify-playback-state",
      clientId: process.env.SPOTIFY_CLIENT_ID as string,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }: any) {
      if (account && user) {
        token.expiresAt = account.expires_at;
        token.refreshToken = account.refresh_token;
        token.accessToken = account.access_token;

        // if (Date.now() / 1000 > token.expiresAt) {
        //   const newToken = await refreshAccessToken(token);
        //   token.expiresAt = newToken.expiresAt;
        //   token.accessToken = newToken.accessToken;
        // }

      }

      return token;
    },
    async session({ session, user, token }: any) {
      if (token) {
        session.expiresAt = token.expiresAt;
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
      }
      return session;
    },
  },
});
