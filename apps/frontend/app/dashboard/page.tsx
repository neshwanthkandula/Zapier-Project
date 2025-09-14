"use client"
import React, { useEffect, useState } from 'react'
import { DarkButton } from '../../components/Buttons/DarkButton'
import axios from 'axios';
import { BACKEND_URL, HOOK_URL } from '../config';
import { useRouter } from 'next/navigation';


interface zap {
  "id": string,
  "userId": number,
  "actions":{
      "id": string,
      "zapId": string,
      "actionId": string,
      "metadata": JSON,
      "sortingOrder": number,
      "type": {
        "id": string,
        "name": string,
        "image": string
      }
    }[],
  "trigger": {
    "id": string,
    "zapId": string,
    "triggerId": string,
    "metadata": JSON,
    "type": {
      "id": string,
      "name":  string,
      "image": string
    }
  }
}


function useZaps(){
  const [loading , setlLoading] = useState(true);
  const [zaps , setZaps] = useState<zap[]>();

  useEffect(()=>{
    axios.get(`${BACKEND_URL}/zap`,{
      headers: {
        Authorization: `${localStorage.getItem("token")}`
      }
    }).then((res)=>{
      setlLoading(false);
      return setZaps(res.data.zaps)
    }).catch((e)=>{
      console.log(e)
    })
    
  }, [])
  

  return {
    loading, zaps
  }
}

const page = () => {
  const { loading , zaps} = useZaps();
  const router = useRouter()
  return (
    <div className='flex flex-col justify-center w-full'>
        <div className='flex justify-center flex-1'>
            <div className=' w-full max-w-screen-lg font-semibold text-2xl'>My Zaps </div>
            <div className='flex justify-end pr-4'>
                <DarkButton onClick={()=>{
                  router.push("/zap/create");
                }}>Create</DarkButton>
            </div>
        </div>
        <div className='flex-1'>
          { loading? "loading...." : zaps? <div><ZapTable zaps={zaps}/></div>:"No available zaps"}
        </div>
    </div>
  )
}

function ZapTable({ zaps } : { zaps : zap[] }) {
  return (
    <div className='w-full max-w-screen-lg mx-auto py-4'>
      {/* table heading */}
      <div className='flex font-semibold text-xl border-b items-center'>
        <div className='flex-1 px-2'>Name</div>
        <div className='flex-1 px-2'>ZapId</div>
        <div className='flex-1 px-2'>Webhook URL</div>
        <div className='flex-1 px-2'>Created At</div>
        <div className='flex-1 px-2 text-right'>Go</div>
      </div>

      {/* body */}
      <div>
        {zaps.map((z ,indx) => (
          <div
            key={ indx }
            className='flex border-b border-t py-4 items-center'
          >
            {/* Name: Trigger + Action icons */}
            <div className="flex-1 flex items-center space-x-2 px-2">
              <img
                src={z.trigger.type.image}
                alt={z.trigger.type.name}
                className="w-6 h-6 object-contain"
              />
              {z.actions.map((za, idx) => (
                <img
                  key={idx}
                  src={za.type.image}
                  alt={za.type.name}
                  className="w-6 h-6 object-contain"
                />
              ))}
            </div>

            {/* ZapId */}
            <div className='flex-1 px-2 truncate'>{z.id}</div>

            {/* Webhook URL */}
            <div className='flex-1 px-2 truncate' title={`${HOOK_URL}${z.userId}/${z.id}`}>
              {`${HOOK_URL}${z.userId}/${z.id}`}
            </div>

            {/* Created At */}
            <div className='flex-1 px-2'>Nov 23 2026</div>

            {/* Go */}
            <div className='flex-1 px-2 text-right text-blue-500 cursor-pointer'>
              go
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


export default page