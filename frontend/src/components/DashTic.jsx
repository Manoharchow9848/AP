
import React from 'react'





import { Table,Modal,Button } from "flowbite-react";
import { useEffect, useState } from "react"
import {useSelector} from 'react-redux'
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Link ,useNavigate} from "react-router-dom";


export default function DashTic() {
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
        const res = await fetch(`/api/leader/getTic?userId=${currentUser._id}`)
        const data = await res.json();
                  
        if(res.ok){
          
         console.log(data);
         setMla(data)
        
         
        }
      } catch (error) {
        console.log(error.message);
        
      }
      
    }
    
      fetchPosts();
    
},[currentUser._id])


  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 
    scrollbar-track-slate-100 scrollbar-thumb-slate-300
    dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
     {!currentUser.isAdmin && mla.length>0?
     <>
     <Table hoverable className="shadow-md">
      <Table.Head>
        <Table.HeadCell>Date Updated</Table.HeadCell>
        
        <Table.HeadCell> name</Table.HeadCell>
        <Table.HeadCell> email</Table.HeadCell>
        <Table.HeadCell> district</Table.HeadCell>
        <Table.HeadCell> mandal</Table.HeadCell>
        <Table.HeadCell> phoneNumber</Table.HeadCell>
        <Table.HeadCell> referredBy</Table.HeadCell>
        <Table.HeadCell>referredName</Table.HeadCell>
        <Table.HeadCell> problemDescription</Table.HeadCell>
        <Table.HeadCell> village</Table.HeadCell>
        <Table.HeadCell> problemDurationDays</Table.HeadCell>
        <Table.HeadCell> problemType</Table.HeadCell>
        
        <Table.HeadCell><span>Status</span></Table.HeadCell>
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
            <Table.Cell>{ml.referredBy}</Table.Cell>
            <Table.Cell>{ml.referredName}</Table.Cell>
            <Table.Cell>{ml.problemDescription}</Table.Cell>
            <Table.Cell>{ml.village}</Table.Cell>
            <Table.Cell>{ml.problemDurationDays}</Table.Cell>
            <Table.Cell>{ml.problemType}</Table.Cell>
            {
                ml.status=="pending"?<Table.Cell className='text-red-800 font-bold text-xl'>  <span >
                {ml.status}
              </span> </Table.Cell >:<Table.Cell className='text-green-400 font-semibold text-xl'><span >{ml.status}</span></Table.Cell>
            }


          </Table.Row>
        </Table.Body>
      ))}
     </Table>
     
     </>:
     <p>YOU HAVE NO TICKETS YET</p>
     }
       
    </div>
  )
}



