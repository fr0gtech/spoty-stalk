import { Spinner } from "@blueprintjs/core";
import { useEffect, useState } from "react";
import Image from "next/image";
function LoadingComp() {
  return (
    <div className="flex justify-center h-screen bg-neutral-900 items-center">
      <div className="flex flex-col gap-4">
        <Spinner />
        <div className="text-white flex justify-center items-center">
          <Image alt="logo" src="/frog.png" height={30} width={30} />
          <div>Loading</div>
        </div>
      </div>
    </div>
  );
}

export default LoadingComp;
