import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios'
import './App.css';
import logs from './hng_logo-min.png'

Modal.setAppElement("#root")

const App = () => {
const [name, setName] = useState('')
const [provider, setProvider] = useState('')
const [number, setNumber] = useState('')
const [amount, setAmount] = useState('')
const [fullData, setFulldata] = useState([])
const [succes, setSucces] = useState(false)
const [error, setError] = useState(false)
const [isOpen, setIsOpen] = useState(false)

const data1 = {
  name,
  provider,
  number,
  amount
}

const openModal = () => {
  setIsOpen(true)
}

const closeModal = () => {
  setIsOpen(false)
}

const data2 = {
  Code: provider,
  Amount: amount,
  PhoneNumber: number,
  SecretKey: ""
}

const data = JSON.stringify(data2)
var bearer = 'Bearer ';

const onChangeHandler = (event, handler) => {
  const { value } = event.target;
  handler(value);
};

// add intern
const onFormSubmit = (e) => {
  e.preventDefault();
axios.post('http://localhost:4000/addIntern', data1)
.then((res) => {
  console.log(res)
})
.catch((err) => {
  console.log(err)
})
}

// get interns
useEffect(() => {
  axios.get('http://localhost:4000/getIntern')
  .then((res) => {
    const { data } = res
    console.log(data, 'full')
    setFulldata(data)
  })
  .catch((err) => {
    console.log('err', err )
  })
}, [])

const onSendAirtime = () => {
  axios.post('https://sandbox.wallets.africa/bills/airtime/purchase', data, {
    headers: {
      mode: 'no-cors',
      'Authorization': bearer,
      'Content-Type': 'application/json'
    }
  })
  .then((res) => {
    const { data } = res;
    console.log(res)
  })
  .catch((err) => {
    console.log(err)
  })
}
 

  return (
    <div className="App">
    <nav id="idea" className="navbar navbar-expand-lg fixed-top">
      <div className="container">
          <div className="navbar-header">
              <img src={logs} alt='logo' className='logo'/>
          </div>
      </div> 
    </nav>
    
      <button className="btn button" onClick={openModal} >Add Intern</button>
 
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel="Intern Modal"
        className="Modal"
        overlayClassName="Overlay"
      >
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
            <button className='btn button text-center'>Save</button>
        </form>

      <button onClick={closeModal} className="btn button text-center my-3" >Close</button>

      </Modal>

      
    {fullData.map(({name, number, provider, amount}) => (
      <div className='table'>
 <div className='sub-table'>
    <p>{name}</p>
    <p>{number}</p>
    <p>Frontend</p>
 <button className='btn button' onClick={onSendAirtime}>Send</button>
 <button className='btn button' onClick={openModal}>Edit Intern</button>
 </div>
 <hr/>
 </div>
))}
        








    </div>
  );
}

export default App;
