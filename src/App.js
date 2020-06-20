import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import './App.css';
import logs from './assets/hng_logo-min.png';
import edit from './assets/edit-alt-regular-24.png'
import del from './assets/trash-regular-24.png'
import check from './assets/check-regular-24.png'
import cancel from './assets/x-regular-24.png'


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
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editedId, setEditedId] = useState('')
  

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

  const openEditModal = (a) => {
    setIsEditOpen(true);
    setEditedId(a)
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
  };

  const onChangeHandler = (event, handler) => {
    const { value } = event.target;
    handler(value);
  };

  
  // add intern / sent intern airtime
  const onFormSubmit = () => { 
   axios.post('https://hng-airtime-dev-server.herokuapp.com/addIntern', data1)
      .then((res) => (res))
      .catch((err) => err);
      setAmount('')
      setName('')
      setNumber('')
      setTrack('')
  };

  const onFormEditSubmit = () => { 
    axios.post(`https://hng-airtime-dev-server.herokuapp.com/edit/intern/${editedId}`, data1)
       .then((res) => (res))
       .catch((err) => {
         console.log(err,'no');
       });
       setAmount('')
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
  }, []);

  const onSendAirtime = (b, c, d) => {
      const data2 = {
        Code: c.toLowerCase(),
        Amount: d,
        PhoneNumber: b,
    };
     console.log('got here')
    
    axios.post('https://hng-airtime-dev-server.herokuapp.com/wallet-api', data2, {
      // axios.post('http://localhost:5000/wallet-api', data2, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
    })
      .then((res) => {
        console.log('response in then--->>', res)
        const { data } = res;
        alert(data.message)
      })
      .catch((err) => {
        console.log('error--->>>', err)
        throw err
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

  const onDelete = (a) => {
      axios.delete(`https://hng-airtime-dev-server.herokuapp.com/removeInterns/${a}`)
        .then((res) => res)
        .catch((err) => err);
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
      <div id="button" className=' row my-3'>
        <button type="button" className="btn btn-block col-12 col-md-3 button mx-auto my-2 my-lg-5" onClick={openModal}>Add Intern</button>
        <button type="button" className="btn btn-block col-12 col-md-3 button mx-auto my-2 my-lg-5" onClick={onDeleteAll}>Remove All</button>
      </div>

      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel="Intern Modal"
        className="Modal"
        overlayClassName="Overlay"
      >
        <form onSubmit={onFormSubmit}>
        <button type="button" onClick={closeModal} className="button text-center mb-3"><img src={cancel} alt='close' className='del' /></button>
          <div className="form-group">
            <input type="text" className="form-control" value={name} onChange={(e) => onChangeHandler(e, setName)} placeholder="Intern's Name" required />
          </div>
          <div className="form-group">
            <input type="text" className="form-control" value={track} onChange={(e) => onChangeHandler(e, setTrack)} required placeholder="Intern's Track" />
          </div>
          <div className="form-group">
            <input type="text" className="form-control" value={provider} onChange={(e) => onChangeHandler(e, setProvider)} required placeholder="Network Provider" />
          </div>
          <div className="form-group">
            <input type="text" className="form-control" value={number} onChange={(e) => onChangeHandler(e, setNumber)} required placeholder="Phone Number" />
          </div>
          <div className="form-group">
            <input type="text" className="form-control" value={amount} onChange={(e) => onChangeHandler(e, setAmount)} required placeholder="Amount in naira" />
          </div>
          <button type="button" onClick={onFormSubmit} className="btn btn-block button text-center">Save</button>
        </form>


      </Modal>

      <Modal
        isOpen={isEditOpen}
        onRequestClose={closeModal}
        contentLabel="Intern Amount Modal"
        className="EditModal"
        overlayClassName="Overlay"
      >
        <form onSubmit={onFormEditSubmit}>
        <button type="button" onClick={closeEditModal} className="button text-center mr-auto mb-3"><img src={cancel} alt='close' className='del' /></button>

          <div className="form-group">
            <input type="text" className="form-control" value={amount} onChange={(e) => onChangeHandler(e, setAmount)} required placeholder="Amount in naira" />
          </div>
          <button type="button" onClick={onFormEditSubmit} className="btn btn-block button text-center">Save</button>
        </form>

      </Modal>

  <table className="table">
  <thead>
    <tr>
      <th scope="col">Name</th>
      <th scope="col">Track</th>
      <th scope="col">Phone No</th>
      <th scope="col">Amount</th>
      <th scope="col">Send</th>
      <th scope="col">Delete</th>

    </tr>
  </thead>
  <tbody>
  {fullData.map(({name, number, provider, amount, _id, track}) => (
    <tr key={_id}>  
    <td>{name}</td>
    <td>{track}</td>
    <td>{number}</td>
    <td>{amount} <img src={edit} alt='Edit' onClick={() => openEditModal(_id)} className='edit'/></td>
    <td> 
      <button type="button" className="button" onClick={() => onSendAirtime(number, provider, amount)}>
      <img src={check} alt='check' className='del' />


      </button>
    
      </td>
      <td> 
      <button type="button" className="button"  onClick={() => onDelete(_id)}>
      <img src={del} alt='del' className='del' />


      </button>

        
      </td>

    </tr>
    ))}
  </tbody>
</table>

    </div>
  );
};

export default App;

{/* <button type="button" className="btn btn-block col-12 col-md-3 button mx-auto my-2 my-lg-5">Send Bulk</button> */}

