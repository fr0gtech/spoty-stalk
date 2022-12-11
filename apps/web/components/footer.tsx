import Link from "next/link";
import Image from "next/image";
import Top10 from "./top10";
import { Button } from "@blueprintjs/core";
import Github from "../public/github.svg";

function FooterComp(props: any) {
  return (
    <footer className="!z-10 fixed bottom-0 container mx-auto bg-neutral-900 p-2 ">
      <div className="flex justify-between gap-3">
        <div className="flex items-center">
          <div>
            made by <Link href={"https://frogtech.dev"}> frogtech</Link>
          </div>

          <div>
            <Image alt="logo" src="/frog.png" height={30} width={30} />
          </div>
        </div>

        {/* <Top10 openInApp={props.openInApp} /> */}

        {/* {data && <div>Loaded {data.pages.length * pageSize} songs</div>} */}
      </div>
    </footer>
  );
}

export default FooterComp;
