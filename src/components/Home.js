import React, { useEffect, useState } from 'react'
import Loading from './Loading'

const Home = () => {
    const [data, setData] = useState();
    const [loading, setloading] = useState(true)

    const getPortfolio = async()=>{

        const response = await fetch(`/portfolio`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const json = await response.json();
        setData(json)
        setTimeout(() => {
            setloading(false);
        }, 800);
    }

    useEffect(() => {
        getPortfolio();
        // eslint-disable-next-line
    }, [])
  return (
    <>
    {loading?<Loading/>:
    <div className="container">

      <div className="row row-cols-1 row-cols-md-2 mx-4">

        <div className="col-12">

          <div className="row my-3">
            <span className="mb-3 fs-4 text-secondary">NET WORTH</span>
            <br/>
            <span className="fs-2 fw-bold">Rs. {data["grand_total"]}</span>
          </div>

          <div className="row my-5">
            <div className="col">
              <span className="mb-3 fs-4 text-secondary">TODAY'S CHANGE</span>
              <br/>
              <span className="fs-2 fw-bold" style={{color: data["color"]}}>Rs. {data["change"]}</span>
              <br/>
              <span className="fs-2" style={{color: data["color"]}}>({data["pchange"]}%)</span>
            </div>
            <div className="col">
              <span className="mb-3 fs-4 text-secondary" >OVERALL CHANGE</span>
              <br/>
              <span className="fs-2 fw-bold" style={{color: data["overall_change"]["color"]}}>Rs. {data["overall_change"]["change"]}</span>
              <br/>
              <span className="fs-2" style={{color: data["overall_change"]["color"]}}>({data["overall_change"]["percentage"]}%)</span>
            </div>
          </div>

          <div className="row my-5">
            <span className="mb-3 fs-4 text-secondary">CASH IN HAND</span>
            <br/>
            <span className="fs-2 fw-bold">Rs. {data["balance"]}</span>
          </div>

        </div>

        <div className="col-12 table-responsive">
          <table className="table table-borderless mt-3">
                <thead>
                    <tr>
                        <th scope="col">Symbol</th>
                        <th scope="col">Name</th>
                        <th scope="col">Shares</th>
                        <th scope="col">Price</th>
                        <th scope="col">Total</th>
                    </tr>
                </thead>
                <tbody>
                  {data["shares"].map((obj) => (
                    <tr>
                        <td>{ obj["Symbol"] }</td>
                        <td>{ obj["Name"] }</td>
                        <td>{ obj["Shares"] }</td>
                        <td>{ obj["Price"] }</td>
                        <td>{ obj["Total"] }</td>
                    </tr>
                  ))
                  }
                    <tr>
                        <td>CASH</td>
                        <td colspan="3"></td>
                        <td>{data["balance"]}</td>
                    </tr>
                </tbody>
                  {/* <tfoot>
                      <tr>
                          <td colspan=4></td>
                          <td><strong>{{ grand_total }}</strong></td>
                      </tr>
                  </tfoot> */}
          </table>
        </div>

      </div>

    </div>}
   </>
  )
}

export default Home