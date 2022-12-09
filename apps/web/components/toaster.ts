import{Position,Toaster}from "@blueprintjs/core";


export const Toast = (typeof window !== 'undefined')
? Toaster.create({
  className: 'my-toaster',
  position: Position.BOTTOM_RIGHT,
})
: null