import { Button, Tag } from "@blueprintjs/core"
import { Popover2 } from "@blueprintjs/popover2"
import NewTag from "./newtag"

function Info(){
    return (
        <Popover2
            minimal
            content={
              <div className="p-2 bg-neutral-900 leading-relaxed">
                <h3 className="text-lg">What is this?</h3>
                <span className="font-bold">
                  Spoty-stalk help you stalk someones public playlists.
                </span>
                <p>
                  {" "}
                  Rather than going into every playlist and looking for newly
                  added songs <br /> you can use this website to check for new
                  songs over all playlists.<br/>
                  <span className="font-bold">
                We also track Soundcloud likes.
                </span>
                </p>

                <h3 className="text-lg">How does this work?</h3>

                <span className="font-bold">
                  We check all playlist every minute and check for new songs.
                </span>
                <p>
                  When you visit this page we set a cookie that can be read when
                  you revisit later.
                  <br />
                  Songs that have been added in between ur last visit will marked
                  here with a <NewTag/> tag.
                </p>
               
                <p>
                 
                </p>
               
                <span className="font-bold">
                  Recommended:
                </span>
                <p>
                  We track songs <span className="text-xs"><Tag intent="none">Songs</Tag>, <Tag intent="warning">Playlists</Tag>,<Tag intent="primary"> Albums</Tag> and <Tag intent="danger">Artist</Tag>  posted on the subreddit</span>

                </p>

               
              </div>
            }
          >
            <Button minimal icon="info-sign" className="opacity-50" />
          </Popover2>
    )
}

export default Info