import React, { useState, useEffect } from "react";
import { Button, Select, TextInput } from "flowbite-react";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import the carousel CSS
import { signoutSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
const LocateMla = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [mandals, setMandals] = useState([]);
  const [selectedMandal, setSelectedMandal] = useState("");
  const [mla, setMla] = useState({});
  const [sidebarData, setSidebarData] = useState({
    district: "",
    constituencies: "",
  });

  useEffect(() => {
    // Fetch all districts when the component mounts
    fetch("/api/districts")
      .then((response) => response.json())
      .then((data) => {
        if(data.success===false)
          handleSignout();
        else setDistricts(data) 
      })
      .catch((error) => {
        
          
      
      });
  }, []);
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
  const handleDistrictChange = (event) => {
    const districtName = event.target.value;
    if (!districtName) {
      setSelectedDistrict("");
    } else {
      setSelectedDistrict(districtName);

      // Fetch mandals for the selected district
      fetch(`/api/mandals?districtName=${districtName}`)
        .then((response) => response.json())
        .then((data) => setMandals(data.mandals))
        .catch((error) => {
         
          console.error("Error fetching mandals:", error)
        });

      if (event.target.id === "district") {
        setSidebarData({ ...sidebarData, district: event.target.value });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `/api/mla/getmla?district=${sidebarData.district}&constituencies=${sidebarData.constituencies}`
      );
      if (res.ok) {
        const data = await res.json();
        setMla(data[0]);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleMandalChange = (e) => {
    const mandalName = e.target.value;
    setSelectedMandal(mandalName);
    if (e.target.id === "constituencies") {
      setSidebarData({ ...sidebarData, constituencies: e.target.value });
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="font-semibold">Parliament:</label>
            <Select
              value={selectedDistrict}
              onChange={handleDistrictChange}
              id="district"
            >
              <option value="">Select a Parliament</option>
              {districts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">ASSEMBLY:</label>
            <Select
              value={selectedMandal}
              onChange={handleMandalChange}
              disabled={mandals.length === 0}
              id="constituencies"
            >
              <option value="">Select a ASSEMBLY
              </option>
              {mandals.map((mandal) => (
                <option key={mandal} value={mandal}>
                  {mandal}
                </option>
              ))}
            </Select>
          </div>
          <Button type="submit" outline gradientDuoTone="purpleToPink">
            Apply Filters
          </Button>
        </form>
      </div>
      <div className="w-full">
        <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5">
          MLA results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {mla && mla._id ? (
            <div className="container mx-auto p-8">
              <div className="bg-white dark:bg-black shadow-lg rounded-lg overflow-hidden">
                <div className="bg-yellow-500 h-32"></div>
                <div className="flex justify-center -mt-16">
                  <img
                    src={mla.profilePicture}
                    alt={`${mla.name} profile`}
                    className="w-32 h-32 rounded-full border-4 border-white object-cover"
                  />
                </div>
                <div className="text-center px-6 py-4">
                  <h2 className="text-3xl font-semibold dark:text-white text-gray-800">{mla.name}</h2>
                  <p className="text-gray-600 font-semibold mt-2">Party: {mla.partyName}</p>
                </div>
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600"><span className="font-semibold">Father's Name:</span> {mla.fatherName}</p>
                      <p className="text-gray-600"><span className="font-semibold">Age:</span> {mla.age}</p>
                      <p className="text-gray-600"><span className="font-semibold">District:</span> {mla.district}</p>
                      <p className="text-gray-600"><span className="font-semibold">Constituency:</span> {mla.constituencies}</p>
                    </div>
                    <div>
                      <p className="text-gray-600"><span className="font-semibold">Phone:</span> {mla.phoneNumber}</p>
                      <p className="text-gray-600"><span className="font-semibold">Email:</span> {mla.email}</p>
                      <p className="text-gray-600"><span className="font-semibold">Address:</span> {mla.address}</p>
                      <p className="text-gray-600"><span className="font-semibold">Qualification:</span> {mla.Qualification}</p>
                    </div>
                  </div>
                </div>
                {mla.services && mla.services.length > 0 && (
                  <div className="p-6 border-t border-gray-200 ">
                    <h3 className="text-xl font-semibold mb-4">Services</h3>
                    <Carousel>
                      {mla.services.map((service, index) => (
                        <div className="relative w-full h-full overflow-hidden">
                        <img
                          src={service.image}
                          alt={`Service ${index}`}
                          className="w-full h-full object-cover"
                        />
                        <p className="absolute bottom-0 bg-opacity-60 bg-black text-white p-2 w-full text-center">
                          {service.description}
                        </p>
                      </div>
                      ))}
                    </Carousel>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-xl text-gray-500">No MLA found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocateMla;
