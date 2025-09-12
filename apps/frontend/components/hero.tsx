"use client"

import React from 'react'
import { PrimaryButton } from './Buttons/PrimaryButton'
import { SecondaryButton } from './Buttons/SecondaryButton'
import Feature from './Buttons/Feature'
import { useRouter } from 'next/navigation'

const Hero = () => {
    const router = useRouter()
  return (
    <div className='flex flex-col justify-center items-center'>
        <div className="text-5xl font-semibold text-center pt-18  max-w-2xl">
            Automate as fast as you can type
        </div>
        <div className='text-center pt-10 font-medium text-xl  max-w-4xl'>
            AI gives you automation superpowers,and Zapier puts them to work.Pairing AI and Zapier helps you turn ideas into workflows and bots that work for you 
        </div>

        <div className='flex pt-3'>
            <div className='pr-4'>
                <PrimaryButton onClick={()=>{
                    router.push("/signup")
                }} size="big">Get Startted free</PrimaryButton>
            </div>
            <SecondaryButton onClick={()=>{}} size='big'>Contact Sales</SecondaryButton>
        </div>

        <div className='flex pt-3'>
            <Feature tittle='Free Forevr' subtittle=' Core Features'></Feature>
            <Feature tittle='More Apps' subtittle=' than Any Other Platforms'></Feature>
            <Feature tittle='Cutting-edge' subtittle=' AI features'></Feature>
        </div>
     </div>
  )
}

export default Hero