/* eslint-disable no-shadow */
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import dotenv from 'dotenv';
import './App.css';
import logs from './hng_logo-min.png';

dotenv.config();

const publics = process.env.REACT_APP_API_PUBLIC_KEYS;
const secret = process.env.REACT_APP_API_SECOND_KEYS;



Modal.setAppElement('#root');

const App = () => {
  const [name, setName] = useState('');
  const [provider, setProvider] = useState('');
  const [number, setNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [track, setTrack] = useState('');
  const [fullData, setFulldata] = useState([]);

  const [success, setSucces] = useState(false);
  const [error, setError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const checks = '';
  const id = '';

  // Data required for the backend
  const data1 = {
    name,
    provider,
    number,
    amount,
    track,
  };

  const openModal = () => {
    setIsOpen(true);
    setFulldata(fullData);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const onChangeHandler = (event, handler) => {
    const { value } = event.target;
    handler(value);
  };

  
  // add intern / sent intern airtime
  const onFormSubmit = () => { 
   axios.post('https://hng-airtime-dev-server.herokuapp.com/addIntern', data1)
      .then((res) => (res))
      .catch((err) => {
        console.log(err,'no');
      });
  };

  // get interns
  useEffect(() => {
    axios.get('https://hng-airtime-dev-server.herokuapp.com/interns')
      .then((res) => {
        const { data } = res;
        const sorted = data.sort((a, b) => +new Date(b.date) - +new Date(a.date));
        setFulldata(sorted);
      })
      .catch((err) => {
        console.log('err', err);
      });
  }, [fullData]);

  const onSendAirtime = (b, c, d) => {
      const data2 = {
        Code: c.toLowerCase(),
        Amount: d,
        PhoneNumber: b,
        SecretKey: secret,
        bearer: `Bearer ${publics}`
    };
  
    axios.post('https://hng-airtime-dev-server.herokuapp.com/wallet-api', data2, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
    })
      .then((res) => {
        const { data } = res;
        console.log(res.data);
        setSucces(true);
        alert(data.message)
      })
      .catch((err) => {
        console.log(err);
        setError(true);
      });
  }; 

  // const onSendBulk = (b, c, d) => {
  //    // data required for the wallet api
  //     const data2 = {
  //       Code: c.toLowerCase(),
  //       Amount: d,
  //       PhoneNumber: b,
  //       SecretKey: secret,
  //   };
  //   const data = JSON.stringify(data2);
  //   const bearer = `Bearer ${publics}`;
  //     console.log('data', data2, bearer)
  //   for (let i = 0; i < checks.length; i+=1) {
  //     axios.post('https://api.wallets.africa/bills/airtime/purchase', data[i], {
  //       headers: {
  //         mode: 'no-cors',
  //         Authorization: bearer,
  //         'Content-Type': 'application/json',
  //       },
  //     })
  //       .then((res) => {
  //         const { data } = res;
  //         console.log(res);
  //         setSucces(true);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         setError(true);
  //       });
  //   }
  // };

  const onDelete = () => {
    for (let i = 0; i < checks.length; i += 1) {
      axios.delete(`https://hng-airtime-dev-server.herokuapp.com/removeInterns/${id[i]}`)
        .then((res) => {
          const { data } = res;
          console.log(data);
        })
        .catch((err) => {
          console.log('err', err);
        });
    }
  };

  const onDeleteAll = () => {
    axios.delete('https://hng-airtime-dev-server.herokuapp.com/removeAllInterns')
      .then((res) => {
        const { data } = res;
        console.log(data);
      })
      .catch((err) => {
        console.log('err', err);
      });
  };

  // const onList = (a, b, c, d) => {
  //   const data = {
  //     a, b, c, d
  //   }
  //   if(check) {
  //     setCheck(false)
  //   } else if (!check){
  //     setCheck(true)
  //     // setChecked([...checked, data])
  //     console.log(a, b, c, d, 'aa')
  //   }
  // }

  return (
    <div className="App">
      <nav id="idea" className="navbar navbar-expand-lg">
        <div className="container">
          <div className="navbar-header">
            <img src={logs} alt="logo" className="logo" />
          </div>
        </div>
      </nav>
      <h2 className="pt-5">Purchasing of Airtime Made Easy</h2>
    {success ? <p className='text-center'>You have successfully sent airtime</p> : null}
    {error ? <p className='text-center'>You do not have enough balance for this transaction</p> : null}

      <div id="button" className='row my-3 container'>
        <button type="button" className="btn col-6 col-md-3 button my-2 my-lg-5" onClick={openModal}>Add Intern</button>
        <button type="button" className="btn col-6 col-md-3 button my-2 my-lg-5" onClick={onDelete}>Remove Interns</button>
        <button type="button" className="btn col-6 col-md-3 button my-2 my-lg-5" onClick={onDeleteAll}>Remove All</button>
        <button type="button" className="btn col-6 col-md-3 button my-2 my-lg-5">Send Bulk</button>
      </div>

      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel="Intern Modal"
        className="Modal"
        overlayClassName="Overlay"
      >
        <form onSubmit={onFormSubmit}>
          <div className="form-group">
            <input type="text" className="form-control" value={name} onChange={(e) => onChangeHandler(e, setName)} placeholder="Intern's Name" />
          </div>
          <div className="form-group">
            <input type="text" className="form-control" value={track} onChange={(e) => onChangeHandler(e, setTrack)} placeholder="Intern's Track" />
          </div>
          <div className="form-group">
            <input type="text" className="form-control" value={provider} onChange={(e) => onChangeHandler(e, setProvider)} placeholder="Network Provider" />
          </div>
          <div className="form-group">
            <input type="text" className="form-control" value={number} onChange={(e) => onChangeHandler(e, setNumber)} placeholder="Phone Number" />
          </div>
          <div className="form-group">
            <input type="text" className="form-control" value={amount} onChange={(e) => onChangeHandler(e, setAmount)} placeholder="Amount in naira" />
          </div>
          <button type="button" onClick={onFormSubmit} className="btn btn-block button text-center">Save</button>
        </form>

        <button type="button" onClick={closeModal} className="btn btn-block button text-center my-3">Close</button>

      </Modal>


  <table className="table">
  <thead>
    <tr>
      <th scope="col">Select</th>
      <th scope="col">Name</th>
      <th scope="col">Track</th>
      <th scope="col">Phone No</th>
      <th scope="col">Action</th>
    </tr>
  </thead>
  <tbody>
  {fullData.map(({name, number, provider, amount, _id, track}) => (
    <tr key={_id}>
    <td><input type="checkbox" autoComplete="off"/></td>
    <td>{name}</td>
    <td>{track}</td>
    <td>{number}</td>
    <td> <button type="button" className="btn button" onClick={() => onSendAirtime(number, provider, amount)}>Send Airtime</button></td>

    </tr>
    ))}
  </tbody>
</table>

    </div>
  );
};

export default App;
