import { ReactNode } from "react";

export const LinkButton = ({ children, onClick} : {  children : ReactNode , onClick : ()=> void })=>{
    return <button  onClick={onClick} 
    className="px-2 py-4 rounded cursor-pointer hover:bg-slate-200 transition">
        {children}
    </button>
} 