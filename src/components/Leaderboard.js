import React, { useEffect, useState } from 'react'
import Gold from "../assets/gold.png"
import Silver from "../assets/silver.png"
import Bronze from "../assets/bronze.png"
import Loading from './Loading'

function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState();
    const [loading, setloading] = useState(true)

    const getLeaderboard = async()=>{

        const response = await fetch(`/leaderboard`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const json = await response.json();
        setLeaderboard(json.leaderboard)
        setTimeout(() => {
            setloading(false);
        }, 800);
    }

    useEffect(() => {
        getLeaderboard();
        // eslint-disable-next-line
    }, [])
    
    const rank = (data,index)=>{
        if(index === 0){
            return <>
                    <th scope="row"><img src= {Gold} alt='gold' width='36rem'/></th>
                    <td className='fs-5 fw-semibold'>{data[0]}</td>
                    <td className='fs-5 fw-semibold'>{data[1]}</td>
                </>
        }
        else if(index === 1){
            return <>
                    <th scope="row"><img src= {Silver} alt='gold' width='36rem'/></th>
                    <td className='fs-5 fw-semibold'>{data[0]}</td>
                    <td className='fs-5 fw-semibold'>{data[1]}</td>
                </>
        }
        else if(index === 2){
            return <>
                    <th scope="row"><img src= {Bronze} alt='gold' width='36rem'/></th>
                    <td className='fs-5 fw-semibold'>{data[0]}</td>
                    <td className='fs-5 fw-semibold'>{data[1]}</td>
                </>
        }
        else{
            return <>
                <th scope="row">{index+1}</th>
                    <td>{data[0]}</td>
                    <td>{data[1]}</td>
                </>
        }
    }

  return (
    <>
    {loading?<Loading/>:
    <div className='container'>
        <table className="table">
            <thead>
                <tr>
                    <th scope="col">Rank</th>
                    <th scope="col">Username</th>
                    <th scope="col">Cash</th>
                </tr>
            </thead>
            <tbody>
                {
                    leaderboard && leaderboard.map((data,index) => (
                        <tr>{rank(data,index)}</tr>
                    ))
                }
            </tbody>
        </table>
    </div>}
    </>
  )
}

export default Leaderboard