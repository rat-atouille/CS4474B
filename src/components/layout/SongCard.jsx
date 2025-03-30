import React from 'react'
//import {songData} from "../../assets/constants"
import { useNavigate } from 'react-router'

const  SongCard = ({image, type, genre, desc, id}) => {
    const navigate = useNavigate()

    // Handle navigation based on the type
    const handleNavigate = () => {
        console.log('Navigating with type:', type);
        if (type === 'Song') {
            navigate(`/album/${id}`);
        } else if (type === 'Audiobook') {
            navigate(`/song/${id}`);
        } else {
            navigate(`/podcast`);
        }
    };
    return (
        <div onClick={handleNavigate} className='min-w-[180px] p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26]'>
            <img className ='rounded' src={image} alt=""/>  
            <p className='font-bold mt-2 mb-1'>{genre}</p>

        </div>   
    )
}

export default SongCard;