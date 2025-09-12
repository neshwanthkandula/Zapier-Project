import React from 'react'

const Feature = ({tittle , subtittle} : { tittle : string , subtittle : string}) => {
  return (
    <div className='flex text-sm justify-center items-center pr-8'>
        <Check/>
        <div className='pl-1 font-bold'>
            {tittle}
        </div>
        <div className='pl-1'>
            {subtittle}
        </div>
    </div>
  )
}

export default Feature

function    Check(){
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
}