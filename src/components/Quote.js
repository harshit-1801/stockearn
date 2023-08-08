import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom';

function Quote() {
    const [submitted, setSubmitted] = useState(false);

    const [symbol, setSymbol] = useState();

    const handleSubmit = (e)=>{
        e.preventDefault();
        setSubmitted(true);
    }

    const onChange = (e)=>{
        setSymbol(e.target.value)
    }

    let navigate = useNavigate();
    
    if (submitted){
        navigate("/quoted",{state: {symbol: symbol}})
    }
  return (
    <div className="d-flex justify-content-center text-center mt-3">
        <form className="form-signin" onSubmit={handleSubmit}>
        <br/>
        <div className="mb-3">
            <label htmlFor="symbol" className="form-label">Symbol</label>
            <input type="text" autoComplete="off" className="form-control" name="symbol" id="symbol" onChange={onChange}/>
        </div>
        <button type="submit" className="btn btn-primary">Quote</button>
        </form>
    </div>
  )
}

export default Quote