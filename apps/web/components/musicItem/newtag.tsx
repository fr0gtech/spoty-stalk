import { Tag } from "@blueprintjs/core";

function NewTag(props: any) {
  return (
    <Tag
      className="
        !w-[40px]
        !bg-gradient-to-r 
        from-blue-400 
        to-orange-500 
        via-purple-500 
        animate-gradient-x 
        font-bold h-[15px] 
        !text-[9px]
        !min-h-[10px]"
      intent="success"
    >
      NEW
    </Tag>
  );
}
export default NewTag;
