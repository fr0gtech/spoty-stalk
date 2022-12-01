import { Button } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import Image from "next/image";
import ReactAudioPlayer from "react-audio-player";
function Preview(props: any) {
  return (
    <div>
      <Popover2
        content={
          <>
            {props.song.images[0] ? (
              <Image
                width={300}
                height={300}
                alt="album art"
                src={props.song.images[0].url}
              />
            ) : (
              <div></div>
            )}
            {props.song.previewUrl !== null && (
              <ReactAudioPlayer
                volume={0.1}
                autoPlay
                src={props.song.previewUrl}
                controls
              />
            )}
            <div></div>
          </>
        }
      >
        <Button
          minimal
          small
          disabled={props.song.previewUrl === null}
          icon="play"
        />
      </Popover2>
    </div>
  );
}

export default Preview;
