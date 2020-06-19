/* eslint-disable no-shadow */
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import dotenv from 'dotenv';
import './App.css';
import logs from './hng_logo-min.png';

dotenv.config();

const publics = process.env.REACT_APP_API_PUBLIC_KEY;
const secret = process.env.REACT_APP_API_SECOND_KEY;
Modal.setAppElement('#root');

const App = () => {
  const [name, setName] = useState('');
  const [provider, setProvider] = useState('');
  const [number, setNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [track, setTrack] = useState('');
  const [fullData, setFulldata] = useState([]);
  const [select, onSelect] = useState([]);
  const [check, setCheck] = useState(false);
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

  // data required for the wallet api
  const data2 = {
    Code: provider,
    Amount: amount.toLowerCase(),
    PhoneNumber: number,
    SecretKey: '',
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

  const data = JSON.stringify(data2);
  const bearer = 'Bearer ';

  // add intern / sent intern airtime
  const onFormSubmit =  () => {
    alert('yes')
     axios.post('https://hng-airtime-dev-server.herokuapp.com/addIntern', data1)
      .then((res) => {
        console.log(res, 'yes');
      })
      .catch((err) => {
        console.log(err,'no');
      });

//     axios.post('https://sandbox.wallets.africa/bills/airtime/purchase', data, {
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
  };

  // get interns
  useEffect(() => {
    axios.get('https://hng-airtime-dev-server.herokuapp.com/interns')
      .then((res) => {
        const { data } = res;
        setFulldata(data);
        const sorted = fullData.sort((a, b) => +new Date(a.date) - +new Date(b.date));
      })
      .catch((err) => {
        console.log('err', err);
      });
  }, []);

  const onSendAirtime = () => {
    axios.post('https://sandbox.wallets.africa/bills/airtime/purchase', data, {
      headers: {
        mode: 'no-cors',
        Authorization: bearer,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        const { data } = res;
        console.log(res);
        setSucces(true);
      })
      .catch((err) => {
        console.log(err);
        setError(true);
      });
  };

  const onSendBulk = () => {
    for (let i = 0; i < checks.length; i+=1) {
      axios.post('https://sandbox.wallets.africa/bills/airtime/purchase', data[i], {
        headers: {
          mode: 'no-cors',
          Authorization: bearer,
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          const { data } = res;
          console.log(res);
          setSucces(true);
        })
        .catch((err) => {
          console.log(err);
          setError(true);
        });
    }
  };

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
        setSucces(true);
      })
      .catch((err) => {
        console.log('err', err);
        setError(true);
      });
  };

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

      <div id="button">

        <button type="button" className="btn button my-5 mx-3" onClick={openModal}>Add Intern</button>
        <button type="button" className="btn button my-5 mx-3" onClick={onDelete}>Remove Interns</button>
        <button type="button" className="btn button my-5 mx-3" onClick={onDeleteAll}>Remove All</button>
        <button type="button" className="btn button my-5 mx-3" onClick={onSendBulk}>Send Bulk</button>

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
            <input type="text" className="form-control" value={amount} onChange={(e) => onChangeHandler(e, setAmount)} placeholder="Amount" />
          </div>
          <button type="button" onClick={onFormSubmit} className="btn btn-block button text-center">Send</button>
        </form>

        <button type="button" onClick={closeModal} className="btn btn-block button text-center my-3">Close</button>

      </Modal>

      {fullData.map(({
        name, number, provider, amount, _id,
      }) => (
        <div key={_id}>
          <div className="row">
            <div className="col-1">
              <input type="checkbox" autoComplete="off" />
            </div>
            <div className="col-3">
              <p>{name}</p>
            </div>
            <div className="col-2">
              <p>{number}</p>
            </div>
            <div className="col-3">
              <p>Frontend</p>
            </div>
            <div className="col-3">
              <button type="button" className="btn button" onClick={openModal}>Send Airtime</button>
            </div>
          </div>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default App;
