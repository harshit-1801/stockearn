import React, { useEffect, useState } from 'react'
import Loading from './Loading'

function History() {
    const [transactions, setTransactions] = useState();
    const [loading, setloading] = useState(true)

    const getTransactions = async()=>{

        const response = await fetch(`/history`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const json = await response.json();
        setTransactions(json.transactions)
        setTimeout(() => {
            setloading(false);
        }, 800);
    }

    useEffect(() => {
        getTransactions();
        // eslint-disable-next-line
    }, [])

  return (
    <>
    {loading?<Loading/>:
    <div className='container'>
        <table className="table">
            <thead>
                <tr>
                    <th scope="col">Symbol</th>
                    <th scope="col">Shares</th>
                    <th scope="col">Price</th>
                    <th scope="col">Timestamp</th>
                </tr>
            </thead>
            <tbody>
                {
                    transactions && transactions.map((data) => (
                        <tr>
                            <th scope="row">{data[0]}</th>
                            <td>{data[1]}</td>
                            <td>{data[2]}</td>
                            <td>{data[3]}</td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    </div>}
    </>
  )
}

export default History