import { Icon } from "@blueprintjs/core"
import Image from "next/image"
function Nodata(){
    return (
    <div className="flex flex-col justify-center h-[calc(100vh-200px)] w-full items-center">
                <Image alt="frog" height={200} width={200} src="/frog.png"/>

        <div className="bg-neutral-800 rounded shadow h-fit flex p-3 gap-5">

        <Icon icon="data-connection" />
            <div>
            <h4>No data</h4>

            </div>
        </div>
    </div>
    )
}
export default Nodata