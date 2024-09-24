
import React, { useState, useEffect } from "react";
import { Button, Select, TextInput } from "flowbite-react";
import { Carousel } from 'react-responsive-carousel';
import { signoutSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import the carousel CSS

const Leader = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [mandals, setMandals] = useState([]);
  const [selectedMandal, setSelectedMandal] = useState("");
  const [leader, setLeader] = useState({});
  const [sidebarData, setSidebarData] = useState({
    district: "",
    mandal: "",
    searchTerm:""
  });

  useEffect(() => {
    // Fetch all districts when the component mounts
    fetch("/api/leader/dist")
      .then((response) => response.json())
      .then((data) =>{ 
        if(data.success===false)
          handleSignout();
        else
        setDistricts(data)})
      .catch((error) => console.error("Error fetching districts:", error));
  }, []);

  const handleDistrictChange = (event) => {
    const districtName = event.target.value;
    if (!districtName) {
      setSelectedDistrict("");
    } else {
      setSelectedDistrict(districtName);

      // Fetch mandals for the selected district
      fetch(`/api/leader/mand?district=${districtName}`)
        .then((response) => response.json())
        .then((data) => setMandals(data.mandals))
        .catch((error) => console.error("Error fetching mandals:", error));

      if (event.target.id === "district") {
        setSidebarData({ ...sidebarData, district: event.target.value });
      }
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `/api/leader/getlead?district=${sidebarData.district}&mandal=${sidebarData.mandal}&searchTerm=${sidebarData.searchTerm}`
      );
      if (res.ok) {
        const data = await res.json();
        setLeader(data[0]);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);        }
  };
  const handleChange = (e) => {
    if (e.target.id === 'searchTerm') {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }
   
  };

  const handleMandalChange = (e) => {
    const mandalName = e.target.value;
    setSelectedMandal(mandalName);
    if (e.target.id === "mandal") {
      setSidebarData({ ...sidebarData, mandal: e.target.value });
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="font-semibold">District:</label>
            <Select
              value={selectedDistrict}
              onChange={handleDistrictChange}
              id="district"
            >
              <option value="">Select a district</option>
              {districts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </Select>
           
          </div>
          
          <div className="flex items-center gap-2">
            <label className="font-semibold">mandal</label>
            <Select
              value={selectedMandal}
              onChange={handleMandalChange}
              disabled={mandals.length === 0}
              id="mandal"
            >
              <option value="">Select a mandal</option>
              {mandals.map((mandal) => (
                <option key={mandal} value={mandal}>
                  {mandal}
                </option>
              ))}
            </Select>
        
            
          </div>
          <div className='flex   items-center gap-2'>
            <label className='whitespace-nowrap font-semibold'>
               Leader Name:
            </label>
            <TextInput
              placeholder='Search...'
              id='searchTerm'
              type='text'
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <Button type="submit" outline gradientDuoTone="purpleToPink">
            Apply Filters
          </Button>
        </form>
      </div>
      <div className="w-full">
        <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5">
          Leader results:
        </h1>
       <div className="p-7 flex flex-wrap gap-4">
          {leader && leader._id ? (
            <div className="container mx-auto p-8">
              <div className="bg-white dark:bg-black shadow-lg rounded-lg overflow-hidden">
                <div className="bg-yellow-200 h-32"></div>
                <div className="flex justify-center -mt-16">
                  <img
                    src={leader.profilePicture}
                    alt={`${leader.name} profile`}
                    className="w-32 h-32 rounded-full border-4 border-white object-cover"
                  />
                </div>
                <div className="text-center px-6 py-4">
                  <h2 className="text-3xl font-bold text-gray-800">{leader.name}</h2>
                  <p className="text-gray-600 font-semibold mt-2">Party: {leader.partyName}</p>
                  <p className="text-gray-600 font-semibold mt-2">partyMembershipId: {leader.partyMembershipId}</p>
                </div>
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600"><span className="font-semibold">Father's Name:</span> {leader.fatherName}</p>
                      <p className="text-gray-600"><span className="font-semibold">Age:</span> {leader.age}</p>
                      <p className="text-gray-600"><span className="font-semibold">District:</span> {leader.district}</p>
                      <p className="text-gray-600"><span className="font-semibold">mandal:</span> {leader.mandal}</p>
                      <p className="text-gray-600"><span className="font-semibold">Village:</span> {leader.village}</p>
                    </div>
                    <div>
                      <p className="text-gray-600"><span className="font-semibold">Phone:</span> {leader.phoneNumber}</p>
                      <p className="text-gray-600"><span className="font-semibold">Email:</span> {leader.email}</p>
                      <p className="text-gray-600"><span className="font-semibold">Address:</span> {leader.address}</p>
                      <p className="text-gray-600"><span className="font-semibold">Qualification:</span> {leader.Qualification}</p>
                      <p className="text-gray-600"><span className="font-semibold">Designation:</span> {leader.designation}</p>
                    </div>
                  </div>
                </div>
               
              </div>
            </div>
          ) : (
            <p className="text-xl text-gray-500">No Leader found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leader;

