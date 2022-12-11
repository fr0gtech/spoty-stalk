import { Button } from "@blueprintjs/core";
import { useRouter } from "next/router";

function MusicPlayerCantPlayHere() {
  const router = useRouter();
  return (
    <div className="flex">
      <div className="flex gap-[20%] items-center bg-neutral-800 p-4 rounded mt-3 w-full justify-center mr-2">
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
