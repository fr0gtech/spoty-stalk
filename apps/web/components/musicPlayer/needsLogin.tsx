import { Button } from "@blueprintjs/core";
import { signIn } from "next-auth/react";
import Spotify from "../../public/spotify.svg";

function MusicPlayerNeedsLogin() {
  return (
    <div className="flex">
        <div className="flex h-[68.5px] shadow-xl items-center bg-neutral-800 p-2 rounded w-full justify-center ml-[2px] mr-[2px]">
        <h4 className="text-md text-center flex items-center">
          Login to
          <Button
            onClick={() => signIn("spotify")}
            className="mx-3 !bg-neutral-800"
            small
          >
            <div className="flex items-center gap-3">
              <div>
                <Spotify fill={"#1DB954"} height={16} width={16} />
              </div>
              <div>Spotify</div>
            </div>
          </Button>
          to play full songs
        </h4>
      </div>
    </div>
  );
}
export default MusicPlayerNeedsLogin;
