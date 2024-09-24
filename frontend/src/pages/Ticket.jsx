import React, { useEffect, useState, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Alert, Button, Select, TextInput } from "flowbite-react";
import { app } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useDispatch } from 'react-redux';
import { signoutSuccess } from '../redux/user/userSlice';
export default function Ticket() {
  const navigate = useNavigate();
  const { currentUser, loading } = useSelector((state) => state.user);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false); // To control dropdown visibility
  const dropdownRef = useRef(); // To detect clicks outside the dropdown
  const dispatch = useDispatch();
  const initialFormData = {
    name: "",
    email: "",
    district: "",
    mandal: "",
    department: [],
    phoneNumber: "",
    village: "",
    referredBy: "",
    referredName: "",
    problemDescription: "",
    problemDurationDays: "",
    problemType: "",
    documentUrl: "",
  };

  const [attachedFile, setAttachedFile] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedMandal, setSelectedMandal] = useState("");
  const [mandals, setMandals] = useState([]);
  const formRef = useRef();

  const departments = [
    "AYUSH Department",
"Agricultural Marketing Department",
"Agriculture Department",
"Animal Husbandry Department",
"Backward Classes Welfare Department",
"Co-operation Department",
"Commercial Taxes Department",
"Consumer Affairs, Food and Civil Supplies Department",
"Department of Factories",
"Department of Handlooms and Textiles",
"Department of Horticulture",
"Department of Information and Public Relations",
"Department of Mines and Geology",
"Department of Youth Services",
"Finance Department",
"Fisheries Department",
"Forests Department",
"General Administration Department",
"Health, Medical & Family Welfare Department",
"Higher Education Department",
"Industries and Commerce Department",
"Information Technology, Electronics and Communications Department",
"Labour, Employment Training and Factories Department",
"Law Department",
"Legal Metrology Department",
"Planning Department",
"Portal of Tribal Welfare Department",
"Public Enterprises Department",
"Revenue Department",
"Roads and Buildings Department",
"Rural Water Supply and Sanitation Department",
"School Education Department",
"Social Welfare Department",
"Tourism Department",
"Water Resources Department",
"Women Development and Child Welfare Department"

    
  ];

  // Handle Checkbox change
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    const updatedDepartments = checked
      ? [...selectedDepartments, value]
      : selectedDepartments.filter((dept) => dept !== value);

    setSelectedDepartments(updatedDepartments);
    setFormData({ ...formData, department: updatedDepartments });
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

  // Fetch districts on component mount
  useEffect(() => {
    fetch("/api/leader/dist")
      .then((response) => response.json())
      .then((data) => {
        if(data.success===false)
          handleSignout();
        else
        setDistricts(data)})
      .catch((error) => console.error("Error fetching districts:", error));
  }, []);

  // Handle district change
  const handleDistrictChange = (e) => {
    const districtName = e.target.value;
    setFormData({ ...formData, district: districtName });
    setSelectedDistrict(districtName);

    fetch(`/api/leader/mand?district=${districtName}`)
      .then((response) => response.json())
      .then((data) => setMandals(data.mandals))
      .catch((error) => console.error("Error fetching mandals:", error));
  };

  // Handle mandal change
  const handleMandalChange = (e) => {
    const mandalName = e.target.value;
    setFormData({ ...formData, mandal: mandalName });
    setSelectedMandal(mandalName);
  };

  // Handle general form input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  // Handle file attachment
  const handleFileChange = (e) => {
    setAttachedFile(e.target.files[0]);
  };

  // Upload document to Firebase and return the URL
  const handleUploadDocument = async () => {
    if (!attachedFile) return null;

    const storage = getStorage(app);
    const storageRef = ref(storage, `documents/${attachedFile.name}`);

    try {
      await uploadBytes(storageRef, attachedFile);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading file:", error);
      return null;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Upload document and get the URL
    const documentlink = await handleUploadDocument();

    // If there's a document link, update formData with it before submitting
    const updatedFormData = { ...formData, documentUrl: documentlink };

    try {
      const res = await fetch(
        `/api/leader/create-ticket?userId=${currentUser._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFormData),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        setUpdateUserError(data.message);
        return;
      }

      setUpdateUserSuccess("Ticket Sent!");
      formRef.current.reset();
      setFormData(initialFormData);
      setSelectedDistrict("");
      setSelectedMandal("");
      setMandals([]);
    } catch (error) {
      console.log(error.message);
    }
  };

  // Handle click outside dropdown to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Raise Ticket</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" ref={formRef}>
        <TextInput
          value={formData.name}
          type="text"
          id="name"
          placeholder="Name"
          onChange={handleChange}
        />
        <TextInput
          type="email"
          value={formData.email}
          id="email"
          placeholder="Enter Email"
          onChange={handleChange}
        />
        <Select value={selectedDistrict} onChange={handleDistrictChange} id="district">
          <option value="">Select a District</option>
          {districts.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </Select>
        <Select value={selectedMandal} onChange={handleMandalChange} disabled={mandals.length === 0} id="mandal">
          <option value="">Select a Mandal</option>
          {mandals.map((mandal) => (
            <option key={mandal} value={mandal}>
              {mandal}
            </option>
          ))}
        </Select>

       

        <TextInput
          type="number"
          value={formData.phoneNumber}
          id="phoneNumber"
          placeholder="Phone Number"
          onChange={handleChange}
        />
        <TextInput
          type="text"
          id="village"
          value={formData.village}
          placeholder="Village"
          onChange={handleChange}
        />
         {/* Department Dropdown */}
         <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            className="w-full p-2 border border-gray-300 rounded"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {selectedDepartments.length > 0 ? selectedDepartments.join(", ") : "Select Departments"}
          </button>
          {dropdownOpen && (
            <div className="absolute z-10 w-full dark:bg-black bg-gray-100  shadow-md max-h-56 overflow-auto border  rounded mt-2">
              {departments.map((depart, index) => (
                <label key={index} className="block px-4 py-2">
                  <input
                    type="checkbox"
                    value={depart}
                    checked={selectedDepartments.includes(depart)}
                    onChange={handleCheckboxChange}
                    className="mr-2"
                  />
                  {depart}
                </label>
              ))}
            </div>
          )}
        </div>
        <Select id="referredBy" value={formData.referredBy} onChange={handleChange}>
          <option value="">Choose Referred By</option>
          <option value="village">Village</option>
          <option value="mandal">Mandal</option>
          <option value="self">Self</option>
        </Select>
        <TextInput
          type="text"
          id="referredName"
          value={formData.referredName}
          placeholder="Referred Name"
          onChange={handleChange}
        />
        <ReactQuill 
          theme="snow"
          placeholder="Write Your Problem..."
          className="w-full h-36  dark:text-white"
          value={formData.problemDescription}
          onChange={(value) => setFormData({ ...formData, problemDescription: value })}
        />
        <TextInput className="mt-12"
          type="number"
          id="problemDurationDays"
          value={formData.problemDurationDays}
          placeholder="How many days has this problem existed?"
          onChange={handleChange}
        />
        <Select id="problemType" value={formData.problemType} onChange={handleChange}>
          <option value="">Select Problem Type</option>
          <option value="self">Self</option>
          <option value="social service">Social Service</option>
        </Select>
        <TextInput type="file" accept="application/pdf, image/*" onChange={handleFileChange} />
        <Button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </Button>

        {updateUserSuccess && (
          <Alert color="success" className="text-center">
            {updateUserSuccess}
          </Alert>
        )}
        {updateUserError && (
          <Alert color="failure" className="text-center">
            {updateUserError}
          </Alert>
        )}
      </form>
    </div>
  );
}
