import React from 'react'
import { Alert, Button, FileInput, Select, TextInput,Label } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useEffect, useState, useRef } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function UpdateLead() {
  const navigate = useNavigate();
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [formData, setFormData] = useState({});
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedMandal, setSelectedMandal] = useState("");
  const [mandals, setMandals] = useState([]);
  const [partyName, setPartyName] = useState("");
  const [partyMembershipIdPic, setPartyMembershipIdPic] = useState(null);
  const [partyMembershipIdPicUrl, setPartyMembershipIdPicUrl] = useState(null);
  const [partyMembershipIdPicUploadProgress, setPartyMembershipIdPicUploadProgress] = useState(null);
  const [partyMembershipIdPicUploading, setPartyMembershipIdPicUploading] = useState(false);

  const { leadId } = useParams();

  useEffect(() => {
    // Fetch all districts when the component mounts
    fetch("/api/leader/dist")
      .then((response) => response.json())
      .then((data) => setDistricts(data))
      .catch((error) => console.error("Error fetching districts:", error));
  }, []);

  useEffect(() => {
    if (leadId) {
      // Fetch MLA details when the component mounts or MLA ID changes
      fetch(`/api/leader/getlead?leadId=${leadId}`)
        .then((res) => res.json())
        .then((data) => {
          setFormData(data[0]);
          
        })
        .catch((error) => console.error("Error fetching MLA data:", error));
    }
  }, [leadId]);

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);
  useEffect(() => {
    if (partyMembershipIdPic) {
      uploadPartyMembershipIdPic();
    }
  }, [partyMembershipIdPic]);

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
    setFormData({ ...formData, constituencies: e.target.value });
  };

  const handlepartyChange = (e) => {
    setPartyName(e.target.value);
    setFormData({ ...formData, partyName: e.target.value });
  };

  const filePickerRef = useRef();
  const partyMembershipIdPicPickerRef= useRef()
console.log(formData);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };
  const handlePartyMembershipIdPicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPartyMembershipIdPic(file);
      setPartyMembershipIdPicUrl(URL.createObjectURL(file));
    }
  };

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
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError("Could not upload image (File must be less than 2MB)");
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
  const uploadPartyMembershipIdPic = async () => {
    setPartyMembershipIdPicUploading(true);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + partyMembershipIdPic.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, partyMembershipIdPic);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setPartyMembershipIdPicUploadProgress(progress.toFixed(0));
      },
      (error) => {
        console.error("Error uploading partyMembershipIdPic:", error);
        setPartyMembershipIdPicUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setPartyMembershipIdPicUrl(downloadURL);
          setFormData({ ...formData, partyMembershipIdpicture: downloadURL });
          setPartyMembershipIdPicUploading(false);
        });
      }
    );
  };


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

 

  

 

  

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/leader/update?leadId=${leadId}`, {
        method: 'PUT',
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
        setUpdateUserSuccess("MLA updated successfully!");
        setFormData({});
        navigate(`/dashboard?tab=leaders`);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Update MLA</h1>
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
            src={imageFileUrl || formData.profilePicture}
            alt="Add MLA photo"
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
          placeholder="Name"
          onChange={handleChange}
          value={formData.name}
        />
        <TextInput
          type="text"
          id="fatherName"
          placeholder="Enter Father Name"
          onChange={handleChange}
          value={formData.fatherName}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="Enter Email"
          onChange={handleChange}
          value={formData.email}
        />
        <Select
          value={formData.partyName || partyName}
          onChange={handlepartyChange}
          id="partyName"
        >
          <option value="">Select Party Name</option>
          <option value="TDP">TDP</option>
          <option value="JSP">JSP</option>
          <option value="BJP">BJP</option>
          <option value="INC">INC</option>
          <option value="YCP">YCP</option>
          <option value="OTHERS">OTHERS</option>
        </Select>
        <TextInput
          type="number"
          id="age"
          placeholder="Age"
          onChange={handleChange}
          value={formData.age}
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
          value={selectedMandal || formData.constituencies}
          onChange={handleMandalChange}
          disabled={mandals.length === 0}
          id="constituencies"
        >
          <option value="">Select a Constituency</option>
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
          value={formData.phoneNumber}
        />
        <TextInput
          type="text"
          id="address"
          placeholder="Address"
          onChange={handleChange}
          value={formData.address}
        />
         <TextInput
          type="text"
          id="village"
          placeholder="village"
          onChange={handleChange}
          value={formData.village}
        />
        <TextInput
          type="text"
          id="designation"
          placeholder="designation"
          onChange={handleChange}
          value={formData.designation}
        />
        <TextInput
          type="text"
          id="partyMembershipId"
          placeholder="partyMembershipId"
          onChange={handleChange}
          value={formData.partyMembershipId}
        />
        <TextInput
          type="text"
          id="Qualification"
          placeholder="Qualification"
          onChange={handleChange}
          value={formData.Qualification}
        />
         {/* Party Membership ID Picture */}
         
        {partyMembershipIdPicUploading && (
          <div>
            <CircularProgressbar
              value={partyMembershipIdPicUploadProgress || 0}
              text={`${partyMembershipIdPicUploadProgress || 0}%`}
            />
          </div>
        )}
        <input type='file'
          id="partyMembershipIdpicture"
          accept="image/*"
          onChange={handlePartyMembershipIdPicChange}
          ref={partyMembershipIdPicPickerRef}
          hidden={ formData.partyMembershipIdpicture}
        />
        {formData.partyMembershipIdpicture  && (
          <div  onClick={() => partyMembershipIdPicPickerRef.current.click()}>
            <img
              src={partyMembershipIdPicUrl || formData.partyMembershipIdpicture}
              alt="Party Membership ID Preview"
              className="h-40 w-40 object-cover mt-2 rounded-full"
            />
          </div>
        )}
       
        
        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          outline
          disabled={loading || imageFileUploading }
          className="mt-6"
        >
          {loading ? 'Loading...' : 'Update Leader'}
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
