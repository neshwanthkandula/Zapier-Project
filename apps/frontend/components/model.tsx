import React from 'react'

interface props{
  id : string,
  name : string,
  image : string
}

const Model = ({ availableitems , Tittle , onClick} : {
  Tittle : string,
  availableitems : props[]
  onClick : (id : string , name : string)=>void
}) => {
   return (
    <div className="bg-white shadow-lg rounded-xl p-6 w-96 max-w-lg">
      <div className="font-semibold text-lg mb-2">{Tittle}</div>
      <div className="space-y-2 ">
        {availableitems.map(( item, index) => (
          <div
            key={index}
            className=" bg-gray-100 rounded-lg hover:bg-gray-200  hover:cursor-pointer flex justify-start items-center"
            onClick={()=>{onClick(item.id , item.name)}}
          >
            <div className='w-10 h-10 object-contain flex items-center justify-center'>
              <img src={item.image}
              alt={item.name}></img>
            </div>
            <div className='pl-2 text-center'>{item.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Model