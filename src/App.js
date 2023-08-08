import React, {useState} from 'react'
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Alert from './components/Alert';
import Navbar from './components/Navbar';
import Leaderboard from './components/Leaderboard';
import Login from './components/Login';
import History from './components/History';
import Quote from './components/Quote';
import Quoted from './components/Quoted';
import Buy from './components/Buy';
import Sell from './components/Sell';
import Home from './components/Home';

function App() {
  const [alert, setAlert] = useState(null);

  const showAlert = (msg,type)=> {
    setAlert({
      message: msg,
      type: type
    })
    
    setTimeout(() => {
      setAlert(null)
    }, 1500);
  }

  return (
    <div>
      <Router>
        <Navbar />
        <Alert alert={alert}/>
        <div className="container">
          <Routes>
            <Route path="/" element = {<Home showAlert={showAlert}/>}/>
            <Route path="/quote" element = {<Quote showAlert={showAlert}/>}/>
            <Route path="/quoted" element = {<Quoted showAlert={showAlert}/>}/>
            <Route path="/buy" element = {<Buy showAlert={showAlert}/>}/>
            <Route path="/sell" element = {<Sell showAlert={showAlert}/>}/>
            <Route path="/history" element = {<History showAlert={showAlert}/>}/>
            <Route path="/leaderboard" element = {<Leaderboard showAlert={showAlert}/>}/>
            <Route path="/login" element = {<Login showAlert={showAlert}/>}/>
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
