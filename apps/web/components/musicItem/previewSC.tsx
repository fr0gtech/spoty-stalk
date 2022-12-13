import { Button, Tag } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import Image from "next/image";
import ReactAudioPlayer from "react-audio-player";

function PreviewSC(props: any) {
  return (
    <div>
      <Popover2
        content={
          <>
            <iframe
              width="100%"
              height="166"
              scrolling="no"
              frameBorder="no"
              allow="autoplay"
              src={`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${props.id}&color=%23264858&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`}
            />
          </>
        }
      >
         <Tag
                                  className="
                                    !w-[50px]
                                    !h-[15px]
                                    !min-h-[15px]
                                    !p-0
                                    text-center
                                    font-bold
                                    !text-[9px]
                                    !bg-neutral-600
                                    uppercase
                                    "
                                  intent="success"
                                >
                                  Preview
                                </Tag>
      </Popover2>
    </div>
  );
}

export default PreviewSC;
