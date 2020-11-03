import React,{useEffect, useState} from 'react'
import axios,{ AxiosResponse } from 'axios'



const SessionsDay: React.FC = () => {
    const [dataByDay, setDataByDay] = useState([]);
    const [offset, setOffset] = useState(0);
    useEffect(() => {
        (async ()=>{
        try {
            const {data}=await axios.get(`http://localhost:3001/events/by-days/${offset}`);
            console.log(data);
        } catch (error) {
            
        }
    })()}, [])

    return (
        <div>
            SessionsDay
        </div>
    )
}

export default SessionsDay;