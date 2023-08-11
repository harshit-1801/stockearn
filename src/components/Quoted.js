import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import Loading from './Loading'

function Quoted() {
  const [quote, setQuote] = useState({});
  const [loading, setloading] = useState(true)

  const location = useLocation();
  let symbol = location.state.symbol

  const getQuote = async () => {
    const response = await fetch(`/quote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ symbol: symbol })
    });

    const json = await response.json();
    setQuote(json.quote)
    setTimeout(() => {
      setloading(false);
    }, 800);
  }

  useEffect(() => {
    getQuote();
    // eslint-disable-next-line
  }, [])

  return (
    <>
    {loading?<Loading/>:
    <div className="container">
      <div className="row mx-4">
        <div className="row fs-2 fw-bold mt-3">
          {quote['symbol']}
        </div>
        <div className="row fs-4 fw-bold mt-2" style={{color: "#00000080"}}>
          {quote['company']}
        </div>
        <div className="row mt-2 ps-0">
          <span>
            <span className="fs-2 fw-bold ">{quote['lastPrice']}</span>
            <span className="fs-6 fw-normal">INR</span>
          </span>
        </div>
        <div className="row fs-5 mt-2 ps-0"  style={{ color: "#00000080" }}>
          {quote['pChange'] > 0?
            <i className="fas fa-sort-up col pt-2 fs-3" style={{ color:"green", flex:"0" }}></i>:
            <i className="fas fa-sort-down col fs-3" style={{ color:"red", flex:"0", lineHeight:"0.8" }}></i>
          }
          <span className="ps-0 col">
            { quote['change'].toFixed(2) } ({ quote['pChange'].toFixed(2) }%)
          </span>
        </div>
      </div>
      <div className="row row-cols-2 row-cols-md-3 mt-5 ps-0">
        <div className="col mb-3">
          <span className="fs-5 text-secondary">Open</span>
          <br />
          <span className="fs-4 mt-3">{ quote['open'] }</span>
        </div>
        <div className="col mb-3">
          <span className="fs-5 text-secondary">Day's High</span>
          <br />
          <span className="fs-4 mt-3">{ quote['dayHigh'] }</span>
        </div>
        <div className="col mb-3">
          <span className="fs-5 text-secondary">Day's Low</span>
          <br />
          <span className="fs-4 mt-3">{ quote['dayLow'] }</span>
        </div>

        <div className="col mb-3">
          <span className="fs-5 text-secondary">Prev. Close</span>
          <br />
          <span className="fs-4 mt-3">{ quote['close'] }</span>
        </div>
        <div className="col mb-3">
          <span className="fs-5 text-secondary">52 Week High</span>
          <br />
          <span className="fs-4 mt-3">{ quote['yearHigh'] }</span>
        </div>
        <div className="col mb-3">
          <span className="fs-5 text-secondary">52 Week Low</span>
          <br />
          <span className="fs-4 mt-3">{ quote['yearLow'] }</span>
        </div>
      </div>
    </div>}
    </>
  )
}

export default Quoted