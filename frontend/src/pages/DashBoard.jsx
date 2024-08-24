import { useEffect, useState } from 'react';
import { useLocation,Navigate } from 'react-router-dom';
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';
import DashUsers from '../components/DashUsers';
import DashAddMla from '../components/DashAddMla';
import DashMla from '../components/DashMla';
import DashboardComp from '../components/DashboardComp';
import DashLeaders from '../components/DashLeaders';
import { useSelector } from 'react-redux';
import DashAddLeaders from '../components/DashAddLeaders';
import DashTickets from '../components/DashTickets';
import DashTic from '../components/DashTic';
export default function DashBoard() {
  const { currentUser } = useSelector((state) => state.user);
    const location = useLocation();
    const [tab,setTab] = useState('')
    useEffect(()=>{
    
      const urlParams = new URLSearchParams(location.search);
      const tabFromUrl = urlParams.get('tab');
      if (tabFromUrl) {
        setTab(tabFromUrl);
      }
      
      
      
    },[location.search])
  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
    <div className='md:w-56'>
      {/* Sidebar */}
      <DashSidebar />
    </div>
    {tab === 'profile' && <DashProfile />}
    {/* users */}
    {tab === 'users' && <DashUsers />}
    {tab === 'create' && currentUser.isAdmin && <DashAddMla />}
    {tab === 'mlas' && <DashMla />}
    {tab === 'dash' && <DashboardComp />}
    {tab === 'leaders' && <DashLeaders />}
    {tab === 'lead' && <DashAddLeaders />}
    {tab === 'tickets' && <DashTickets />}
    {tab === 'tic' && <DashTic />}
  </div>
  )
}
