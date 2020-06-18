import React, { useState, useEffect } from 'react';
import './App.css';
import logs from './hnglogo.png'

const App = () => {
const [name, setName] = useState('')
const [provider, setProvider] = useState('')
const [number, setNumber] = useState('')
const [amount, setAmount] = useState('')
const [succes, setSucces] = useState(false)
const [error, setError] = useState(false)


const data = {
  name,
  provider,
  number,
  amount
}

const dat2 = {
  Code: provider,
  Amount: amount,
  PhoneNumber: number,
  SecretKey: "f621ppa5evgc"
}

const dat = JSON.stringify(dat2)
var bearer = 'Bearer 56trmoh8rprl';

const onChangeHandler = (event, handler) => {
  const { value } = event.target;
  handler(value);
};

const onFormSubmit = (e) => {
  e.preventDefault();
  console.log(data)

fetch('https://api.wallets.africa/bills/airtime/purchase', {
      mode: 'no-cors',
              method: 'POST',
              body: dat,
              headers: {
                  'Authorization': bearer,
                  'Content-Type': 'application/json'
                },
          }).then(datum => {
              console.log('data-->>>', datum)
              setError(true)
          }).catch(error => {
              console.log('error ---->>>', error)
              setError(true)
          })
  };
 

  return (
    <div className="App">
    <nav id="idea" className="navbar navbar-expand-lg fixed-top">
      <div className="container">
          <div className="navbar-header">
              <img src={logs} alt='logo' className='logo'/>
          </div>
      </div> 
    </nav>
      <form onSubmit={onFormSubmit}>
      <div className="form-group">
      <input type='text' className="form-control" value={name} onChange={(e) => onChangeHandler(e, setName)} placeholder="Intern Name"/>
      </div>
      <div className="form-group">
      <input type='text' className="form-control" value={provider} onChange={(e) => onChangeHandler(e, setProvider)} placeholder="Network Provider"/>
      </div>
      <div className="form-group">
      <input type='text' className="form-control" value={number} onChange={(e) => onChangeHandler(e, setNumber)} placeholder="Phone Number" />
      </div>
      <div className="form-group">
      <input type='text' className="form-control" value={amount} onChange={(e) => onChangeHandler(e, setAmount)} placeholder="Amount" />
      </div>
      <button className='btn button'>Send Airtime</button>
      </form>

      <button className='btn button my-5'>Add Intern</button>

      <div className='table'>

          <div className='sub-table'>
          <p>Ade</p>
          <button className='btn button'>Send</button>
          </div>
          <hr/>
          <div className='sub-table'>
          <p>Ade</p>
          <button className='btn button'>Send</button>
          </div>
          <hr/>
          <div className='sub-table'>
          <p>Ade</p>
          <button className='btn button'>Send</button>
          </div>
          <hr/>




</div>



    </div>
  );
}

export default App;
