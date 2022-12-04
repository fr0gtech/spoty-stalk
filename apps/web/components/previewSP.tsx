import { Button } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import Image from "next/image";
import ReactAudioPlayer from "react-audio-player";

function PreviewSP(props: any) {
  return (
    <div>
      <Popover2
      popoverClassName="spotifyembed"
        content={
          <div >
            <iframe
            style={{borderRadius: "14px"}}
            src={props.url}
            height="80"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture">

            </iframe>

          </div>
        }
      >
        <Button
          minimal
          small
          icon="play"
        />
      </Popover2>
    </div>
  );
}

export default PreviewSP;
