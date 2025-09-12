"use client"

import React from 'react'

export const Input = ({label , placeholder , onChange , type = "text"} : {
    label : string,
    placeholder : string,
    onChange : (e : any)=>void,
    type? : "text" | "password" | "email"
}) => {
  return (
    <div>
        <div>
            <label className=' font-bold'>* {label}</label>
        </div>
        <input type={type} placeholder={placeholder} onChange={onChange} className='border-black w-full px-2 py-4'></input>
    </div>
  )
}