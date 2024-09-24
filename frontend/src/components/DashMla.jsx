import { Table,Modal,Button } from "flowbite-react";
import { useEffect, useState } from "react"
import {useSelector} from 'react-redux'
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Link } from "react-router-dom";


export default function DashMla() {
    const {currentUser} = useSelector((state)=>state.user)
  const [mla,setMla] = useState([])
  const [showMore,setShowMore] = useState(true);
  const [showModal,setShowModal] = useState(false); 
  const [mlaIdtoDelete,setMlaIdtoDelete]=useState('')
  useEffect(()=>{
    const fetchPosts = async()=>{
      try {
        const res = await fetch(`/api/mla/getmla`)
        const data = await res.json();
                  
        if(res.ok){
          
         console.log(data);
         setMla(data)
         console.log(mla[0]._id)
         
        }
      } catch (error) {
        console.log(error.message);
        
      }
      
    }
    if(currentUser.isAdmin){
      fetchPosts();
    }
},[currentUser._id])
const handleDeleteMla = async()=>{
  try {
     const res = await fetch(`/api/mla/delete?mlaId=${mlaIdtoDelete}`,
       {
         method:'DELETE',
       }
     );
     const data = await res.json();
     if(!res.ok){
       console.log(data.message);
       
     }else{
       setMla((prev)=>
         prev.filter((mla)=>mla._id!==mlaIdtoDelete)
     );

     }
     setShowModal(false);
    
  } catch (error) {
   console.log(error.message);
   
  }
}
  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 
    scrollbar-track-slate-100 scrollbar-thumb-slate-300
    dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
     {currentUser.isAdmin && mla.length>0?
     <>
     <Table hoverable className="shadow-md">
      <Table.Head>
        <Table.HeadCell>Date Updated</Table.HeadCell>
        <Table.HeadCell>mla Image</Table.HeadCell>
        <Table.HeadCell>mla name</Table.HeadCell>
        <Table.HeadCell>mla email</Table.HeadCell>
        <Table.HeadCell>mla Parliament</Table.HeadCell>
        <Table.HeadCell>mla ASSEMBLY</Table.HeadCell>
        <Table.HeadCell>mla phoneNumber</Table.HeadCell>
        <Table.HeadCell>mla address</Table.HeadCell>
        <Table.HeadCell>mla partyName</Table.HeadCell>
        <Table.HeadCell>mla age</Table.HeadCell>
        <Table.HeadCell>Delete</Table.HeadCell>
        <Table.HeadCell><span>Edit</span></Table.HeadCell>
      </Table.Head>
      {mla.map((ml)=>(
        <Table.Body className="divide-y">
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell>{new Date(ml.updatedAt).toLocaleDateString()}</Table.Cell>
            <Table.Cell>
              
              <img  
                src={ml.profilePicture}
                alt={ml.name}
                className="w-20 h-10 object-cover bg-gray-500"
              />
              
            </Table.Cell>
            <Table.Cell>
              <h1 className="font-medium text-gray-900 dark:text-white">
              {ml.name} </h1>
              </Table.Cell>
            <Table.Cell>{ml.email}</Table.Cell>
            <Table.Cell>{ml.district}</Table.Cell>
            <Table.Cell>{ml.constituencies}</Table.Cell>
            <Table.Cell>{ml.phoneNumber}</Table.Cell>
            <Table.Cell>{ml.address}</Table.Cell>
            <Table.Cell>{ml.partyName}</Table.Cell>
            <Table.Cell>{ml.age}</Table.Cell>
            <Table.Cell>
            <span  onClick={() => {setShowModal(true)
                setMlaIdtoDelete(ml._id)}
              } className="font-medium text-red-500 hover:underline cursor-pointer">
                Delete
              </span>
            </Table.Cell>
            <Table.Cell>
             
                <Link to={`/update-mla/${ml._id}`} className="text-teal-500 hover:underline" >Edit</Link>
                
              
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      ))}
     </Table>
     
     </>:
     <p>YOU HAVE NO MLA YET</p>
     }
      <Modal
      show={showModal}
      onClose={() => setShowModal(false)}
      popup
      size='md'
    >
      <Modal.Header />
      <Modal.Body>
        <div className='text-center'>
          <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
          <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
            Are you sure you want to delete MLA?
          </h3>
          <div className='flex justify-center gap-4'>
            <Button color='failure' onClick={handleDeleteMla}>
              Yes, I'm sure
            </Button>
            <Button color='gray' onClick={() => setShowModal(false)}>
              No, cancel
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal> 
    </div>
  )
}
