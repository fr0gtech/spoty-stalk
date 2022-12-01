import { logger, spotifyApi } from "./app";

/**
 *
 * @returns {token}
 */
export const getToken = async () => {
  logger.info("getToken - Trying to get access token");
  try {
    spotifyApi.setAccessToken(
      (await spotifyApi.clientCredentialsGrant()).body.access_token
    );
  } catch (e) {
    throw console.error("no token", e);
  }
};
