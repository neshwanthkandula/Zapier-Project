"use client"

import React, { useState } from 'react'
import CheckFeature from '../../components/Buttons/CheckFeature'
import { Input } from '../../components/Input'
import { PrimaryButton } from '../../components/Buttons/PrimaryButton'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { BACKEND_URL } from '../config'

const page = () => {
  const router = useRouter()
    const [password , setpassword] = useState(" ");
    const [email, setemail] = useState(" ");
  return (
    <div className="flex pt-20 pb-20 gap-16 justify-center items-center">
      {/* Left section */}
      <div className="flex flex-col pt-8 max-w-2xl">
        <div className="font-semibold text-3xl mb-6">
          Join millions worldwide who automate their work using Zapier.
        </div>
        <div className="flex flex-col items-start">
          <CheckFeature label="Easy setup, no coding required" />
          <CheckFeature label="Free forever for core features" />
          <CheckFeature label="14-day trial for premium features & apps" />
        </div>
      </div>

      {/* Right section (Form) */}
      <div className="w-full max-w-md px-10 py-8 border rounded-xl shadow-md bg-white">
        <Input
          type="email"
          placeholder="Enter your email"
          label="Email"
          onChange={(e) => {
            setemail(e.target.value)
          }}
        />
        <Input
          type="password"
          placeholder="Set a password"
          label="Password"
          onChange={(e) => {
            setpassword(e.target.value)
          }}
        />
        <div className='py-4'>
          <PrimaryButton size="big" onClick={async () => {
            console.log("hii" + email, password)
            const res = await axios.post(`${BACKEND_URL}/user/signin`,{
              password,
              username : email
            })

            localStorage.setItem("token", res.data.token);
            router.push("/dashboard")
          }}>
            login
          </PrimaryButton>
        </div>
      </div>
    </div>
  )
}

export default page
