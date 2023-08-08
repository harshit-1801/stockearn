import React, { useEffect, useState } from 'react'
import Loading from './Loading'
import {useNavigate} from 'react-router-dom';

const Sell = (props) => {
    const [stocks, setstocks] = useState();
    const [loading, setloading] = useState(true)
    const [req, setreq] = useState({symbol: "", quantity: ""})

    const onChange = (e)=>{
        setreq({...req, [e.target.name]: e.target.value})
    }

    const getStocks = async()=>{

        const response = await fetch(`/getstocks`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const json = await response.json();
        setstocks(json.stocks)
        const data = JSON.stringify(json)
        setreq({symbol: JSON.parse(data)["stocks"][0]});
        setTimeout(() => {
            setloading(false);
        }, 800);
    }

    useEffect(() => {
        getStocks();
        // eslint-disable-next-line
    }, [])

    let navigate = useNavigate();

    const handleSubmit = async(e)=>{
        e.preventDefault();
        console.log(req.symbol);
        const response = await fetch(`/sell`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({"symbol": req.symbol, "quantity": req.quantity})
        });

        const json = await response.json();
        if(json.success){
            props.showAlert("Sold","success")
            navigate("/")
        }
        else{
            props.showAlert(json.error,"danger")
        }
    }

  return (
    <>
    {loading?<Loading/>:
    <div className="d-flex justify-content-center text-center mt-3">
    <form className="form-signin" onSubmit={handleSubmit}>
      <br/>
      <div className="mb-3">
        <label htmlFor="symbol" className="form-label">Symbol</label>
        <select className="form-control custom-select" name="symbol" id="symbol" width="250" onChange={onChange}>
            {stocks.map((symbol) => ( <option>{symbol}</option>))}
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="quantity" className="form-label">Quantity</label>
        <input type="text" autoComplete="off" className="form-control" name="quantity" id="quantity" onChange={onChange}/>
      </div>
      <button type="submit" className="btn btn-primary">Sell</button>
    </form>
    </div>}
  </>
  )
}

export default Sell