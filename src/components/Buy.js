import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom';

const Buy = () => {
    let navigate = useNavigate();

    const [req, setreq] = useState({symbol: "", quantity: ""})

    const onChange = (e)=>{
        setreq({...req, [e.target.name]: e.target.value})
    }

    const handleSubmit = async(e)=>{
        e.preventDefault();
        const response = await fetch(`/buy`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({"symbol": req.symbol, "quantity": req.quantity})
        });

        const json = await response.json();
        if(json.success){
            navigate("/")
        }
    }

  return (
    <div className="d-flex justify-content-center text-center mt-3">
        <form className="form-signin" onSubmit={handleSubmit}>
        <br/>
        <div className="mb-3">
            <label htmlFor="symbol" className="form-label">Symbol</label>
            <input type="text" autoComplete="off" className="form-control" name="symbol" id="symbol" onChange={onChange}/>
        </div>
        <div className="mb-3">
            <label htmlFor="quantity" className="form-label">Quantity</label>
            <input type="text" autoComplete="off" className="form-control" name="quantity" id="quantity" onChange={onChange}/>
        </div>
        <button type="submit" className="btn btn-primary">Buy</button>
        </form>
    </div>
  )
}

export default Buy