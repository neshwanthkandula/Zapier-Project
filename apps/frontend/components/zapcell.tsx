import React from 'react'

const ZapCells = ({tittle ,indx , onClick } : {tittle : string , indx : number ,onClick : ()=>void}) => {
  return (
    <div className='border border-black bottom-4 p-8 w-48 rounded-lg shadow-md' onClick={onClick}>
        <div className="flex text-xl justify-center items-center">
            <div className="font-bold">
                {indx}. 
            </div>
            <div>
                {tittle}
            </div>
        </div>
    </div>
  )
}

export default ZapCells