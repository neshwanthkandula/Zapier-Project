"use client"
import { LinkButton } from "./Buttons/linkbutton"
import { useRouter } from "next/navigation"
import { PrimaryButton } from "./Buttons/PrimaryButton";

export function Appbar(){
    const router = useRouter();
    return <div className="flex border-b justify-between">
        <div className="flex justify-center items-center p-4 font-extrabold text-lg">
            Zapier
        </div>
        <div className="flex">
            <div className="pr-4">
                <LinkButton onClick={()=>{}}>contact sales</LinkButton>
            </div>
            <div className="pr-4">
                <LinkButton onClick={()=>{
                    router.push("/login")
                }}>log in</LinkButton>
            </div>
            <div className="pr-4 pt-2">
                <PrimaryButton onClick={()=>{
                    router.push("/signup")
                }} 
                >signup</PrimaryButton>
            </div>
        </div>
    </div>
}