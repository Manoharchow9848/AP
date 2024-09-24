import React from 'react'





import { Table,Modal,Button } from "flowbite-react";
import { useEffect, useState } from "react"
import {useSelector} from 'react-redux'
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Link ,useNavigate} from "react-router-dom";


export default function DashTickets() {
    const {currentUser} = useSelector((state)=>state.user)
  const [mla,setMla] = useState([])
  const [showMore,setShowMore] = useState(true);
  const [showModal,setShowModal] = useState(false); 
  const [mlaIdtoDelete,setMlaIdtoDelete]=useState('')
  const Navigate = useNavigate()
  const status="solved"
  useEffect(()=>{
    const fetchPosts = async()=>{
      try {
        const res = await fetch(`/api/leader/getTic`)
        const data = await res.json();
                  
        if(res.ok){
          
         console.log(data);
         setMla(data)
        
         
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
     const res = await fetch(`/api/leader/deleteticket?ticketId=${mlaIdtoDelete}`,
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


const handleUpdateStatus = async(ticketId)=>{
  try {
    const res = await fetch(`/api/leader/updateStatus?ticketId=${ticketId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({status }),
    });
    const fetchPosts = async()=>{
      try {
        const res = await fetch(`/api/leader/getTic`)
        const data = await res.json();
                  
        if(res.ok){
          
         console.log(data);
         setMla(data)
        
         
        }
      } catch (error) {
        console.log(error.message);
        
      }
      
    }
    if(currentUser.isAdmin){
      fetchPosts();
    }
    
    
    
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
        
        <Table.HeadCell> name</Table.HeadCell>
        <Table.HeadCell> email</Table.HeadCell>
        <Table.HeadCell> district</Table.HeadCell>
        <Table.HeadCell> mandal</Table.HeadCell>
        <Table.HeadCell> phoneNumber</Table.HeadCell>
        <Table.HeadCell> department</Table.HeadCell>
        <Table.HeadCell> referredBy</Table.HeadCell>
        <Table.HeadCell>referredName</Table.HeadCell>
        <Table.HeadCell> problemDescription</Table.HeadCell>
        <Table.HeadCell> village</Table.HeadCell>
        <Table.HeadCell> problemDurationDays</Table.HeadCell>
        <Table.HeadCell> problemType</Table.HeadCell>
        <Table.HeadCell> Attached Files</Table.HeadCell>
        <Table.HeadCell> status</Table.HeadCell>
        <Table.HeadCell> Delete</Table.HeadCell>
        
       
      </Table.Head>
      {mla.map((ml)=>(
        <Table.Body className="divide-y">
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell>{new Date(ml.updatedAt).toLocaleDateString()}</Table.Cell>
            
            <Table.Cell>
              <h1 className="font-medium text-gray-900 dark:text-white">
              {ml.name} </h1>
              </Table.Cell>
            <Table.Cell>{ml.email}</Table.Cell>
            <Table.Cell>{ml.district}</Table.Cell>
            <Table.Cell>{ml.mandal}</Table.Cell>
            <Table.Cell>{ml.phoneNumber}</Table.Cell>
            <Table.Cell>{ml.department.join(", ")}</Table.Cell>
            <Table.Cell>{ml.referredBy}</Table.Cell>
            <Table.Cell>{ml.referredName}</Table.Cell>
            <Table.Cell>{ml.problemDescription}</Table.Cell>
            <Table.Cell>{ml.village}</Table.Cell>
            <Table.Cell>{ml.problemDurationDays}</Table.Cell>
            <Table.Cell>{ml.problemType}</Table.Cell>

            <Table.Cell>
              
              
              {ml.documentUrl===null?
                <h1>No files</h1>:
                <Link className='hover:underline text-green-500' to={`${ml.documentUrl}`}>click here to view</Link>}
              
              
              </Table.Cell>


            {
                ml.status=="pending"?<Table.Cell className='text-red-800 font-bold text-xl'>  <Button onClick={() => handleUpdateStatus(ml._id)}>
                {ml.status}
              </Button> </Table.Cell >:<Table.Cell className='text-green-800 font-semibold text-xl'><Button disabled>{ml.status}</Button></Table.Cell>
            }
<Table.Cell>
            <span  onClick={() => {setShowModal(true)
                setMlaIdtoDelete(ml._id)}
              } className="font-medium text-red-500 hover:underline cursor-pointer">
                Delete
              </span>
            </Table.Cell>

          </Table.Row>
        </Table.Body>
      ))}
     </Table>
     
     </>:
     <p>YOU HAVE NO TICKETS YET</p>
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
            Are you sure you want to delete this ticket?
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


