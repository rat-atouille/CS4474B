import React from 'react'
//import {songData} from "../../assets/constants"
import { useNavigate } from 'react-router'

const  SongCard = ({image, type, genre, desc, id}) => {
    const navigate = useNavigate()

    // Handle navigation based on the type
    const handleNavigate = () => {
        if ((type === 'Podcast') && (genre==='Sport')){
            navigate(`/podcast`);
        } else {
            navigate(`/genre/${genre}`);
        }
    };
    return (
        <div onClick={handleNavigate} className='min-w-[180px] p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26]'>
            <img className ='rounded' src={image} alt={genre} />  
        </div>   
    )
}

export default SongCard;