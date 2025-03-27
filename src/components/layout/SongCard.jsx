import React from 'react'
//import {songData} from "../../assets/constants"
import { useNavigate } from 'react-router'

const  SongCard = ({image, name, genre, desc, id}) => {
    const navigate = useNavigate()
    return (
        <div onClick={()=>navigate(`/album/${id}`)} className='min-w-[180px] p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26]'>
            <img className ='rounded' src={image} alt=""/>  
            <p className='font-bold mt-2 mb-1'>{genre}</p>

        </div>   
    )
}

export default SongCard;