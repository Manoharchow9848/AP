import React from "react";

import {
  Alert,
  Button,
  Modal,
  ModalBody,
  TextInput,
  Select,
} from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { signoutSuccess } from '../redux/user/userSlice';

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import { app } from "../firebase";

import { useDispatch } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from "react-router-dom";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
const DashAddMla = () => {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
const dispatch = useDispatch();
  const [formData, setFormData] = useState({});
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedMandal, setSelectedMandal] = useState("");
  const [mandals, setMandals] = useState([]);
  const [partyName,setPartyName]=useState("");
  
  
  useEffect(() => {
    // Fetch all districts when the component mounts
    fetch("/api/districts")
      .then((response) => response.json())
      .then((data) => {
        if(data.success===false)
          handleSignout();
        else
        setDistricts(data)})
      .catch((error) => console.error("Error fetching districts:", error));
  }, []);

  const handleDistrictChange = (e) => {
    const districtName = e.target.value;
    if(!districtName){
       setSelectedMandal("")
    }else{
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setSelectedDistrict(districtName);

    // Fetch mandals for the selected district
    fetch(`/api/mandals?districtName=${districtName}`)
      .then((response) => response.json())
      .then((data) => setMandals(data.mandals))
      .catch((error) => console.error("Error fetching mandals:", error));
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
  const handleMandalChange = (e) => {
    setSelectedMandal(e.target.value)
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handlepartyChange = (e) => {
    setPartyName(e.target.value)
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const filePickerRef = useRef();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);
  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          "Could not upload image (File must be less than 2MB)"
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No changes made");
      return;
    }
    if (imageFileUploading) {
      setUpdateUserError("Please wait for image to upload");
      return;
    }
    try {
      const res = await fetch(`/api/mla/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setUpdateUserError(data.message);
      } else {
        setUpdateUserSuccess("MLA Added");
      }
    } catch (error) {
      setUpdateUserError(error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Add Mla's</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${
                    imageFileUploadProgress / 100
                  })`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl}
            alt="Add mla photo"
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              "opacity-60"
            }`}
          />
        </div>
        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}
        <TextInput
          type="text"
          id="name"
          placeholder="name"
          onChange={handleChange}
        />
        <TextInput
          type="text"
          id="fatherName"
          placeholder="Enter Father Name"
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email" 
          placeholder="Enter Email"
          onChange={handleChange}
        />
        <Select
          value={partyName}
          onChange={handlepartyChange}
          id="partyName"
        >
          <option value="">Select PartyName</option>
         
             
              <option value='TDP'>TDP</option>
              <option value='JSP'>JSP</option>
              <option value='BJP'>BJP</option>
              <option value='INC'>INC</option>
              <option value='YCP'>YCP</option>
              <option value='OTHERS'>OTHERS</option>
             
         
        </Select>
        <TextInput
          type="number"
          id="age"
          placeholder="Enter Age"
          onChange={handleChange}
        />
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
        <Select
          value={selectedMandal}
          onChange={handleMandalChange}
          disabled={ mandals.length==0 }
          id="constituencies"
        >
          <option value="">Select a ASSEMBLY</option>
          {mandals.map((mandal) => (
            <option key={mandal} value={mandal}>
              {mandal}
            </option>
          ))}
        </Select>
        <TextInput
          type="number"
          id="phoneNumber"
          placeholder="Enter PhoneNumber"
          onChange={handleChange}
        />
        <TextInput
          type="text"
          id="address"
          placeholder="Enter Address"
          onChange={handleChange}
        />
         <TextInput
          type="text"
          id="Qualification"
          placeholder="Enter Qualification"
          onChange={handleChange}
        />

        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          outline
          disabled={loading || imageFileUploading}
        >
          {loading ? "Loading..." : "Add"}
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
};

export default DashAddMla;
