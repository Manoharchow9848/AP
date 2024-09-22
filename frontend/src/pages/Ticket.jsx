import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import React from "react";
import { Alert, Button, Select, TextInput } from "flowbite-react";
import { app } from "../firebase";
import { useEffect, useState, useRef } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

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

  const initialFormData = {
    name: 'manu',
    email: '',
    district: '',
    mandal: '',
    department: '',
    phoneNumber: '',
    village: '',
    referredBy: '',
    referredName: '',
    problemDescription: '',
    problemDurationDays: '',
    problemType: '',
  };
  
  const formRef = useRef();
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
      const res = await fetch(
        `/api/leader/create-ticket?userId=${currentUser._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...formData }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setUpdateUserError(data.message);
        return;
      }

      if (res.ok) {
        setUpdateUserSuccess("Ticket Sent!");

        formRef.current.reset();
      
        // Also reset the state if you are managing some state variables
        setFormData(initialFormData);
        setSelectedDistrict("");
        setSelectedMandal("");
        setMandals([]);
       

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
        <Select
          id="department"
          value={formData.department}
          onChange={(event) => {
            setFormData({ ...formData, department: event.target.value });
          }}
        >
          <option value="">Choose Department</option>
          <option value="AYUSH Department">AYUSH Department</option>
          <option value="Agricultural Marketing Department">
            Agricultural Marketing Department
          </option>
          <option value="Agriculture Department">Agriculture Department</option>
          <option value="Animal Husbandry Department">
            Animal Husbandry Department
          </option>
          <option value="Backward Classes Welfare Department">
            Backward Classes Welfare Department
          </option>
          <option value="Co-operation Department">
            Co-operation Department
          </option>
          <option value="Commercial Taxes Department">
            Commercial Taxes Department
          </option>
          <option value="Consumer Affairs, Food and Civil Supplies Department">
            Consumer Affairs, Food and Civil Supplies Department
          </option>
          <option value="Department of Factories">
            Department of Factories
          </option>
          <option value="Department of Handlooms and Textiles">
            Department of Handlooms and Textiles
          </option>
          <option value="Department of Horticulture">
            Department of Horticulture
          </option>
          <option value="Department of Information and Public Relations">
            Department of Information and Public Relations
          </option>
          <option value="Department of Mines and Geology">
            Department of Mines and Geology
          </option>
          <option value="Department of Youth Services">
            Department of Youth Services
          </option>
          <option value="Finance Department">Finance Department</option>
          <option value="Fisheries Department">Fisheries Department</option>
          <option value="Forests Department">Forests Department</option>
          <option value="General Administration Department">
            General Administration Department
          </option>
          <option value="Health, Medical & Family Welfare Department">
            Health, Medical & Family Welfare Department
          </option>
          <option value="Higher Education Department">
            Higher Education Department
          </option>
          <option value="Industries and Commerce Department">
            Industries and Commerce Department
          </option>
          <option value="Information Technology, Electronics and Communications Department">
            Information Technology, Electronics and Communications Department
          </option>
          <option value="Labour, Employment Training and Factories Department">
            Labour, Employment Training and Factories Department
          </option>
          <option value="Law Department">Law Department</option>
          <option value="Legal Metrology Department">
            Legal Metrology Department
          </option>
          <option value="Planning Department">Planning Department</option>
          <option value="Portal of Tribal Welfare Department">
            Portal of Tribal Welfare Department
          </option>
          <option value="Public Enterprises Department">
            Public Enterprises Department
          </option>
          <option value="Revenue Department">Revenue Department</option>
          <option value="Roads and Buildings Department">
            Roads and Buildings Department
          </option>
          <option value="Rural Water Supply and Sanitation Department">
            Rural Water Supply and Sanitation Department
          </option>
          <option value="School Education Department">
            School Education Department
          </option>
          <option value="Social Welfare Department">
            Social Welfare Department
          </option>
          <option value="Tourism Department">Tourism Department</option>
          <option value="Water Resources Department">
            Water Resources Department
          </option>
          <option value="Women Development and Child Welfare Department">
            Women Development and Child Welfare Department
          </option>
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
          placeholder="village"
          onChange={handleChange}
        />
        <Select
          id="referredBy"
          value={formData.referredBy}
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
          value={formData.referredName}
          placeholder="referredName"
          onChange={handleChange}
        />

        <ReactQuill
          theme="snow"
          placeholder="Write Your Problem..."
          className="h-72 mb-12 dark:text-red-800"
          required
          value={formData.problemDescription}
          onChange={(value) => {
            setFormData({ ...formData, problemDescription: value });
          }}
        />
        <TextInput
          type="number"
          value={formData.problemDurationDays}
          id="problemDurationDays"
          placeholder="problemDurationDays"
          onChange={handleChange}
        />
        <Select
          id="problemType"
          value={formData.problemType}
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
          disabled={loading}
          className="mt-6"
        >
          {loading ? "Loading..." : "Add Ticket"}
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
