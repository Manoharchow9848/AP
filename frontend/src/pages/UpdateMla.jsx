import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useEffect, useState,useRef } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function UpdateMla() {
  const navigate = useNavigate()
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
  const [partyName,setPartyName]=useState("");

    const { mlaId } = useParams();
   
    useEffect(() => {
        // Fetch all districts when the component mounts
        fetch("/api/districts")
          .then((response) => response.json())
          .then((data) => setDistricts(data))
          .catch((error) => console.error("Error fetching districts:", error));
      }, []);
      console.log(formData);
      
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
        try {
          const fetchPost = async () => {
            const res = await fetch(`/api/mla/getmla?mlaId=${mlaId}`);
            const data = await res.json();
            if (!res.ok) {
              console.log(data.message); 
              
              setPublishError(data.message);
              return;
            }
            if (res.ok) {
              
              setFormData(data[0]);
            }
          };
    
          fetchPost();
        } catch (error) {
          console.log(error.message);
        }
      }, [mlaId]);
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
        
        try {
          const res = await fetch(`/api/mla/update?mlaId=${mlaId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
          const data = await res.json();
          if (!res.ok) {
            setPublishError(data.message);
            return;
          }
    
          if (res.ok) {
            
            navigate(`/dashboard?tab=mlas`);
          }
        } catch (error) {
          console.log(error.message);
          
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
            src={imageFileUrl || formData.profilePicture}
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
          value={formData.age}
        />
        <Select
          value={selectedDistrict }
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
        <Select
          value={selectedMandal || formData.constituencies}
          onChange={handleMandalChange}
          disabled={ mandals.length==0 }
          id="constituencies"
        >
          <option value="">Select a constituencies</option>
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
          value={formData.phoneNumber}
        />
        <TextInput
          type="text"
          id="address"
          placeholder="Enter Address"
          onChange={handleChange}
          value={formData.address}
        />
         <TextInput
          type="text"
          id="Qualification"
          placeholder="Enter Qualification"
          value={formData.Qualification}
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
  )
}
