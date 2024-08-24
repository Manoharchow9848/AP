import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import React from 'react'
import { Alert, Button, Select, TextInput, } from 'flowbite-react';
import { app } from '../firebase';
import { useEffect, useState, useRef } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Ticket() {
  const navigate = useNavigate();
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [formData, setFormData] = useState({});
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedMandal, setSelectedMandal] = useState("");
  const [mandals, setMandals] = useState([]);
  
console.log(formData);

 

  useEffect(() => {
    // Fetch all districts when the component mounts
    fetch("/api/leader/dist")
      .then((response) => response.json())
      .then((data) => setDistricts(data))
      .catch((error) => console.error("Error fetching districts:", error));
  }, []);

 


  const handleDistrictChange = (e) => {
    const districtName = e.target.value;
    setFormData({ ...formData, district: districtName });
    setSelectedDistrict(districtName);

    fetch(`/api/leader/mand?district=${districtName}`)
      .then((response) => response.json())
      .then((data) => setMandals(data.mandals))
      .catch((error) => console.error("Error fetching mandals:", error));
  };

  const handleMandalChange = (e) => {
    setSelectedMandal(e.target.value);
    setFormData({ ...formData, mandal: e.target.value });
  };

  

 


  

 



  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

 

  

 

  

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      
      const res = await fetch(`/api/leader/create-ticket?userId=${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, }),
      });
      const data = await res.json();
      if (!res.ok) {
        setUpdateUserError(data.message);
        return;
      }

      if (res.ok) {
        setUpdateUserSuccess("Leader Added successfully!");
       
       
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Raise Ticket</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
       
       
        <TextInput
          type="text"
          id="name"
          placeholder="Name"
          onChange={handleChange}
          
        />
        <TextInput
          type="email"
          id="email"
          placeholder="Enter Email"
          onChange={handleChange}
        
        />
        
        
        <Select
          value={selectedDistrict}
          onChange={handleDistrictChange}
          id="district"
        >
          <option value="">Select a District</option>
          {districts.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </Select>
        <Select
          value={selectedMandal}
          onChange={handleMandalChange}
          disabled={mandals.length === 0}
          id="mandal"
        >
          <option value="">Select a Mandal</option>
          {mandals.map((mandal) => (
            <option key={mandal} value={mandal}>
              {mandal}
            </option>
          ))}
        </Select>
        <TextInput
          type="number"
          id="phoneNumber"
          placeholder="Phone Number"
          onChange={handleChange}
          
        />
       
         <TextInput
          type="text"
          id="village"
          placeholder="village"
          onChange={handleChange}
         
        />
         <Select
          
          
          id="referredBy"
          onChange={(event) => {
            setFormData({ ...formData, referredBy: event.target.value });
          }}
        >
          <option value="">Choose referredBy</option>
          <option value="village">village</option>
          <option value="mandal">mandal</option>
          <option value="self">self</option>
        
        </Select>
        <TextInput
          type="text"
          id="referredName"
          placeholder="referredName"
          onChange={handleChange}
          
        />
        
        <ReactQuill
          theme='snow'
          placeholder='Write Your Problem...'
          className='h-72 mb-12 dark:text-red-800'
          required
          onChange={(value) => {
            setFormData({ ...formData, problemDescription: value });
          }}
        />
        <TextInput
          type="number"
          id="problemDurationDays"
          placeholder="problemDurationDays"
          onChange={handleChange}
          
        />
         <Select
          
          
          id="problemType"
          onChange={(event) => {
            setFormData({ ...formData, problemType: event.target.value });
          }}
        >
          <option value="">Select problemType</option>
          <option value="self">self</option>
          <option value="social service">social service</option>
          
        
        </Select>
         
        
      
       
       
        
        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          outline
          disabled={loading  }
          className="mt-6"
        >
          {loading ? 'Loading...' : 'Add Ticket'}
        </Button>
      </form>
      {updateUserSuccess && (
        <Alert color="success" className="mt-5">
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color="failure" className="mt-5">
          {updateUserError}
        </Alert>
      )}
    </div>
  );
}

