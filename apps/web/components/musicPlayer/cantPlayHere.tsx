import { Button } from "@blueprintjs/core";
import { useRouter } from "next/router";

function MusicPlayerCantPlayHere() {
  const router = useRouter();
  return (
    <div className="flex">
    <div className="flex h-[68px] shadow-xl items-center bg-neutral-800 p-2 rounded w-full justify-between ml-[2px] mr-[2px]">
        <h4 className="text-md text-center flex items-center">
          Player does not work on recommended page. (it could){" "}
          <Button
            onClick={() => router.push("/")}
            className="ml-2 !bg-neutral-700"
          >
            Go back
          </Button>
        </h4>
      </div>
    </div>
  );
}
export default MusicPlayerCantPlayHere;
