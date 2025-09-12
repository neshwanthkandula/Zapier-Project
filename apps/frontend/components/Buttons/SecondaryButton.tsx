import React, { ReactNode } from 'react'

export const SecondaryButton = ({children , onClick , size="small"} : { children: ReactNode , onClick : ()=>void , size?: "big" | "small"})=>{
  return (
    <div onClick={onClick} className={`${size === "small"? "text-sn" : "text-xl"}
    ${size === "small"? "px-4 p-2" : "px-10 py-4"} bg-white border-2 border-black rounded-full cursor-pointer text-black hover:shadow-xl`}>
        {children}
    </div>
  )
}